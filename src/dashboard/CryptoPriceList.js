import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Typography, Box, Card, CardContent, Grid, TextField, Button, IconButton, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { Sparklines, SparklinesLine } from 'react-sparklines';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const initialCryptoPairs = [
  "btcusdt", "ethusdt", "bnbusdt", "solusdt", 
  "xrpusdt", "dogeusdt", "linkusdt", "adausdt", 
  "renderusdt", "avaxusdt", "ltcusdt", "dotusdt"
];

const CryptoPriceList = () => {
  const [cryptoPairs, setCryptoPairs] = useState(() => {
    const savedPairs = localStorage.getItem('cryptoPairs');
    return savedPairs ? JSON.parse(savedPairs) : [];
  });
  const [prices, setPrices] = useState({});
  const [lastPrices, setLastPrices] = useState({});
  const [priceHistory, setPriceHistory] = useState({});
  const [newPair, setNewPair] = useState('');
  const [alerts, setAlerts] = useState(() => {
    const savedAlerts = localStorage.getItem('cryptoAlerts');
    return savedAlerts ? JSON.parse(savedAlerts) : [];
  });
  const [triggeredAlerts, setTriggeredAlerts] = useState({});
  const [newAlert, setNewAlert] = useState({ symbol: '', price: '', direction: '' });

  const allCryptoPairs = useMemo(() => [...initialCryptoPairs, ...cryptoPairs], [cryptoPairs]);

  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  const checkAlerts = useCallback(() => {
    alerts.forEach(alert => {
      const price = prices[alert.symbol];
      if (price) {
        if (
          (alert.direction === 'above' && price > alert.price && !triggeredAlerts[alert.symbol + alert.direction + alert.price]) ||
          (alert.direction === 'below' && price < alert.price && !triggeredAlerts[alert.symbol + alert.direction + alert.price])
        ) {
          toast(`Alerte de prix pour ${alert.symbol.toUpperCase()}: ${price}`);
          new Notification(`Alerte de prix pour ${alert.symbol.toUpperCase()}`, {
            body: `Le prix est ${price}`,
            icon: 'https://your-icon-url.com/icon.png',
            sound: 'https://your-sound-url.com/sound.mp3'
          });

          setTriggeredAlerts(prev => ({ ...prev, [alert.symbol + alert.direction + alert.price]: true }));
        }
      }
    });
  }, [alerts, prices, triggeredAlerts]);

  useEffect(() => {
    checkAlerts();
  }, [prices, checkAlerts]);

  useEffect(() => {
    const ws = new WebSocket("wss://stream.binance.com:9443/stream?streams=" + allCryptoPairs.map(pair => `${pair}@trade`).join('/'));

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const pair = data.stream.split('@')[0];
      const price = parseFloat(data.data.p).toFixed(2);

      setPrices(prevPrices => {
        const newPrices = { ...prevPrices, [pair]: price };

        setLastPrices(prevLastPrices => ({
          ...prevLastPrices,
          [pair]: prevPrices[pair] || price
        }));

        setPriceHistory(prevHistory => {
          const pairHistory = prevHistory[pair] ? [...prevHistory[pair]] : [];
          if (pairHistory.length >= 20) {
            pairHistory.shift();
          }
          pairHistory.push(price);
          return { ...prevHistory, [pair]: pairHistory };
        });

        return newPrices;
      });
    };

    return () => ws.close();
  }, [allCryptoPairs]);

  const handleAddPair = () => {
    const pairLower = newPair.toLowerCase();
    if (newPair && !allCryptoPairs.includes(pairLower)) {
      const updatedPairs = [...cryptoPairs, pairLower];
      setCryptoPairs(updatedPairs);
      setNewPair('');
      localStorage.setItem('cryptoPairs', JSON.stringify(updatedPairs));
    }
  };

  const handleRemovePair = (pairToRemove) => {
    const updatedPairs = cryptoPairs.filter(pair => pair !== pairToRemove);
    setCryptoPairs(updatedPairs);
    localStorage.setItem('cryptoPairs', JSON.stringify(updatedPairs));
  };

  const addAlert = () => {
    const alert = { symbol: newAlert.symbol, price: parseFloat(newAlert.price), direction: newAlert.direction };
    if (!/^[a-zA-Z]+usdt$/.test(alert.symbol)) {
      toast.error('Le symbole doit inclure la paire, par exemple: btcusdt');
      return;
    }
    const updatedAlerts = [...alerts, alert];
    setAlerts(updatedAlerts);
    localStorage.setItem('cryptoAlerts', JSON.stringify(updatedAlerts));
    setNewAlert({ symbol: '', price: '', direction: '' });
  };

  const removeAlert = (index) => {
    const updatedAlerts = alerts.filter((_, i) => i !== index);
    setAlerts(updatedAlerts);
    localStorage.setItem('cryptoAlerts', JSON.stringify(updatedAlerts));
  };

  return (
    <Box className="p-4">
      <ToastContainer />
      <Box mb={4} display="flex" flexDirection={{ xs: 'column', sm: 'row' }} alignItems="center">
        <TextField
          label="Ajouter un pair de crypto"
          variant="outlined"
          value={newPair}
          onChange={(e) => setNewPair(e.target.value)}
          style={{ marginRight: '16px', marginBottom: '8px' }}
        />
        <Button variant="contained" color="primary" onClick={handleAddPair}>
          Ajouter
        </Button>
      </Box>
      <Grid container spacing={2}>
        {allCryptoPairs.map(pair => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={pair}>
            <Card style={{ backgroundColor: "#2a2d34"}}>
              <CardContent className="flex justify-between items-center">
                <Typography variant="h6" color="white">{pair.toUpperCase()}</Typography>
                <Box display="flex" alignItems="center">
                  <Typography
                    variant="h6"
                    color={!lastPrices[pair] || lastPrices[pair] === prices[pair] ? 'white' : prices[pair] > lastPrices[pair] ? 'green' : 'red'}
                    style={{ marginRight: '8px' }}
                  >
                    {prices[pair] || 'Loading...'}
                  </Typography>
                  {cryptoPairs.includes(pair) && (
                    <IconButton size="small" onClick={() => handleRemovePair(pair)}>
                      <DeleteIcon style={{ color: 'red' }} />
                    </IconButton>
                  )}
                  
                </Box>
                {priceHistory[pair] && (
                    <Line
                      data={{
                        labels: priceHistory[pair].map((_, index) => index + 1),
                        datasets: [{
                          label: 'Price',
                          data: priceHistory[pair],
                          borderColor: 'rgba(75, 192, 192, 1)',
                          borderWidth: 1,
                          fill: false
                        }]
                      }}
                      options={{
                        scales: {
                          x: { display: false }
                        }
                      }}
                    />
                  )}
                {/* {priceHistory[pair] && (
                    <Sparklines data={priceHistory[pair]}>
                      <SparklinesLine color="blue" />
                    </Sparklines>
                  )} */}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box mt={4}>
        <Typography variant="h6">Ajouter une alerte de prix</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Symbole"
              variant="outlined"
              value={newAlert.symbol}
              onChange={(e) => setNewAlert({ ...newAlert, symbol: e.target.value.toLowerCase() })}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Prix"
              variant="outlined"
              type="number"
              value={newAlert.price}
              onChange={(e) => setNewAlert({ ...newAlert, price: e.target.value })}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl variant="outlined" fullWidth>
              <InputLabel>Direction</InputLabel>
              <Select
                value={newAlert.direction}
                onChange={(e) => setNewAlert({ ...newAlert, direction: e.target.value })}
                label="Direction"
              >
                <MenuItem style={{ color: 'black' }} value="above">Au-dessus</MenuItem>
                <MenuItem style={{ color: 'black' }} value="below">En-dessous</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={addAlert} fullWidth>
              Ajouter une alerte
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Box mt={4}>
        <Typography variant="h6">Alertes actives</Typography>
        <ul>
          {alerts.map((alert, index) => (
            <li key={index}>
              {alert.symbol.toUpperCase()} - {alert.direction === 'above' ? 'Au-dessus' : 'En-dessous'} {alert.price}
              <IconButton size="small" onClick={() => removeAlert(index)}>
                <DeleteIcon style={{ color: 'red' }} />
              </IconButton>
            </li>
          ))}
        </ul>
      </Box>
    </Box>
  );
};

export default CryptoPriceList;
