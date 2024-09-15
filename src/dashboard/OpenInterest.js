import React, { useEffect, useState } from 'react';
import { Card, Typography, CardContent, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

export default function OpenInterest() {
  const [symbol, setSymbol] = useState('ETHUSDT');
  const [openInterest, setOpenInterest] = useState(null);
  const [longPercentage, setLongPercentage] = useState(null);
  const [shortPercentage, setShortPercentage] = useState(null);
  const [period, setPeriod] = useState('1h');


  async function getOpenInterest(symbol) {
    const response = await fetch(`https://fapi.binance.com/fapi/v1/openInterest?symbol=${symbol}`);
    const data = await response.json();
    return data.openInterest;
  }

  async function getLongShortRatio(symbol, period) {
    const response = await fetch(`https://fapi.binance.com/futures/data/globalLongShortAccountRatio?symbol=${symbol}&period=${period}`);
    const data = await response.json();
    return data;
  }

  useEffect(() => {
    (async () => {
      const openInterest = await getOpenInterest(symbol);
      setOpenInterest(openInterest);

      const longShortRatioData = await getLongShortRatio(symbol, period);
      const longShortRatio = parseFloat(longShortRatioData[0]?.longShortRatio); // Assuming we want the most recent ratio

      if (longShortRatio) {
        const longPercentage = (longShortRatio / (longShortRatio + 1)) * 100;
        const shortPercentage = (1 / (longShortRatio + 1)) * 100;

        setLongPercentage(longPercentage.toFixed(2));
        setShortPercentage(shortPercentage.toFixed(2));
      }
    })();
  }, [symbol, period]);

  const handleChange = (event) => {
    setSymbol(event.target.value)
  };

  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
  };



  return (
    <div>
      <Typography variant="h4" style={{textAlign:'center', marginBottom:'10px'}}>Open Interest & Long/Short Ratio</Typography>
      <FormControl variant="outlined" style={{marginBottom:'10px' , marginRight:'10px'}}>
        <InputLabel>Symbol</InputLabel>
        <Select value={symbol} onChange={handleChange} label="Symbol">
        <MenuItem style={{ color: 'black' }} value="BTCUSDT">BTCUSDT</MenuItem>
          <MenuItem style={{ color: 'black' }} value="ETHUSDT">ETHUSDT</MenuItem>
        </Select>
      </FormControl>
      <FormControl variant="outlined" className="mb-4">
  <InputLabel>Period</InputLabel>
  <Select value={period} onChange={handlePeriodChange} label="Period">
    <MenuItem style={{ color: 'black' }} value="1h">1h</MenuItem>
    <MenuItem style={{ color: 'black' }} value="4h">4h</MenuItem>
    <MenuItem style={{ color: 'black' }} value="1d">Daily</MenuItem>
  </Select>
</FormControl>
      <Card className="p-4 flex flex-col justify-center items-center">
        <CardContent>
          <Typography style={{color: 'black'}} variant="h6">Symbol: {symbol}</Typography>
          <Typography style={{color: 'black'}} variant="body1">Open Interest: {openInterest !== null ? openInterest : 'Loading...'}</Typography>
          <Typography variant="body1" style={{ color: longPercentage > 50 ? 'green' : 'red' }}>
            Long: {longPercentage !== null ? `${longPercentage}%` : 'Loading...'}
          </Typography>
          <Typography variant="body1" style={{ color: shortPercentage > 50 ? 'green' : 'red' }}>
            Short: {shortPercentage !== null ? `${shortPercentage}%` : 'Loading...'}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}
