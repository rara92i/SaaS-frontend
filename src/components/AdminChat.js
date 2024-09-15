import React, { useEffect, useState } from 'react';
import { db, auth } from '../config/firebase';
import { Container, List, ListItem, ListItemText, Button, Typography, TextField, Box } from '@mui/material';
import { collection, query, orderBy, onSnapshot, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const AdminChat = () => {
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const adminEmails = process.env.REACT_APP_ADMIN_EMAIL; 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && adminEmails.includes(currentUser.email)) {
        const q = query(collection(db, 'conversations'), orderBy('createdAt', 'desc'));
        onSnapshot(q, (snapshot) => {
          setConversations(snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() })));
        });
      }
    });

    return () => unsubscribe();
  },[ adminEmails ]);

  useEffect(() => {
    if (currentConversationId) {
      const conversationRef = doc(db, 'conversations', currentConversationId);
      const q = query(collection(conversationRef, 'messages'), orderBy('timestamp', 'asc'));
      onSnapshot(q, (snapshot) => {
        setMessages(snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() })));
      });
    }
  }, [currentConversationId]);

  const sendMessage = async () => {
    if (newMessage.trim() === '') return;

    const conversationRef = doc(db, 'conversations', currentConversationId);
    await addDoc(collection(conversationRef, 'messages'), {
      user: 'admin', // Ou l'email de l'admin
      message: newMessage,
      timestamp: serverTimestamp()
    });

    setNewMessage('');
  };

  return (
    <Container>
      <Typography variant="h4">Chat Administrateur</Typography>
      <List>
        {conversations.map(({ id }) => (
          <ListItem key={id} ButtonBase onClick={() => setCurrentConversationId(id)}>
            <ListItemText primary={`Conversation: ${id}`} />
          </ListItem>
        ))}
      </List>
      {currentConversationId && (
        <>
          <Typography variant="h5">Messages</Typography>
          <List>
            {messages.map(({ id, data }) => (
              <ListItem key={id}>
                <ListItemText primary={`${data.user}: ${data.message}`} secondary={new Date(data.timestamp?.toDate()).toLocaleString()} />
              </ListItem>
            ))}
          </List>
          <Box mt={2}>
            <TextField
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              fullWidth
              variant="outlined"
              placeholder="Tapez votre message..."
            />
            <Button onClick={sendMessage} variant="contained" color="primary" style={{ marginTop: '10px' }}>
              Envoyer
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
};

export default AdminChat;