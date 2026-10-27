const Setting = require('../models/Setting');

// Default initial settings matching verified company details
const DEFAULT_SETTINGS = {
  companyName: 'Z Cool Enterprises',
  businessEmail: 'zcooltech4@gmail.com',
  businessPhone: '+91 99209 06508',
  secondaryPhone: '+91 98921 58245',
  address: 'Shop No. 4, Ground Floor, Mumbai Central Sourcing Hub, Mumbai, Maharashtra 400008, India',
  operatingHours: 'Monday – Saturday: 9:30 AM – 7:30 PM IST',
  dispatchOrigin: 'Mumbai Central Sourcing Hub, MH',
  orderNotificationEmail: 'zcooltech4@gmail.com',
  defaultStockFilter: 'all',
  autoConfirmOrders: true,
  updatedBy: 'Admin',
};

/**
 * @desc    Get current store and business settings
 * @route   GET /api/settings
 * @access  Private (Admin)
 */
exports.getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();

    if (!settings) {
      settings = await Setting.create(DEFAULT_SETTINGS);
    }

    res.status(200).json({
      success: true,
      data: settings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update store and business settings
 * @route   PUT /api/settings
 * @access  Private (Admin)
 */
exports.updateSettings = async (req, res) => {
  try {
    const {
      companyName,
      businessEmail,
      businessPhone,
      secondaryPhone,
      address,
      operatingHours,
      dispatchOrigin,
      orderNotificationEmail,
      defaultStockFilter,
      autoConfirmOrders,
    } = req.body;

    if (companyName && !companyName.trim()) {
      return res.status(400).json({ success: false, message: 'Company name cannot be empty' });
    }

    if (businessEmail && !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/.test(businessEmail.trim())) {
      return res.status(400).json({ success: false, message: 'Please provide a valid business email' });
    }

    if (businessPhone && businessPhone.trim().length < 7) {
      return res.status(400).json({ success: false, message: 'Please provide a valid business phone number' });
    }

    let settings = await Setting.findOne();

    if (!settings) {
      settings = new Setting(DEFAULT_SETTINGS);
    }

    if (companyName !== undefined) settings.companyName = companyName.trim();
    if (businessEmail !== undefined) settings.businessEmail = businessEmail.trim().toLowerCase();
    if (businessPhone !== undefined) settings.businessPhone = businessPhone.trim();
    if (secondaryPhone !== undefined) settings.secondaryPhone = secondaryPhone.trim();
    if (address !== undefined) settings.address = address.trim();
    if (operatingHours !== undefined) settings.operatingHours = operatingHours.trim();
    if (dispatchOrigin !== undefined) settings.dispatchOrigin = dispatchOrigin.trim();
    if (orderNotificationEmail !== undefined) settings.orderNotificationEmail = orderNotificationEmail.trim().toLowerCase();
    if (defaultStockFilter !== undefined) settings.defaultStockFilter = defaultStockFilter;
    if (autoConfirmOrders !== undefined) settings.autoConfirmOrders = Boolean(autoConfirmOrders);

    if (req.admin && req.admin.username) {
      settings.updatedBy = req.admin.username;
    }

    await settings.save();

    res.status(200).json({
      success: true,
      message: 'Settings updated successfully',
      data: settings,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
