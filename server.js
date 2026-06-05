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
    from: `"Sitecraft Digital Inc. Contact" <${process.env.EMAIL_USER}>`,
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

app.post('/intake', async (req, res) => {
  const d = req.body;

  if (!d.bizName || !d.contactName || !d.email) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  const row = (label, val) => val ? `<tr><td style="padding:6px 12px;font-weight:600;white-space:nowrap;color:#555;width:200px">${label}</td><td style="padding:6px 12px">${val}</td></tr>` : '';

  const mailOptions = {
    from: `"Sitecraft Digital Inc. Intake" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    replyTo: d.email,
    subject: `New Intake Form — ${d.bizName}`,
    html: `
      <div style="font-family:sans-serif;max-width:680px">
        <h2 style="background:#5b6cf9;color:#fff;padding:16px 20px;margin:0;border-radius:8px 8px 0 0">New Client Intake Form</h2>
        <table style="border-collapse:collapse;width:100%;border:1px solid #e0e0e0;border-top:none">
          <tr><td colspan="2" style="padding:8px 12px;background:#f5f5f5;font-weight:700;font-size:13px;letter-spacing:.05em;text-transform:uppercase">Business Info</td></tr>
          ${row('Business Name', d.bizName)}
          ${row('Industry', d.industry)}
          ${row('Mission', d.mission)}
          ${row('About', d.about)}
          ${row('Founded', d.founded)}
          ${row('Employees', d.employees)}
          <tr><td colspan="2" style="padding:8px 12px;background:#f5f5f5;font-weight:700;font-size:13px;letter-spacing:.05em;text-transform:uppercase">Contact Info</td></tr>
          ${row('Contact Name', d.contactName)}
          ${row('Role', d.contactRole)}
          ${row('Email', d.email)}
          ${row('Phone', d.phone)}
          ${row('Address', d.address)}
          ${row('Service Area', d.serviceArea)}
          ${row('Hours', d.hours)}
          ${row('Existing Website', d.existingUrl)}
          <tr><td colspan="2" style="padding:8px 12px;background:#f5f5f5;font-weight:700;font-size:13px;letter-spacing:.05em;text-transform:uppercase">Services & Pricing</td></tr>
          ${row('Services', d.services)}
          ${row('Pricing', d.pricing)}
          ${row('Show Pricing', d.showPricing)}
          <tr><td colspan="2" style="padding:8px 12px;background:#f5f5f5;font-weight:700;font-size:13px;letter-spacing:.05em;text-transform:uppercase">Design</td></tr>
          ${row('Style', d.style)}
          ${row('Inspiration', d.inspo)}
          ${row("Don't Want", d.dontWant)}
          ${row('Logo Status', d.logoStatus)}
          ${row('Logo Notes', d.logoNotes)}
          <tr><td colspan="2" style="padding:8px 12px;background:#f5f5f5;font-weight:700;font-size:13px;letter-spacing:.05em;text-transform:uppercase">Social & Domain</td></tr>
          ${row('Facebook', d.facebook)}
          ${row('Instagram', d.instagram)}
          ${row('LinkedIn', d.linkedin)}
          ${row('TikTok', d.tiktok)}
          ${row('Domain', d.domain)}
          ${row('Domain Owned', d.domainOwned)}
          <tr><td colspan="2" style="padding:8px 12px;background:#f5f5f5;font-weight:700;font-size:13px;letter-spacing:.05em;text-transform:uppercase">Timeline & Notes</td></tr>
          ${row('Launch Date', d.launchDate)}
          ${row('Competitors', d.competitors)}
          ${row('Notes', d.notes)}
          ${row('Policy Text', d.policyText)}
        </table>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (err) {
    console.error('Intake email error:', err);
    res.status(500).json({ error: 'Failed to send. Please try again.' });
  }
});

app.listen(PORT, () => {
  console.log(`Sitecraft Digital Inc. running at http://localhost:${PORT}`);
});
