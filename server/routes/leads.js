const express = require('express');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// POST /api/leads
// { name, email, phone, message, advertId(optional) }
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message, advertId } = req.body || {};
    if (!name || !message) return res.status(400).json({ message: 'Name and message are required' });

    const to = process.env.LEADS_EMAIL || process.env.SMTP_TO || process.env.SMTP_USER;

    // If SMTP is not configured, fall back to logging locally and return success
    const smtpReady = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && to);
    const subject = `New lead from ${name}${advertId ? ' (Advert ' + advertId + ')' : ''}`;
    const text = `Name: ${name}\nEmail: ${email || '-'}\nPhone: ${phone || '-'}\nAdvert: ${advertId || '-'}\n\n${message}`;

    if (!smtpReady) {
      const logPath = path.join(__dirname, '..', 'leads.log');
      const entry = `\n[${new Date().toISOString()}]\nTO: ${to || '(not set)'}\nSUBJECT: ${subject}\n${text}\n`;
      try { fs.appendFileSync(logPath, entry, 'utf8'); } catch (_) {}
      return res.json({ ok: true, queued: false, delivered: false });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });

    await transporter.sendMail({ from: process.env.SMTP_FROM || process.env.SMTP_USER, to, subject, text });
    res.json({ ok: true, delivered: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Failed to send lead' });
  }
});

module.exports = router;