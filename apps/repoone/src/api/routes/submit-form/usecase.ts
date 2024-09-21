import { type Outcome } from "opc-types/lib/Outcome";
import { type ObjRecord } from "opc-types/lib/util/ObjRecord";

import send from "../../../services/mail/mailer";
import Mailing from "../../../config/Mailing";
import { errorFactory } from "../../infrastructure/errorHanding";

import { type ReturnType, type DTO } from "./types";

const SUBJECTS: ObjRecord<string> = {
  contact: "Contact form",
  "revert-feedback": "Beta feedback (on reversion)",
  "beta-feedback": "Beta feedback",
  "membership-enquiry": "Membership enquiry",
};

const getContactRoute = async (dto: DTO): Promise<Outcome<ReturnType>> => {
  const { message, name, email, ...fields } = dto;

  const fieldText = Object.entries(fields).map(
    ([key, value]) => `${key}: ${value}`
  );

  if (dto.message.length) {
    return send({
      text: `From: ${name ? `${name} <${email}>` : email}
${fieldText.join("\n")}${fieldText.length ? "\n" : ""}
---Message---
${message}
`,
      subject: SUBJECTS[dto.formType] || "Website form submission",
      toEmail: Mailing.ADMIN_EMAIL,
      toName: Mailing.ADMIN_EMAIL_NAME,
    })
      .then((_: any) => {
        return {};
      })
      .catch((e: any) => {
        return errorFactory("Could not send contact form", e);
      });
  }

  return {};
};

export default getContactRoute;
