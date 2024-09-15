import React from 'react';
import AddScriptForm from '../components/AddScriptForm';
import ScriptList from '../components/ScriptsList';
import { Container, Typography } from '@mui/material';

const Script = () => {
  return (
    <Container spacing={4}>
      <Typography variant="h4" sx={{ marginBottom: 4 }}>Scripts de la Communauté</Typography>
      <div style={{marginBottom: 20}}>
      <AddScriptForm  />
      </div>
      <ScriptList />
    </Container>
  );
};

export default Script;