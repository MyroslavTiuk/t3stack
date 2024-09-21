import * as E from "errable";
import sgMail from "@sendgrid/mail";

import MAILING from "../../config/Mailing";
import l from "../logger";

if (MAILING.SENDGRID_API_KEY) {
  sgMail.setApiKey(MAILING.SENDGRID_API_KEY);
}

const mailgun = null;
// const mailgun = pipe(
//   () => MAILING.MAILGUN_API_KEY,
//   E.ifNotNull(
//     (apiKey) => new Mailgun({ apiKey, domain: 'optionsprofitcalculator.com' }),
//   ),
// )();

type SendParams = {
  subject: string;
  toEmail: string;
  toName: string;
  fromEmail?: string;
  fromName?: string;
} & ({ text: string; html?: undefined } | { html: string; text?: undefined });

const SERVICE: "sendgrid" | "mailgun" = "sendgrid";

const send = (params: SendParams) => {
  const fromEmail = params.fromEmail || MAILING.ADMIN_EMAIL;
  const fromName = params.fromName || MAILING.ADMIN_EMAIL_NAME;

  if (
    MAILING.MOCK_EMAIL ||
    (E.isNull(mailgun) && E.isNull(MAILING.SENDGRID_API_KEY))
  ) {
    l.info("Mocking email send", params);
    return Promise.resolve({});
  }

  // @ts-ignore (correctly identifies this won't run
  if (SERVICE === "mailgun") {
    // return new Promise((resolve, reject) => {
    // mailgun.messages().send(
    //   {
    //     from: `${fromName} <${fromEmail}>`,
    //     to: params.toEmail,
    //     subject: params.subject,
    //     text: params.text || undefined,
    //     html: params.html || undefined,
    //   },
    //   (err, body) => {
    //     if (err) reject(err);
    //     else resolve(true);
    //   },
    // );
    // });
  } else if (SERVICE === "sendgrid") {
    const msg = {
      to: params.toEmail,
      from: {
        email: fromEmail,
        name: fromName,
      },
      subject: params.subject,
      text: params.text,
      html: params.html,
    };

    return (
      sgMail
        // @ts-ignore (text or html must be supplied)
        .send(msg)
        .then(() => {
          return true;
        })
        .catch(() => {
          return E.err("Could not send email");
        })
    );
  }
  return Promise.resolve(
    E.err("No mail service configured in services/mailer")
  );
};

export default send;
