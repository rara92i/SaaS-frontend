import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import TradingSimulator from './pages/TradingSimulator';
import Cancel from './pages/Cancel';
import Success from './pages/Success';
import Feedback from './pages/Feedback';
import Support from './pages/Support';
import Script from './pages/Script';
import Dashboard from './pages/Dashboard';
import CryptoPrice from './pages/CrypoPrice';

const theme = createTheme({
    palette: {
        text: {
            primary: '#ffffff',
            secondary: 'black',
            green: '#00FF00',
            red: '#FF0000'
            
        },
        action: {
            active: '#ffffff'
        }
    },
    components: {
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: '#ffffff',
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                input: {
                    color: '#ffffff',
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                notchedOutline: {
                    borderColor: '#ffffff',
                },
            },
        },
    },
});

function App() {
  return (
    <ThemeProvider theme={theme}> 
      <Router>
        <div style={{ marginBottom: '64px'}}>
        <Navbar />
        </div>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/simulator" element={<TradingSimulator />} />
          <Route path="/canceled" element={<Cancel />} />
          <Route path="/success" element={<Success />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/support" element={<Support />} />
          <Route path='/scripts' element={<Script/>} />
          <Route path='/dashboard' element={<Dashboard/>} />
          <Route path='/price' element={<CryptoPrice/>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
