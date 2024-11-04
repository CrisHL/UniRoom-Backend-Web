import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendTwoFactorTokenEmail = async (
  email: string,
  token: string
) => {
  await resend.emails.send({
    from: "UniRoom <no-reply@uniroom.app>",
    to: email,
    subject: "Autenticación de 2 factores",
    html: `
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8">
        </head>
        <body>
          <table align="center" style="border-width:1px; border-style:solid; border-color:#eaeaea; border-radius:5px; margin-top:40px; max-width:465px; padding:20px;">
            <tbody>
              <tr>
                <td>
                  <img src="https://i.imgur.com/ruySKLQ.png" alt="Logo" height="130" style="display:block;margin:0 auto;">
                  <h1 style="text-align:center; font-size:24px;">Autenticación de 2 factores</h1>
                  <p style="font-size:14px;">Hola, ¡Tus llaves virtuales están aquí!</p>
                  <p style="font-size:14px;">Tu código de acceso es:</p>
                    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="background:rgba(0,0,0,.05);border-radius:4px;margin:16px auto 14px;vertical-align:middle;width:280px">
                   <tbody>
                     <tr>
                       <td>
                        <p style="font-size:32px;line-height:40px;margin:0 auto;color:#000;display:inline-block;font-family:HelveticaNeue-Bold;font-weight:700;letter-spacing:6px;padding-bottom:8px;padding-top:8px;width:100%;text-align:center"><strong>${token}</strong></p>
                       </td>
                      </tr>
                     </tbody>
                   </table>
                  <p style="font-size:14px;">Si no solicitaste esto, no te preocupes; nosotros nos encargamos de desalojar a cualquier intruso que se atreva a mudarse sin avisar. 🚪🔑</p>
                </td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
    `
  });
};


export const sendVerificationEmail = async (
  email: string, 
  token: string
) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: "UniRoom <no-reply@uniroom.app>",
    to: email,
    subject: "Confirma tu dirección de correo electrónico",
    html: `
     <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8">
        </head>
        <body>
          <table align="center" style="border-width:1px; border-style:solid; border-color:#eaeaea; border-radius:5px; margin-top:40px; max-width:465px; padding:20px;">
            <tbody>
              <tr>
                <td>
                  <img src="https://i.imgur.com/ruySKLQ.png" alt="Logo" height="130" style="display:block;margin:0 auto;">
                  <h1 style="text-align:center; font-size:24px;">¡Bienvenido a UniRoom! 🤗</h1>
                  <p style="font-size:14px;">Para asegurarnos de que esta cuenta es realmente tuya y no de algún vecino curioso, haz clic en el siguiente botón para confirmar tu dirección de correo electrónico. 🏠🔑</p>
                    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="text-align:center;margin-top:32px;margin-bottom:32px">
                      <tbody>
                       <tr>
                        <td><a href="${confirmLink}" style="background-color:rgb(0,0,0);border-radius:0.25rem;color:rgb(255,255,255);font-size:12px;font-weight:600;text-decoration-line:none;text-align:center;padding-left:1.25rem;padding-right:1.25rem;padding-top:0.75rem;padding-bottom:0.75rem;line-height:100%;text-decoration:none;display:inline-block;max-width:100%;mso-padding-alt:0px;padding:12px 20px 12px 20px" target="_blank"><span><!--[if mso]><i style="mso-font-width:500%;mso-text-raise:18" hidden>&#8202;&#8202;</i><![endif]--></span><span style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:9px">Confirmar cuenta</span><span><!--[if mso]><i style="mso-font-width:500%" hidden>&#8202;&#8202;&#8203;</i><![endif]--></span></a></td>
                      </tr>
                     </tbody>
                  </table>
                  <p style="font-size:14px;">¡Que nadie se mude sin tu permiso!</p>
                </td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
    `
  });
};

