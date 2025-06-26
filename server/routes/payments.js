const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');

const router = express.Router();

// Middleware to validate JWT token
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const student = await Student.findById(decoded.studentId);
    
    if (!student) {
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.student = student;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// @route   POST /api/payments/create-payment-intent
// @desc    Create a payment intent for Stripe
// @access  Private
router.post('/create-payment-intent', auth, async (req, res) => {
  try {
    const { amount, description } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        studentId: req.student._id.toString(),
        studentName: req.student.getFullName(),
        description: description || 'Tuition Payment',
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Payment intent creation error:', error);
    res.status(500).json({ message: 'Error creating payment intent' });
  }
});

// @route   POST /api/payments/confirm-payment
// @desc    Confirm a payment and update student record
// @access  Private
router.post('/confirm-payment', auth, async (req, res) => {
  try {
    const { paymentIntentId, amount, description } = req.body;

    // Verify the payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment not completed' });
    }

    // Add payment to student record
    const payment = {
      amount: amount,
      description: description || 'Tuition Payment',
      date: new Date(),
      status: 'completed',
      stripePaymentId: paymentIntentId,
    };

    req.student.payments.push(payment);
    await req.student.save();

    res.json({
      message: 'Payment confirmed successfully',
      payment: payment,
    });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ message: 'Error confirming payment' });
  }
});

// @route   GET /api/payments/history
// @desc    Get payment history for the student
// @access  Private
router.get('/history', auth, async (req, res) => {
  try {
    const payments = req.student.payments.sort((a, b) => b.date - a.date);
    res.json(payments);
  } catch (error) {
    console.error('Payment history error:', error);
    res.status(500).json({ message: 'Error fetching payment history' });
  }
});

// @route   GET /api/payments/outstanding
// @desc    Get outstanding payments for the student
// @access  Private
router.get('/outstanding', auth, async (req, res) => {
  try {
    // Calculate outstanding amount based on enrolled courses
    const enrolledCourses = req.student.enrolledCourses.filter(
      course => course.status === 'active'
    );

    // This is a simplified calculation - you might want to implement
    // a more complex fee structure based on your requirements
    const totalTuition = enrolledCourses.length * 1000; // $1000 per course
    const paidAmount = req.student.payments
      .filter(payment => payment.status === 'completed')
      .reduce((sum, payment) => sum + payment.amount, 0);

    const outstandingAmount = Math.max(0, totalTuition - paidAmount);

    res.json({
      outstandingAmount,
      totalTuition,
      paidAmount,
      enrolledCourses: enrolledCourses.length,
    });
  } catch (error) {
    console.error('Outstanding payments error:', error);
    res.status(500).json({ message: 'Error calculating outstanding payments' });
  }
});

// @route   POST /api/payments/webhook
// @desc    Handle Stripe webhooks
// @access  Public
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log('Payment succeeded:', paymentIntent.id);
      
      // Update student payment record if needed
      try {
        const student = await Student.findById(paymentIntent.metadata.studentId);
        if (student) {
          const payment = student.payments.find(p => p.stripePaymentId === paymentIntent.id);
          if (payment) {
            payment.status = 'completed';
            await student.save();
          }
        }
      } catch (error) {
        console.error('Error updating payment status:', error);
      }
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      console.log('Payment failed:', failedPayment.id);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

module.exports = router; 