import nodemailer, { type TransportOptions } from 'nodemailer'
import {
  SMTP_SERVER,
  SMTP_PORT,
  SMTP_SECURE,
  SMTP_USER,
  SMTP_PASS,
  MAIL_FROM_ADDRESS,
} from '../constants'

type MailOptions = {
  from: string
  to: string
  subject: string
  text: string
}

class SmtpClient {
  private transporter
  constructor() {
    const options = {
      host: SMTP_SERVER,
      port: Number(SMTP_PORT),
      secure: SMTP_SECURE === 'true',
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    } as TransportOptions
    this.transporter = nodemailer.createTransport(options)
  }

  async mailSend(
    fromEmail: string | undefined = MAIL_FROM_ADDRESS,
    toEmail: string,
    subject: string,
    bodyText: string
  ) {
    const mailOptions = {
      from: fromEmail,
      to: toEmail,
      subject: subject,
      text: bodyText,
    } as MailOptions
    const info = await this.transporter.sendMail(mailOptions)
    console.log(info)
  }
}

export { SmtpClient }
