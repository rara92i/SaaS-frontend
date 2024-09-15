import React, { useState } from 'react';
import { db } from '../config/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { TextField, Button, Box, Typography } from '@mui/material';
import { getAuth } from 'firebase/auth';

const AddScriptForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentUser = getAuth().currentUser;
    if (!currentUser) {
      return;
    }

    const authorId = currentUser.uid;

    await addDoc(collection(db, 'scripts'), {
      title,
      description,
      code,
      authorId,
      createdAt: serverTimestamp(),
      likes: [],
    });
    setTitle('');
    setDescription('');
    setCode('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6">Ajouter un nouveau script</Typography>
      <TextField
        label="Titre"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        variant="outlined"
        required
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        variant="outlined"
        required
      />
      <TextField
        label="Code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        variant="outlined"
        multiline
        rows={4}
        required
      />
      <Button type="submit" variant="contained" color="primary">Ajouter</Button>
    </Box>
  );
};

export default AddScriptForm;