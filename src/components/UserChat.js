import React, { useEffect, useState } from 'react';
import { db, auth } from '../config/firebase';
import { Container, TextField, Button, List, ListItem, ListItemText } from '@mui/material';
import { collection, doc, setDoc, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

const UserChat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [conversationId, setConversationId] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userConversationId = `conversation_${currentUser.uid}`;
        setConversationId(userConversationId);
        const conversationRef = doc(db, 'conversations', userConversationId);

        // Crée la conversation si elle n'existe pas
        await setDoc(conversationRef, { createdAt: serverTimestamp() }, { merge: true });

        const q = query(collection(conversationRef, 'messages'), orderBy('timestamp', 'asc'));
        onSnapshot(q, (snapshot) => {
          setMessages(snapshot.docs.map(doc => ({ id: doc.id, data: doc.data() })));
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const sendMessage = async () => {
    if (message.trim() === '' || !user) return;

    const conversationRef = doc(db, 'conversations', conversationId);
    await addDoc(collection(conversationRef, 'messages'), {
      user: user.email,
      message,
      timestamp: serverTimestamp()
    });

    setMessage('');
  };

  return (
    <Container>
      {user ? (
        <>
          <List>
            {messages.map(({ id, data }) => (
              <ListItem key={id}>
                <ListItemText primary={`${data.user}: ${data.message}`} secondary={new Date(data.timestamp?.toDate()).toLocaleString()} />
              </ListItem>
            ))}
          </List>
          <TextField
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            fullWidth
            variant="outlined"
            placeholder="Tapez votre message..."
          />
          <Button onClick={sendMessage} variant="contained" color="primary">Envoyer</Button>
        </>
      ) : (
        <p>Veuillez vous connecter pour accéder au chat.</p>
      )}
    </Container>
  );
};

export default UserChat;