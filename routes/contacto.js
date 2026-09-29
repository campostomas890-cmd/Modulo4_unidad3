/*codigo coregido falta de (const express = require('express'); , const router = express.Router(); y module.exports=router;*/
const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

router.post('/', async function(req, res, next) {
  var nombre = (req.body.nombre || '').trim();
  var email = (req.body.email || '').trim();
  var mensaje = (req.body.mensaje || '').trim();

  if (!nombre || !email || !mensaje) {
    return res.redirect('/?contacto=error');
  }

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return res.redirect('/?contacto=error');
  }

  try {
    var port = Number(process.env.SMTP_PORT) || 587;
    var transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: port,
      secure: port === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.CONTACT_TO || process.env.SMTP_USER,
      replyTo: email,
      subject: 'Contacto desde la web',
      text: nombre + ' envió este mensaje: ' + mensaje
    });

    res.redirect('/?contacto=enviado');
  } catch (error) {
    next(error);
  }
});

module.exports = router;