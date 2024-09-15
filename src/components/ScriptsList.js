import React, { useEffect, useState } from 'react';
import { db } from '../config/firebase';
import { collection, query, onSnapshot, orderBy, doc, updateDoc, arrayUnion, arrayRemove, deleteDoc } from 'firebase/firestore';
import { Card, CardContent, Typography, Button, Collapse, Box, IconButton } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { getAuth } from 'firebase/auth';
import DeleteIcon from '@mui/icons-material/Delete';


const ScriptList = () => {
  const [scripts, setScripts] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const currentUser =getAuth().currentUser;

  useEffect(() => {

    const q = query(collection(db, 'scripts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const scriptsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setScripts(scriptsData);
    });
    return unsubscribe;
  }, []);

  const handleExpandClick = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  const handleLikeClick = async (scriptId, likes) =>{
    const scriptRef = doc(db, 'scripts', scriptId);
    const currentUserId = currentUser.uid;
    if (!currentUserId) return;
    if (likes.includes(currentUserId)) {
      await updateDoc(scriptRef, { likes: arrayRemove(currentUserId) });
    } else {
      await updateDoc(scriptRef, { likes: arrayUnion(currentUserId) });
    }
  } 

  const handleDeleteClick = async (scriptId) => {
    const scriptRef = doc(db, 'scripts', scriptId);
    await deleteDoc(scriptRef);
  }
   

  return (
    <Box>
      {scripts.map((script) => (
        <Card key={script.id} sx={{ marginBottom: 2 }}>
          <CardContent style={{backgroundColor: '#191919'}}>
            <Typography color={'white'} variant="h6">{script.title}</Typography>
            <Typography color={'white'} variant="body2">{script.description}</Typography>
            <Button onClick={() => handleExpandClick(script.id)}>
              {expanded === script.id ? 'Cacher le code' : 'Voir le code'}
            </Button>
            <Collapse in={expanded === script.id}>
              <Box color={'white'} component="pre" sx={{ whiteSpace: 'normal' }}>
                {script.code}
              </Box>
              <Button variant="outlined" onClick={() => navigator.clipboard.writeText(script.code)}>
                Copier le code
              </Button>
            </Collapse>
            <Box display="flex" alignItems="center">
              <IconButton onClick={() => handleLikeClick(script.id, script.likes || [])}>
                {script.likes && script.likes.includes(currentUser.uid) ? (
                  <FavoriteIcon color="error" />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </IconButton>
              <Typography variant="body2">{script.likes?.length || 0} Likes</Typography>
              {script.authorId === currentUser.uid && (
                <IconButton onClick={() => handleDeleteClick(script.id)} color='secondary'>
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default ScriptList;