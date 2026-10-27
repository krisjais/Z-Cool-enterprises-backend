const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');
const Shipment = require('../models/Shipment');
const ContactRequest = require('../models/ContactRequest');

/**
 * @desc    Get comprehensive analytics aggregated from real database models
 * @route   GET /api/analytics
 * @access  Private (Admin)
 */
exports.getAnalytics = async (req, res) => {
  try {
    const [
      products,
      categories,
      orders,
      shipments,
      inquiries,
    ] = await Promise.all([
      Product.find().select('category brand availability condition name code'),
      Category.find().select('name slug isActive sortOrder'),
      Order.find().sort({ createdAt: -1 }),
      Shipment.find().sort({ createdAt: -1 }),
      ContactRequest.find().sort({ createdAt: -1 }),
    ]);

    // 1. PRODUCT METRICS
    const totalProducts = products.length;
    const availabilityCounts = {};
    const brandCounts = {};
    const categoryCounts = {};

    products.forEach((p) => {
      const avail = p.availability || 'UNKNOWN';
      availabilityCounts[avail] = (availabilityCounts[avail] || 0) + 1;

      const brand = p.brand || 'Other';
      brandCounts[brand] = (brandCounts[brand] || 0) + 1;

      const cat = p.category || 'Uncategorized';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    // Top categories by product count
    const topCategories = Object.entries(categoryCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    // 2. CATEGORY METRICS
    const totalCategories = categories.length;
    const activeCategories = categories.filter((c) => c.isActive !== false).length;
    const inactiveCategories = totalCategories - activeCategories;

    // 3. ORDER METRICS
    const totalOrders = orders.length;
    const ordersByStatus = {
      PENDING: 0,
      CONFIRMED: 0,
      PROCESSING: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    };
    const ordersByType = {
      ONLINE: 0,
      OFFLINE: 0,
    };
    let totalUnitsOrdered = 0;
    const productOrderVolume = {};
    const ordersMonthlyMap = {};

    orders.forEach((o) => {
      const st = o.status || 'CONFIRMED';
      ordersByStatus[st] = (ordersByStatus[st] || 0) + 1;

      const ot = o.orderType || 'OFFLINE';
      ordersByType[ot] = (ordersByType[ot] || 0) + 1;

      const qty = Number(o.quantity) || 1;
      if (st !== 'CANCELLED') {
        totalUnitsOrdered += qty;
        const pKey = o.productName || o.productId || 'Unknown Item';
        productOrderVolume[pKey] = (productOrderVolume[pKey] || 0) + qty;
      }

      if (o.createdAt) {
        const d = new Date(o.createdAt);
        const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        ordersMonthlyMap[monthKey] = (ordersMonthlyMap[monthKey] || 0) + 1;
      }
    });

    const topSellingProducts = Object.entries(productOrderVolume)
      .map(([name, units]) => ({ name, units }))
      .sort((a, b) => b.units - a.units)
      .slice(0, 5);

    const ordersOverTime = Object.entries(ordersMonthlyMap)
      .map(([period, count]) => ({ period, count }))
      .sort((a, b) => a.period.localeCompare(b.period));

    // 4. SHIPMENT METRICS
    const totalShipments = shipments.length;
    const shipmentsByStatus = {
      PROCESSING: 0,
      SHIPPED: 0,
      'IN TRANSIT': 0,
      DELIVERED: 0,
    };
    shipments.forEach((s) => {
      const st = s.status || 'SHIPPED';
      shipmentsByStatus[st] = (shipmentsByStatus[st] || 0) + 1;
    });
    const activeShipments = (shipmentsByStatus.PROCESSING || 0) +
      (shipmentsByStatus.SHIPPED || 0) +
      (shipmentsByStatus['IN TRANSIT'] || 0);

    // 5. INQUIRY METRICS
    const totalInquiries = inquiries.length;
    const inquiriesByStatus = {
      pending: 0,
      'in-progress': 0,
      resolved: 0,
    };
    const inquiriesByType = {
      quote: 0,
      callback: 0,
      dealer: 0,
      general: 0,
    };
    inquiries.forEach((inq) => {
      const st = inq.status || 'pending';
      inquiriesByStatus[st] = (inquiriesByStatus[st] || 0) + 1;

      const tp = inq.type || 'quote';
      inquiriesByType[tp] = (inquiriesByType[tp] || 0) + 1;
    });

    res.status(200).json({
      success: true,
      data: {
        overview: {
          totalProducts,
          totalCategories,
          totalOrders,
          totalUnitsOrdered,
          activeShipments,
          totalShipments,
          totalInquiries,
          pendingInquiries: inquiriesByStatus.pending || 0,
        },
        revenue: {
          isAvailable: false,
          currency: 'INR',
          note: 'Direct monetary transactions are not processed in-app; orders represent industrial B2B dispatches and quotes with volume tracked in units.',
        },
        products: {
          total: totalProducts,
          byAvailability: availabilityCounts,
          byBrand: brandCounts,
          topCategories,
        },
        categories: {
          total: totalCategories,
          active: activeCategories,
          inactive: inactiveCategories,
        },
        orders: {
          total: totalOrders,
          byStatus: ordersByStatus,
          byType: ordersByType,
          topSelling: topSellingProducts,
          overTime: ordersOverTime,
          recent: orders.slice(0, 5),
        },
        shipments: {
          total: totalShipments,
          active: activeShipments,
          byStatus: shipmentsByStatus,
          recent: shipments.slice(0, 5),
        },
        inquiries: {
          total: totalInquiries,
          byStatus: inquiriesByStatus,
          byType: inquiriesByType,
          recent: inquiries.slice(0, 5),
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
