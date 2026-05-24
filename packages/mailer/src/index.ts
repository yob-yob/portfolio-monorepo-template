import { createTransport } from "nodemailer";

const { SMTP_SERVER_HOST, SMTP_SERVER_PORT, SMTP_USERNAME, SMTP_PASSWORD } =
  process.env;

if (!SMTP_SERVER_HOST) {
  throw new Error("SMTP_SERVER_HOST is not set");
}
if (!SMTP_SERVER_PORT) {
  throw new Error("SMTP_SERVER_PORT is not set");
}

const SMTP_PORT = Number(SMTP_SERVER_PORT);

if (Number.isNaN(SMTP_PORT)) {
  throw new Error("SMTP_SERVER_PORT must be a number");
}

if (!SMTP_USERNAME) {
  console.log("SMTP_USERNAME is not set");
}

if (!SMTP_PASSWORD) {
  console.log("SMTP_PASSWORD is not set");
}

export const nodemailer_transporter = createTransport({
  host: SMTP_SERVER_HOST,
  port: SMTP_PORT,
  secure: false,
  auth: {
    user: SMTP_USERNAME,
    pass: SMTP_PASSWORD,
  },
});

nodemailer_transporter
  .verify()
  .then(() => console.log("Server is ready to take our messages"))
  .catch((err) => console.error("Verification failed:", err));
