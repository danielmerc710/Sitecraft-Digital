require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/contact', async (req, res) => {
  const { name, business, email, phone, service, message } = req.body;

  if (!name || !business || !email || !service) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Sitecraft Digital Contact" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    replyTo: email,
    subject: `New Inquiry from ${name} — ${business}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <table cellpadding="8" style="border-collapse:collapse;width:100%;max-width:600px;">
        <tr><td><strong>Name</strong></td><td>${name}</td></tr>
        <tr><td><strong>Business</strong></td><td>${business}</td></tr>
        <tr><td><strong>Email</strong></td><td><a href="mailto:${email}">${email}</a></td></tr>
        <tr><td><strong>Phone</strong></td><td>${phone || '—'}</td></tr>
        <tr><td><strong>Service</strong></td><td>${service}</td></tr>
        <tr><td><strong>Message</strong></td><td>${message || '—'}</td></tr>
      </table>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (err) {
    console.error('Email error:', err);
    res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
});

app.listen(PORT, () => {
  console.log(`Sitecraft Digital running at http://localhost:${PORT}`);
});
