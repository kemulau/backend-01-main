import nodemailer from 'nodemailer';
import path from 'path';
import dotenv from 'dotenv';

// Carregar variáveis do .env (ajustado com caminho absoluto)
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Configuração do transporte SMTP real (ex: Gmail)
const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST || 'smtp.gmail.com',
  port: Number(process.env.MAILTRAP_PORT) || 587,
  secure: false, // true se usar porta 465, false para 587
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS
  }
});

// Log para depuração
console.log("📡 SMTP configurado:", {
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  user: process.env.MAILTRAP_USER
});

// Função para envio do e-mail de boas-vindas
export async function enviarEmail(nome: string, email: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
      <div style="max-width: 600px; margin: auto; background-color: white; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); padding: 30px;">
        <h2 style="color: #198754;">🎓 Bem-vindo(a), ${nome}!</h2>
        <p style="font-size: 16px; color: #333;">
          É um prazer tê-lo(a) conosco em nossa plataforma acadêmica.
        </p>
        <p style="font-size: 15px; color: #555;">
          📚 Agora você pode explorar conhecimentos, registrar sua jornada e crescer junto com a comunidade IFPR.
        </p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="font-size: 14px; color: #888;">
          🤝 Caso tenha qualquer dúvida, nossa equipe está aqui para te ajudar.
        </p>
        <p style="font-size: 14px; color: #444; margin-top: 30px;">
          🕊️ <strong>Estamos de luto pela despedida do Professor Luccas Kayure.</strong><br>
          Seu legado como educador e mentor viverá em cada linha de código que escrevemos. 💻🖤
        </p>
        <p style="text-align: center; margin-top: 40px;">
          <strong style="color: #198754;">Instituto Federal do Paraná</strong><br/>
          💡 Plataforma de Gestão Acadêmica
        </p>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from: '"Equipe IFPR" <${process.env.MAILTRAP_USER}>',
    to: email,
    subject: '🌿 Seja bem-vindo(a) à nossa plataforma!',
    html
  });
}
