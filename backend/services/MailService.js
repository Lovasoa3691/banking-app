const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "fenonantenaikolovasoa@gmail.com",
    pass: "me@fenonantenaiko",
  },
});

exports.sendPretConfirmation = async (to, name, montant, status) => {
  const subject = `Statut de votre demande de prêt : ${status}`;
  const text = `Bonjour ${name},

Votre demande de prêt d'un montant de ${montant} Ar a été ${status.toLowerCase()}.

Merci de votre confiance.

Cordialement,
L'équipe F-Banky`;

  await transporter.sendMail({
    from: '"Banque" <fenonantenaikolovasoa@gmail.com>',
    to,
    subject,
    text,
  });
};
