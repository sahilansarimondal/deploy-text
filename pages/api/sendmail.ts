// pages/api/sendmail.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

type Data = {
  success: boolean;
  message?: string;
};

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { name, message } = req.body;

  // Konfiguriere den SMTP-Server
  const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com', // Dies ist ein Beispielhost, ersetze ihn durch den tatsächlichen Hostnamen
    port: 465, // oder 465 für SSL (abhängig von deinem E-Mail-Dienst)
    secure: true, // auf true setzen, wenn du Port 465 verwendest
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD, // Ersetze dies mit deinem echten Passwort
    },
    tls: {
      // Manchmal erforderlich, um Fehler bei bestimmten Netzwerken zu vermeiden
      rejectUnauthorized: false,
    },
  });

  try {
    await transporter.sendMail({
      from: 'textwerk@tech-frontier.de',
      to: 'info@tech-frontier.de', // Empfängeradresse
      subject: `Neue Nachricht von ${name}`,
      text: message,
    });

    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Fehler beim Senden der E-Mail:', error);
    res.status(500).json({ success: false, message: error.message });
  }
  
};
