// components/email-template.jsx
import { Html, Button, Container, Heading, Text } from '@react-email/components';

export const EmailTemplate = ({ firstName, message, emailUser }) => (
  <Html>
    <Container style={{ padding: '20px' }}>
      <Heading>Olá, {firstName}!</Heading>
      <Text>{emailUser}</Text>
      <Text>Você recebeu uma nova mensagem:</Text>
      <Text style={{ 
        backgroundColor: '#f4f4f4', 
        padding: '15px', 
        borderRadius: '5px' 
      }}>
        {message}
      </Text>
      <Button 
        href="http://localhost:3000"
        style={{
          backgroundColor: '#1b8742',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '5px'
        }}
      >
        Visitar Site
      </Button>
    </Container>
  </Html>
);