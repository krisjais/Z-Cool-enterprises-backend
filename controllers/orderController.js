const Order = require('../models/Order');

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private (Admin)
exports.getOrders = async (req, res) => {
  try {
    const { orderType, status, search } = req.query;
    const query = {};

    if (orderType && orderType !== 'all') {
      query.orderType = orderType.toUpperCase();
    }

    if (status && status !== 'all') {
      query.status = status.toUpperCase();
    }

    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { id: searchRegex },
        { productName: searchRegex },
        { 'customer.name': searchRegex },
        { 'customer.company': searchRegex },
        { 'customer.phone': searchRegex },
      ];
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create an order
// @route   POST /api/orders
// @access  Private (Admin)
exports.createOrder = async (req, res) => {
  try {
    const { orderType, productId, productName, quantity, customer, status, notes } = req.body;

    if (!productId || !productName || !customer || !customer.name || !customer.phone) {
      return res.status(400).json({
        success: false,
        message: 'Product, customer name, and customer phone are required.',
      });
    }

    const order = await Order.create({
      orderType: orderType === 'ONLINE' ? 'ONLINE' : 'OFFLINE',
      productId: productId.trim(),
      productName: productName.trim(),
      quantity: parseInt(quantity, 10) || 1,
      customer: {
        name: customer.name.trim(),
        company: customer.company ? customer.company.trim() : '',
        phone: customer.phone.trim(),
        email: customer.email ? customer.email.trim() : '',
        city: customer.city ? customer.city.trim() : 'Mumbai',
      },
      status: status || 'CONFIRMED',
      notes: notes || '',
    });

    res.status(201).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order status / details
// @route   PUT /api/orders/:id
// @access  Private (Admin)
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      $or: [
        { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null },
        { id: req.params.id },
      ],
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const allowed = ['status', 'quantity', 'notes', 'orderType', 'customer'];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        order[field] = req.body[field];
      }
    });

    order.updatedAt = Date.now();
    await order.save();

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete an order
// @route   DELETE /api/orders/:id
// @access  Private (Admin)
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({
      $or: [
        { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null },
        { id: req.params.id },
      ],
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
