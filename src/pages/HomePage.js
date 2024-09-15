import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/images/imageBackground.jpg';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';


const HomePage = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);
        const userDoc = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDoc);
        if (userDocSnap.exists()) {
          setSelectedPlan(userDocSnap.data().plan);
        } else {
          console.log('No such document!');
        }
      } else {
        setIsLoggedIn(false);
        setSelectedPlan(null);
      }
    });
  }, [auth, db]);

  const handleSignUp = (plan) => {
    if (plan === 'premium') {
      checkout(plan);
    } else {
      navigate(`/signup?plan=${plan}`);
    }
  };

  const handleStripe = (plan) => {
    if (plan === 'premium') {
      window.location.href = 'https://buy.stripe.com/bIY8yI7vu8mAbao9AB'
    }else {
      window.location.href = 'https://winrate-simulator.netlify.app/canceled'
    }
  }

  const checkout = (plan) => {
    const priceId = plan === 'premium' ? 'price_1PMu8uELGQYwJDDeQZwNn0MV' : '';
    fetch('https://saas-backend-c8gp.onrender.com/create-subscription-checkout-session', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify({ plan: priceId }),
    })
      .then(async (res) => {
        if (res.ok) return res.json();
        const json = await res.json();
        return await Promise.reject(json);
      })
      .then(({ session }) => {
        window.location = session.url;
      })
      .catch((e) => {
        console.log(e.error);
      });
  };

  return (
    <Container maxWidth="md" style={{ padding: '20px' }}>
      <Box 
        style={{ 
          backgroundImage: `url(${backgroundImage})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center', 
          padding: '60px 20px', 
          borderRadius: '8px', 
          marginBottom: '20px' 
        }}
      >
        <Typography variant="h3" align="center" color="white" gutterBottom>
          Bienvenue sur notre Simulateur de Trading Crypto
        </Typography>
        <Typography variant="h6" align="center" color="white">
          Apprenez à trader les cryptomonnaies en toute sécurité avec notre simulateur et suivez vos performances grâce à notre journal de trading.
        </Typography>
      </Box>
      {isLoggedIn && (
        <Box textAlign='center' marginBottom={4}>
          <Typography variant="h5">Bienvenue, {auth.currentUser.email}</Typography>
        </Box>
      )}

      <Typography variant="h3" align="center" gutterBottom>
        Plans de Tarification
      </Typography>
      
      <Grid container spacing={4} justifyContent="center">
        {/* Offre d'essai gratuit */}
        <Grid item xs={12} md={4}>
          <Box 
            bgcolor={selectedPlan === 'trial' ? "#d4edda" : "#f0f0f0"} 
            p={3} 
            borderRadius={8} 
            textAlign="center" 
            border={selectedPlan === 'trial' ? "6px solid #28a745" : "none"}
          >
            <Typography variant="h5" color='black'>Offre d'essai gratuit</Typography>
            <Typography variant="body1" color='black'>1 mois d'accès complet gratuit</Typography>
            <Button 
              variant="contained" 
              color="primary" 
              style={{ marginTop: '10px' }} 
              onClick={() => handleSignUp('trial')}
            >
              {selectedPlan === 'trial' ? "Votre Plan Actuel" : "Commencez votre essai gratuit"}
            </Button>
          </Box>
        </Grid>

        {/* Plan Gratuit */}
        <Grid item xs={12} md={4}>
          <Box 
            bgcolor={selectedPlan === 'free' ? "#d4edda" : "#f0f0f0"} 
            p={3} 
            borderRadius={8} 
            textAlign="center" 
            border={selectedPlan === 'free' ? "6px solid #28a745" : "none"}
          >
            <Typography variant="h5" color='black'>Plan Gratuit</Typography>
            <Typography variant="body1" color='black'>5 simulations par mois</Typography>
            <Typography variant="body1" color='black'>10 lignes dans le journal</Typography>
            <Button 
              variant="contained" 
              color="primary" 
              style={{ marginTop: '10px' }} 
              onClick={() => handleSignUp('free')}
            >
              {selectedPlan === 'free' ? "Votre Plan Actuel" : "S'inscrire gratuitement"}
            </Button>
          </Box>
        </Grid>

        {/* Plan Premium */}
        <Grid item xs={12} md={4}>
          <Box 
            bgcolor={selectedPlan === 'premium' ? "#d4edda" : "#f0f0f0"} 
            p={3} 
            borderRadius={8} 
            textAlign="center" 
            border={selectedPlan === 'premium' ? "6px solid #28a745" : "none"}
          >
            <Typography variant="h5" color='black'>Plan Premium</Typography>
            <Typography variant="body1" color='black'>Accès illimité</Typography>
            <Typography variant="body1" color='black'>Fonctionnalités avancées</Typography>
            <Typography variant="body1" color='black'>9,90€ par mois</Typography>
            <Button 
              variant="contained" 
              color="primary" 
              style={{ marginTop: '10px' }} 
              // onClick={() => handleSignUp('premium')}
              onClick={()=>handleStripe('premium')}
            >
              {selectedPlan === 'premium' ? "Votre Plan Actuel" : "Passer au Premium"}
        
            </Button>
          </Box>
        </Grid>
      </Grid>

      {/* Section de Support Client et Feedback */}
      <Box mt={5} textAlign="center">
        <Typography variant="h4" gutterBottom>
          Support Client et Feedback
        </Typography>
        <Typography variant="body1">
          Nous sommes là pour vous aider! Contactez-nous via le chat en direct ou envoyez-nous vos retours via le formulaire de feedback.
        </Typography>
        <Button variant="outlined" 
                color="primary" 
                style={{ marginTop: '10px' }}
                onClick={()=> navigate('/support')}>
          Contactez le Support
        </Button>
        <Button variant="outlined" 
                color="secondary" 
                style={{ marginTop: '10px', marginLeft: '10px' }}
                onClick={()=> navigate('/feedback')}>
          Donner votre Feedback
        </Button>
      </Box>
    </Container>
  );
};

export default HomePage;