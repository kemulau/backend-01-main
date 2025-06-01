import dotenv from 'dotenv';
import path from 'path';
import nodemailer from 'nodemailer';

dotenv.config({ path: path.resolve(__dirname, '../../.env') }); // <- caminho corrigido

console.log("🔍 Verificando variáveis...");
console.log({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  user: process.env.MAILTRAP_USER,
  pass: process.env.MAILTRAP_PASS
});

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: Number(process.env.MAILTRAP_PORT),
  auth: {
    user: process.env.MAILTRAP_USER!,
    pass: process.env.MAILTRAP_PASS!
  }
});

async function testarEnvio() {
  try {
    const info = await transporter.sendMail({
      from: '"Teste IFPR" <no-reply@ifpr.edu.br>',
      to: 'teste@exemplo.com',
      subject: '✅ Teste de SMTP funcionando',
      text: 'Se você está lendo isso, o Mailtrap está funcionando!',
    });

    console.log("📨 E-mail enviado com sucesso! ID:", info.messageId);
  } catch (err) {
    console.error("❌ Erro ao enviar e-mail:", err);
  }
}

testarEnvio();
