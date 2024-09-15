import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemText, Box, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      setUser(null);
      handleClose();
      // retour a la page d'accueil
      navigate('/');
    }).catch((error) => {
      console.error("An error happened during sign out: ", error);
    });
  };

  const drawer = (
    <div onClick={handleDrawerToggle}>
      <List>
        {!user ? (
          <ListItem button component={Link} to="/login">
            <ListItemText secondary="Connexion" />
          </ListItem>
        ) : (
          <>
          <ListItem button component={Link} to="/">
              <ListItemText secondary="Accueil" />
            </ListItem>
            <ListItem button component={Link} to="/simulator">
              <ListItemText secondary="Simulateur" />
            </ListItem>
            <ListItem button component={Link} to="/scripts">
              <ListItemText secondary="Scripts" />
            </ListItem>
            <ListItem button component={Link} to="/dashboard">
              <ListItemText secondary="index" />
            </ListItem>
            <ListItem button component={Link} to="/price">
              <ListItemText secondary="cryptoCurrency" />
            </ListItem>
            <ListItem button onClick={handleLogout}>
              <ListItemText secondary="Déconnexion" />
            </ListItem>
          </>
        )}
      </List>
    </div>
  );

  return (
    <div>
      <AppBar position="fixed">
        <Toolbar>
          <Typography 
            variant="h5" 
            component={Link} 
            to="/" 
            sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span>TRADING</span>
              <span style={{ color: 'black', marginTop: '15px' }}>Simulator</span>
            </div>
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {!user ? (
              <Button color="inherit" component={Link} to="/login">Connexion</Button>
            ) : (
              <div>
                <Button
                  color="inherit"
                  aria-controls="user-menu"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  startIcon={<AccountCircle />}
                >
                  {user.email}
                </Button>
                <Menu
                  id="user-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem style={{ color: 'black' }} onClick={handleClose} component={Link} to="/">Accueil</MenuItem>
                  <MenuItem style={{ color: 'black' }} onClick={handleClose} component={Link} to="/simulator">Simulateur</MenuItem>
                  <MenuItem style={{ color: 'black' }} onClick={handleClose} component={Link} to="/scripts">Scripts</MenuItem>
                  <MenuItem style={{ color: 'black' }} onClick={handleClose} component={Link} to="/dashboard">Index</MenuItem>
                  <MenuItem style={{ color: 'black' }} onClick={handleClose} component={Link} to="/price">cryptoCurrency</MenuItem>
                  <MenuItem style={{ color: 'black' }} onClick={handleLogout}>Déconnexion</MenuItem>
                </Menu>
              </div>
            )}
          </Box>
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            sx={{ display: { xs: 'block', sm: 'none' } }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
      >
        {drawer}
      </Drawer>
    </div>
  );
};

export default Navbar;