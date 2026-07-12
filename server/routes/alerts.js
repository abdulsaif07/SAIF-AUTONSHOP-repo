// server/routes/alerts.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const PriceAlert = require('../models/PriceAlert');
const User = require('../models/User');
const { sendPriceAlertEmail } = require('../services/emailService');

// @route   POST /api/alerts
// @desc    Create a new price alert
router.post('/', auth, async (req, res) => {
  const { productTitle, productLink, targetPrice, currentPrice } = req.body;
  try {
    const newAlert = new PriceAlert({
      user: req.user.id,
      productTitle,
      productLink,
      targetPrice,
      currentPrice
    });
    const alert = await newAlert.save();
    res.json(alert);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/alerts
// @desc    Get user's price alerts
router.get('/', auth, async (req, res) => {
  try {
    const alerts = await PriceAlert.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(alerts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   DELETE /api/alerts/:id
// @desc    Delete an alert
router.delete('/:id', auth, async (req, res) => {
  try {
    const alert = await PriceAlert.findById(req.params.id);
    if (!alert) return res.status(404).json({ msg: 'Alert not found' });
    if (alert.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    await PriceAlert.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Alert removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/alerts/test-email
// @desc    Trigger a test email for an alert (demo purposes)
router.post('/test-email/:id', auth, async (req, res) => {
  try {
    const alert = await PriceAlert.findById(req.params.id);
    if (!alert) return res.status(404).json({ msg: 'Alert not found' });
    if (alert.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });

    const user = await User.findById(req.user.id);
    
    // Simulate a price drop
    const mockDroppedPrice = alert.targetPrice - 100;
    
    await sendPriceAlertEmail(user.email, alert.productTitle, alert.targetPrice, mockDroppedPrice, alert.productLink);
    
    res.json({ msg: 'Test email sent successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