export const sendPasswordResetEmail = async (
  email: string,
  token: string,
) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`;
  await resend.emails.send({
    from: "UniRoom <no-reply@uniroom.app>",
    to: email,
    subject: "Recupera tu contraseña",
    html: `
     <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8">
        </head>
        <body>
          <table align="center" style="border-width:1px; border-style:solid; border-color:#eaeaea; border-radius:5px; margin-top:40px; max-width:465px; padding:20px;">
            <tbody>
              <tr>
                <td>
                  <img src="https://i.imgur.com/ruySKLQ.png" alt="Logo" height="130" style="display:block;margin:0 auto;">
                  <h1 style="text-align:center; font-size:24px;">¡Perdiste tu contraseña!<br></br> ¿Te mudaste a otro planeta? 🛸</h1>
                  <p style="font-size:14px;">Parece que olvidaste tu contraseña. 😅 Haz clic en el siguiente botón para recuperarla.</p>
                    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="text-align:center;margin-top:32px;margin-bottom:32px">
                      <tbody>
                       <tr>
                        <td><a href="${resetLink}" style="background-color:rgb(0,0,0);border-radius:0.25rem;color:rgb(255,255,255);font-size:12px;font-weight:600;text-decoration-line:none;text-align:center;padding-left:1.25rem;padding-right:1.25rem;padding-top:0.75rem;padding-bottom:0.75rem;line-height:100%;text-decoration:none;display:inline-block;max-width:100%;mso-padding-alt:0px;padding:12px 20px 12px 20px" target="_blank"><span><!--[if mso]><i style="mso-font-width:500%;mso-text-raise:18" hidden>&#8202;&#8202;</i><![endif]--></span><span style="max-width:100%;display:inline-block;line-height:120%;mso-padding-alt:0px;mso-text-raise:9px">Recuperar contraseña</span><span><!--[if mso]><i style="mso-font-width:500%" hidden>&#8202;&#8202;&#8203;</i><![endif]--></span></a></td>
                      </tr>
                     </tbody>
                  </table>
                  <p style="font-size:14px;">Recuerda, no queremos que pierdas las llaves del mundo real, ¡porque ahí no estaremos para ayudarte! 🥹</p>
                </td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>`
  });
};

export const sendNewLogin = async (name: string, email: string) => {
  await resend.emails.send({
    from: "UniRoom <no-reply@uniroom.app>",
    to: email,
    subject: "Detectamos un inicio de sesión reciente en tu cuenta 👀",
    html: `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
          <html dir="ltr" lang="en">

  <head>
    <link rel="preload" as="image" href="https://i.imgur.com/uKIVq1K.png" />
    <link rel="preload" as="image" href="https://i.imgur.com/qzOLE9P.png" />
    <link rel="preload" as="image" href="https://react-email-demo-3kjjfblod-resend.vercel.app/static/yelp-footer.png" />
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" /><!--$-->
  </head>

  <body style="background-color:#fff;font-family:-apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,Oxygen-Sans,Ubuntu,Cantarell,&quot;Helvetica Neue&quot;,sans-serif">
    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="max-width:37.5em">
      <tbody>
        <tr style="width:100%">
          <td>
            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="padding:30px 20px">
              <tbody>
                <tr>
                  <td><img src="https://i.imgur.com/QePbXJh.png" style="display:block;outline:none;border:none;text-decoration:none" /></td>
                </tr>
              </tbody>
            </table>
            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="border:1px solid rgb(0,0,0, 0.1);border-radius:3px;overflow:hidden">
              <tbody>
                <tr>
                  <td>
                    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation">
                      <tbody style="width:100%">
                        <tr style="width:100%"><img src="https://i.imgur.com/kBYoqdI.png" style="display:block;outline:none;border:none;text-decoration:none;max-width:100%" width="620" /></tr>
                      </tbody>
                    </table>
                    <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="padding:20px;padding-bottom:0">
                      <tbody style="width:100%">
                        <tr style="width:100%">
                          <td data-id="__react-email-column">
                            <h1 style="font-size:32px;font-weight:bold;text-align:center">Hola <!-- -->${name}<!-- -->,</h1>
                            <h2 style="font-size:26px;font-weight:bold;text-align:center">Hemos detectado un nuevo inicio de sesión en tu cuenta de UniRoom 🚨</h2>
                            <p style="font-size:16px;line-height:24px;margin:16px 0">Si no fuiste tú, te recomendamos cambiar tu contraseña de inmediato por seguridad.</p>
                            <p style="font-size:16px;line-height:24px;margin:16px 0">Puedes hacerlo desde la página web: <a href="https://uniroom.app" style="color:#007bff;text-decoration:none">uniroom.app</a></p>
                            <p style="font-size:16px;line-height:24px;margin:16px 0;margin-top:-5px">Saludos, equipo de UniRoom</p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
            <table align="center" width="100%" border="0" cellPadding="0" cellSpacing="0" role="presentation" style="padding:45px 0 0 0">
              <tbody>
                <tr>
                  <td><img src="https://react-email-demo-3kjjfblod-resend.vercel.app/static/yelp-footer.png" style="display:block;outline:none;border:none;text-decoration:none;max-width:100%" width="620" /></td>
                </tr>
              </tbody>
            </table>
            <p style="font-size:12px;line-height:24px;margin:16px 0;text-align:center;color:rgb(0,0,0, 0.7)">© 2024 | UniRoom, Tula de Allende, Hidalgo, 42836, México | uniroom.app</p>
          </td>
        </tr>
      </tbody>
    </table><!--/$-->
  </body>
            </html>
    `
  });
};