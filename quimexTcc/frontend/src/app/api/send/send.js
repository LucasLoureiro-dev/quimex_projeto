
//send.js
import { EmailTemplate } from "@/components/templateEmail/email"
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
console.log(process.env.RESEND_API_KEY)

export default async function handler(req, res) {

  if (req.method !== 'POST') {
    console.log('Método não permitido:', req.method);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Pegar os dados do body
    const { firstName, email, message, emailUser } = req.body;

    //Validar dados
    if (!firstName || !email || !message || !emailUser) {
      console.log('Dados inválidos');
      return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
    }

    // Enviando email
    const { data, error } = await resend.emails.send({
      from: 'Quimex <onboarding@resend.dev>',
      to: 'quimex05@gmail.com',
      subject: 'Nova mensagem de contato',
      react: EmailTemplate({ firstName, message, emailUser }),
    });

    if (error) {
      console.error('Erro do Resend:', error);
      return res.status(400).json(error);
    }

    console.log('Email enviado com sucesso!', data);
    res.status(200).json(data);
    
  } catch (error) {
    console.error('Erro capturado:', error);
    res.status(500).json({ error: error.message || 'Erro desconhecido' });
  }
}