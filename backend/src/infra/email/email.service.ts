import dotenv from "dotenv";
dotenv.config();
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export const sendForgotPasswordEmail = async (email: string, code: string) => {
  try {
    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: "Password Reset Code",
      html: `
      <div style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8;padding:20px 0;">
          <tr>
            <td align="center">
              <table width="100%" max-width="500px" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
                
                <!-- Header -->
                <tr>
                  <td style="background:#90CF8E;color:#ffffff;padding:20px;text-align:center;">
                    <h2 style="margin:0;font-size:20px;">Reset Your Password</h2>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:30px 20px;text-align:center;color:#333;">
                    <p style="margin:0 0 15px;font-size:16px;">
                      We received a request to reset your password. Use the code below to proceed:
                    </p>

                    <!-- Code Box -->
                    <div style="margin:25px 0;">
                      <span style="display:inline-block;padding:15px 25px;font-size:28px;letter-spacing:6px;font-weight:bold;color:#90CF8E;background:#e8f5e9;border-radius:8px;">
                        ${code}
                      </span>
                    </div>

                    <p style="margin:0 0 10px;font-size:14px;color:#555;">
                      This code will expire in <strong>10 minutes</strong>.
                    </p>

                    <p style="margin:0;font-size:13px;color:#888;">
                      If you didn't request a password reset, you can safely ignore this email.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    `,
    });
    return response;
  } catch (error) {
    throw error;
  }
};

export const sendVerificationEmail = async (email: string, code: string) => {
  try {
    const response = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: "Email Verification Code",
      html: `
      <div style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8;padding:20px 0;">
          <tr>
            <td align="center">
              <table width="100%" max-width="500px" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
                
                <!-- Header -->
                <tr>
                  <td style="background:#90CF8E;color:#ffffff;padding:20px;text-align:center;">
                    <h2 style="margin:0;font-size:20px;">Verify Your Email</h2>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:30px 20px;text-align:center;color:#333;">
                    <p style="margin:0 0 15px;font-size:16px;">
                      Thanks for signing up! Use the code below to verify your email address:
                    </p>

                    <!-- Code Box -->
                    <div style="margin:25px 0;">
                      <span style="display:inline-block;padding:15px 25px;font-size:28px;letter-spacing:6px;font-weight:bold;color:#90CF8E;background:#e8f5e9;border-radius:8px;">
                        ${code}
                      </span>
                    </div>

                    <p style="margin:0 0 10px;font-size:14px;color:#555;">
                      This code will expire in <strong>10 minutes</strong>.
                    </p>

                    <p style="margin:0;font-size:13px;color:#888;">
                      If you didn’t request this, you can safely ignore this email.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    `,
    });
    return response;
  } catch (error) {
    throw error;
  }
};