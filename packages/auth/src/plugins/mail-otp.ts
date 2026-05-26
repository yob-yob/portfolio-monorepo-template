import { nodemailer_transporter } from "@asset-tracking/mailer/transporter";
import { emailOTP } from "better-auth/plugins";

export const emailOtpPlugin = emailOTP({
  async sendVerificationOTP({ email, otp, type }) {
    await nodemailer_transporter.sendMail({
      from: '"Your App Name" <your-email@gmail.com>',
      to: email,
      subject: `Your Verification Code: ${otp}`,
      html: `<b>Your OTP is ${otp}</b>. It is for ${type}.`,
    });
  },
  changeEmail: {
    enabled: true,
    verifyCurrentEmail: true,
  },
  storeOTP: "hashed",
});
