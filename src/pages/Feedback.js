import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';

const Feedback = () => {
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'feedbacks'), { feedback });
      setFeedback('');
      alert('Feedback submitted successfully');
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  return (
    <Container maxWidth="md" style={{ padding: '20px' }}>
      <Box textAlign="center">
        <Typography variant="h4" gutterBottom>
          Donner votre Feedback
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Votre feedback"
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            style={{ marginBottom: '20px' }}
          />
          <Button variant="contained" color="primary" type="submit">
            Envoyer
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Feedback;
