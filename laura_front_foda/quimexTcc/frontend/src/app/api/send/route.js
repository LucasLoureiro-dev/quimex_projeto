
//route.js
import { EmailTemplate } from "@/components/templateEmail/email"
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);
console.log(process.env.RESEND_API_KEY)

export async function POST(request) { 
  try {
    //Pegar os dados enviados
    const body = await request.json();
    
    const { firstName, message, emailUser } = body;

    //Validar dados
    if (!firstName || !message || !emailUser) {
      console.log('Dados inválidos');
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' }, 
        { status: 400 }
      );}

    const { data, error } = await resend.emails.send({
      from: 'Quimex <onboarding@resend.dev>',
      to: 'quimex05@gmail.com',
      subject: 'Nova mensagem de contato da Quimex',
      react: EmailTemplate({ firstName, message, emailUser }),
    });

    if (error) {
      console.error('Erro do Resend:', error);
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ data });
    
  } catch (error) {
    console.error('Erro capturado:', error);
    return NextResponse.json(
      { error: error.message || 'Erro desconhecido' }, 
      { status: 500 }
    );
  }
}