import nodemailer from 'nodemailer';

export const emailRegistro = async (datos) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { nombre, email, token } = datos;
  
  //Enviar el email
  await transport.sendMail({
    from: 'BienesRaices.com',
    to: email,
    subject: 'Confirma tu cuenta en BienesRaices.com',
    text: 'Confirma tu cuenta en BienesRaices.com',
    html: `
        <p>Hola ${nombre} comprueba tu cuenta en bienesRaices.com</p>

        <p>Tu cuenta ya esta lista, solo 
        <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 9000}/auth/confirmarCuenta/${token}">haz click Aquí</a> </p>

        <p>Si tu no creaste esta cuenta puedes ignorar el mensaje</p>
    `,
  });
};

export const emailOlvidePassword = async (datos) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { nombre, email, token } = datos;
  
  //Enviar el email
  await transport.sendMail({
    from: 'BienesRaices.com',
    to: email,
    subject: 'Reestablece tu password en BienesRaices.com',
    text: 'Reestablece tu password en BienesRaices.com',
    html: `
        <p>Hola <b> ${nombre}, </b> has solicitado reestablecer tu password en bienesRaices.com</p>

        <p>Sigue el sigueinte enlace para generar un nuevo password 
        <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 9000}/auth/olvide-password/${token}">Reestablecer Password</a> </p>

        <p>Si tu no solicitaste el cambio de password puedes ignorar el mensaje</p>
    `,
  });
};
