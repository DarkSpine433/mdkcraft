import { validateEnv } from '@/utilities/validateEnv'

export const generateNewsletterConfirmationEmailHtml = ({ token }: { token: string }) => {
  const url = `${validateEnv('NEXT_PUBLIC_SERVER_URL')}/newsletter/confirm/${token}`
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
                <tr><td height="4" style="background: linear-gradient(90deg, #8b5cf6, #ec4899);"></td></tr>
                
                <tr>
                  <td style="padding: 50px 40px;">
                    <!-- Logo Area -->
                    <div style="margin-bottom: 40px; text-align: center;">
                      <h1 style="margin: 0; font-size: 28px; letter-spacing: -1px; font-weight: 700; color: #ffffff;">
                        MDK<span style="color: #8b5cf6;">CRAFT</span>
                      </h1>
                      <div style="height: 1px; width: 60px; background: #8b5cf6; margin: 15px auto 0;"></div>
                    </div>

                    <!-- Content -->
                    <h2 style="font-size: 22px; font-weight: 600; color: #8b5cf6; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 1px;">
                      Potwierdź Subskrypcję
                    </h2>
                    <p style="font-size: 16px; line-height: 1.6; color: #a1a1aa; margin-bottom: 35px;">
                      Dziękujemy za chęć dołączenia do naszego newslettera! Kliknij poniższy przycisk, aby potwierdzić swój adres email i zacząć otrzymywać najnowsze wieści ze świata MDKCraft.
                    </p>

                    <!-- Action Button -->
                    <div style="text-align: center; margin-bottom: 40px;">
                      <a href="${url}" style="display: inline-block; padding: 18px 36px; background-color: #8b5cf6; color: #ffffff; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; transition: all 0.3s ease; box-shadow: 0 0 20px rgba(139, 92, 246, 0.3);">
                        Potwierdzam Zapis
                      </a>
                    </div>

                    <!-- Divider -->
                    <div style="height: 1px; background: #1a1a1a; margin-bottom: 30px;"></div>

                    <!-- Secondary Info -->
                    <p style="font-size: 13px; color: #52525b; line-height: 1.5; margin: 0;">
                      Jeśli nie prosiłeś o zapisanie się do newslettera, możesz zignorować tę wiadomość. Twoja subskrypcja nie zostanie aktywowana.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 30px 40px; background-color: #0c0c0c; border-top: 1px solid #1a1a1a; text-align: center;">
                    <p style="font-size: 12px; color: #3f3f46; margin: 0;">
                      © 2024 MDKCraft. Wszystkie systemy operacyjne chronione.
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
