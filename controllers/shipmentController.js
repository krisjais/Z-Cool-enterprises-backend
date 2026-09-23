const Shipment = require('../models/Shipment');

// @desc    Get all shipments
// @route   GET /api/shipments
// @access  Private (Admin)
exports.getShipments = async (req, res) => {
  try {
    const { status, search } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status.toUpperCase();
    }

    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { id: searchRegex },
        { trackingNumber: searchRegex },
        { courier: searchRegex },
        { productName: searchRegex },
        { shippedTo: searchRegex },
        { shippedFrom: searchRegex },
      ];
    }

    const shipments = await Shipment.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: shipments.length,
      data: shipments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a shipment
// @route   POST /api/shipments
// @access  Private (Admin)
exports.createShipment = async (req, res) => {
  try {
    const {
      orderId,
      productId,
      productName,
      quantity,
      shippedFrom,
      shippedTo,
      courier,
      trackingNumber,
      status,
      notes,
    } = req.body;

    if (!productId || !productName || !shippedTo || !courier || !trackingNumber) {
      return res.status(400).json({
        success: false,
        message: 'Product, Destination (Shipped To), Courier, and Tracking Number are required.',
      });
    }

    const shipment = await Shipment.create({
      orderId: orderId || '',
      productId: productId.trim(),
      productName: productName.trim(),
      quantity: parseInt(quantity, 10) || 1,
      shippedFrom: shippedFrom ? shippedFrom.trim() : 'Mumbai Central Sourcing Hub, MH',
      shippedTo: shippedTo.trim(),
      courier: courier.trim(),
      trackingNumber: trackingNumber.trim(),
      status: status || 'SHIPPED',
      notes: notes || '',
    });

    res.status(201).json({ success: true, data: shipment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update shipment tracking status
// @route   PUT /api/shipments/:id
// @access  Private (Admin)
exports.updateShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findOne({
      $or: [
        { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null },
        { id: req.params.id },
      ],
    });

    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    const allowed = [
      'status',
      'courier',
      'trackingNumber',
      'shippedFrom',
      'shippedTo',
      'quantity',
      'notes',
    ];

    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        shipment[field] = req.body[field];
      }
    });

    shipment.updatedAt = Date.now();
    await shipment.save();

    res.status(200).json({ success: true, data: shipment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a shipment record
// @route   DELETE /api/shipments/:id
// @access  Private (Admin)
exports.deleteShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findOneAndDelete({
      $or: [
        { _id: req.params.id.match(/^[0-9a-fA-F]{24}$/) ? req.params.id : null },
        { id: req.params.id },
      ],
    });

    if (!shipment) {
      return res.status(404).json({ success: false, message: 'Shipment not found' });
    }

    res.status(200).json({ success: true, message: 'Shipment record deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
