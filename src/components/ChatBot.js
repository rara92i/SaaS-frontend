import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';

// Définir le thème pour le chatbot
const theme = {
  background: '#f5f8fb',
  fontFamily: 'Arial, Helvetica, sans-serif',
  headerBgColor: '#1976d2',
  headerFontColor: '#fff',
  headerFontSize: '15px',
  botBubbleColor: '#1976d2',
  botFontColor: '#fff',
  userBubbleColor: '#fff',
  userFontColor: '#4a4a4a',
};

// Définir les étapes du chatbot
const steps = [
  {
    id: '1',
    message: 'Bonjour! Comment puis-je vous aider aujourd\'hui?',
    trigger: '2',
  },
  {
    id: '2',
    options: [
      { value: 1, label: 'Informations sur les produits', trigger: '3' },
      { value: 2, label: 'Support technique', trigger: '4' },
      { value: 3, label: 'Autre question', trigger: '5' },
    ],
  },
  {
    id: '3',
    message: 'Nos produits sont les meilleurs du marché!',
    end: true,
  },
  {
    id: '4',
    message: 'Pour le support technique, veuillez nous contacter à support@example.com.',
    end: true,
  },
  {
    id: '5',
    message: 'Merci pour votre question. Un agent vous répondra bientôt.',
    end: true,
  },
];

const Support = () => {
  return (
    <Container maxWidth="md" style={{ padding: '20px' }}>
      <Box textAlign="center">
        <Typography variant="h4" gutterBottom>
          Support Client
        </Typography>
        <Typography variant="body1">
          Nous sommes là pour vous aider! Contactez-nous via le chat en direct ou envoyez-nous un email.
        </Typography>
        <Button variant="contained" color="primary" style={{ marginTop: '10px' }}>
          Chat en direct
        </Button>
      </Box>
      <Box mt={4}>
        <ThemeProvider theme={theme}>
          <ChatBot steps={steps} />
        </ThemeProvider>
      </Box>
    </Container>
  );
};

export default Support;