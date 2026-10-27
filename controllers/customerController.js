const ContactRequest = require('../models/ContactRequest');
const Order = require('../models/Order');

/**
 * @desc    Get real customer profiles aggregated from Orders and Contact Requests
 * @route   GET /api/customers
 * @access  Private (Admin)
 */
exports.getCustomers = async (req, res) => {
  try {
    const { search, limit = 50, page = 1, type = 'all' } = req.query;

    // Fetch orders and inquiries concurrently
    const [orders, inquiries] = await Promise.all([
      Order.find().sort({ createdAt: -1 }),
      ContactRequest.find().sort({ createdAt: -1 }),
    ]);

    // Map to aggregate customers by normalized contact key
    const customerMap = new Map();

    const normalizeKey = (phone, email, name) => {
      if (phone) {
        // Strip non-digit characters except leading plus
        const cleanPhone = phone.replace(/[^0-9]/g, '');
        if (cleanPhone.length >= 7) return `phone:${cleanPhone.slice(-10)}`;
      }
      if (email && email.trim()) {
        return `email:${email.trim().toLowerCase()}`;
      }
      return `name:${(name || 'anonymous').trim().toLowerCase()}`;
    };

    // 1. Process Contact Requests (Inquiries & Quote Requests)
    inquiries.forEach((inq) => {
      const key = normalizeKey(inq.phone, inq.email, inq.name);
      if (!customerMap.has(key)) {
        customerMap.set(key, {
          id: `CUST-${inq._id}`,
          name: inq.name || 'Unnamed Contact',
          phone: inq.phone || '',
          email: inq.email || '',
          company: inq.company || '',
          city: '',
          inquiriesCount: 0,
          ordersCount: 0,
          inquiries: [],
          orders: [],
          firstSeen: inq.createdAt || new Date(),
          lastActivity: inq.createdAt || new Date(),
        });
      }

      const record = customerMap.get(key);
      record.inquiriesCount += 1;
      if (!record.email && inq.email) record.email = inq.email;
      if (!record.company && inq.company) record.company = inq.company;
      if (!record.phone && inq.phone) record.phone = inq.phone;

      if (inq.createdAt && inq.createdAt < record.firstSeen) {
        record.firstSeen = inq.createdAt;
      }
      if (inq.createdAt && inq.createdAt > record.lastActivity) {
        record.lastActivity = inq.createdAt;
      }

      record.inquiries.push({
        id: inq._id,
        type: inq.type,
        model: inq.details?.model || '',
        brand: inq.details?.brand || '',
        quantity: inq.details?.quantity || '1 Unit',
        message: inq.message || '',
        status: inq.status,
        nameplatePhoto: inq.details?.nameplatePhoto?.url || '',
        createdAt: inq.createdAt,
      });
    });

    // 2. Process Orders
    orders.forEach((ord) => {
      const c = ord.customer || {};
      const key = normalizeKey(c.phone, c.email, c.name);

      if (!customerMap.has(key)) {
        customerMap.set(key, {
          id: `CUST-${ord._id}`,
          name: c.name || ord.customerName || 'Customer',
          phone: c.phone || ord.customerPhone || '',
          email: c.email || ord.customerEmail || '',
          company: c.company || ord.customerCompany || '',
          city: c.city || ord.customerCity || 'Mumbai',
          inquiriesCount: 0,
          ordersCount: 0,
          inquiries: [],
          orders: [],
          firstSeen: ord.createdAt || new Date(),
          lastActivity: ord.createdAt || new Date(),
        });
      }

      const record = customerMap.get(key);
      record.ordersCount += 1;
      if (!record.company && c.company) record.company = c.company;
      if (!record.city && c.city) record.city = c.city;
      if (!record.email && c.email) record.email = c.email;
      if (!record.phone && c.phone) record.phone = c.phone;

      if (ord.createdAt && ord.createdAt < record.firstSeen) {
        record.firstSeen = ord.createdAt;
      }
      if (ord.createdAt && ord.createdAt > record.lastActivity) {
        record.lastActivity = ord.createdAt;
      }

      record.orders.push({
        id: ord.id || ord._id,
        orderType: ord.orderType,
        productName: ord.productName,
        productId: ord.productId,
        quantity: ord.quantity,
        status: ord.status,
        createdAt: ord.createdAt,
      });
    });

    let customerList = Array.from(customerMap.values());

    // Sort by latest activity desc
    customerList.sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity));

    // Filter by type
    if (type === 'orders') {
      customerList = customerList.filter((c) => c.ordersCount > 0);
    } else if (type === 'inquiries') {
      customerList = customerList.filter((c) => c.inquiriesCount > 0);
    }

    // Search filter
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      customerList = customerList.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.company.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q)
      );
    }

    const total = customerList.length;
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 50;
    const paginated = customerList.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    res.status(200).json({
      success: true,
      total,
      count: paginated.length,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      data: paginated,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
