import { validateEnv } from '@/utilities/validateEnv'

export const generateForgotPasswordEmailHtml = ({ token }: { token?: string }) => {
  const url = `${validateEnv('NEXT_PUBLIC_SERVER_URL')}/forgot-password/${token}`

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        </style>
      </head>
      <body style="margin: 0; padding: 0; background-color: #050505; font-family: 'Space Grotesk', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #ffffff;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #050505; min-height: 100vh;">
          <tr>
            <td align="center" style="padding: 40px 20px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #0a0a0a; border: 1px solid #1a1a1a; border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
                <!-- Header Accent -->
                <tr><td height="4" style="background: linear-gradient(90deg, #8b5cf6, #ec4899, #f59e0b);"></td></tr>
                
                <tr>
                  <td style="padding: 50px 40px;">
                    <!-- Logo -->
                    <div style="margin-bottom: 40px; text-align: center;">
                      <div style="display: inline-block; padding: 12px; background: rgba(139, 92, 246, 0.1); border-radius: 16px;">
                        <span style="font-size: 24px; font-weight: 700; letter-spacing: -1px; color: #ffffff;">MDK<span style="color: #8b5cf6;">Craft</span></span>
                      </div>
                    </div>

                    <!-- Content -->
                    <div style="text-align: center; margin-bottom: 40px;">
                      <h1 style="font-size: 32px; font-weight: 700; margin: 0 0 16px 0; color: #ffffff; letter-spacing: -1px;">Resetowanie Hasła</h1>
                      <p style="font-size: 16px; line-height: 24px; color: #9ca3af; margin: 0;">Otrzymaliśmy prośbę o zresetowanie hasła do Twojego konta. Kliknij poniższy przycisk, aby ustawić nowe hasło.</p>
                    </div>

                    <!-- Action Button -->
                    <div style="text-align: center; margin-bottom: 40px;">
                      <a href="${url}" style="display: inline-block; background: #8b5cf6; color: #ffffff; padding: 18px 36px; border-radius: 14px; text-decoration: none; font-weight: 600; font-size: 16px; transition: all 0.3s ease; box-shadow: 0 10px 15px -3px rgba(139, 92, 246, 0.3);">
                        Zresetuj Hasło
                      </a>
                    </div>

                    <!-- Link Info -->
                    <div style="padding: 24px; background: rgba(255, 255, 255, 0.03); border-radius: 16px; margin-bottom: 40px;">
                      <p style="font-size: 14px; color: #6b7280; margin: 0 0 12px 0; font-family: monospace;">Jeśli przycisk nie działa, skopiuj ten link:</p>
                      <p style="font-size: 13px; color: #8b5cf6; margin: 0; word-break: break-all; font-family: monospace;">${url}</p>
                    </div>

                    <!-- Security Note -->
                    <div style="border-top: 1px solid #1a1a1a; padding-top: 30px; text-align: center;">
                      <p style="font-size: 13px; color: #4b5563; margin: 0;">
                        Ten link wygaśnie za 2 godziny.<br>
                        Jeśli to nie Ty prosiłeś o zmianę hasła, zignoruj tę wiadomość.
                      </p>
                    </div>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 30px 40px; background-color: #0f0f0f; border-top: 1px solid #1a1a1a; text-align: center;">
                    <p style="font-size: 12px; color: #374151; margin: 0;">
                      &copy; 2024 MDKCraft. Wszystkie prawa zastrzeżone.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `
}
