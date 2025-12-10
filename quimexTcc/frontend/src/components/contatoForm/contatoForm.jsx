//contatoForm.jsx
'use client';

import { useState } from 'react';

import { Button } from "../ui/button";
import {
    Field,
    FieldContent,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldLegend,
    FieldSeparator,
    FieldSet,
    FieldTitle,
} from "../ui/field";

import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { ArrowRight, PhoneCall, Mail, Clock4 } from "lucide-react";

export default function Contato() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        const formData = new FormData(e.currentTarget);

        try {
            const response = await fetch('/api/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: formData.get('name'),
                    message: formData.get('message'),
                    emailUser: formData.get('emailUser')
                }),
            });

            if (response.ok) {
                setStatus('success');
                e.target.reset();
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className='w-full max-w-lg m-0 p-5'>
            <h1>Entre em Contato</h1>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div className="space-y-2">
                    <FieldLabel htmlFor="name">Nome:</FieldLabel>
                    <Input
                        id="name"
                        name="name"
                        placeholder="Seu nome"
                        required
                        className="bg-background"
                    />
                </div>

                

                <div>
                    <FieldLabel htmlFor="email">Seu email:</FieldLabel>
                    <Input
                        id="emailUser"
                        name="emailUser"
                        type="email"
                        placeholder="seu@email.com"
                        required
                        className="bg-background"
                    />
                </div>

                <div>
                    <FieldLabel htmlFor="message">Mensagem:</FieldLabel>
                    <Textarea
                        id="message"
                        name="message"
                        placeholder="Sua mensagem..."
                        required
                        rows="5"
                        className="resize-none md:resize-y bg-background shadow-lg h-45 w-full break-words" 
                    />
                </div>

                <Button type="submit" disabled={loading}>{loading ? 'Enviando...' : 'Enviar Mensagem'}</Button>
                {status === 'success' && (<p style={{ color: 'green' }}>✓ Email enviado com sucesso!</p>)}

                {status === 'error' && (<p style={{ color: 'red' }}>✗ Erro ao enviar email. Tente novamente.</p>)}
            </form>
        </div>
    );
}