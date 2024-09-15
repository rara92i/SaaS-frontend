import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import UserChat from '../components/UserChat';
import AdminChat from '../components/AdminChat';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';

const Support = () => {
  const [user, setUser] = React.useState(null);
  const adminEmails = [process.env.REACT_APP_ADMIN_EMAIL];

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <Container maxWidth="md" style={{ padding: '20px' }}>
      <Box textAlign="center">
        <Typography variant="h4" gutterBottom>
          Support Client
        </Typography>
        <Typography variant="body1">
          Nous sommes là pour vous aider! Contactez-nous via le chat en direct ou envoyez-nous un email.
        </Typography>
      </Box>
      <Box mt={4}>
        {user && adminEmails.includes(user.email) ? <AdminChat /> : <UserChat />}
      </Box>
    </Container>
  );
};

export default Support;