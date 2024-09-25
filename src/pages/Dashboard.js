import React, { useEffect, useState } from "react";
import { Grid, Paper, Typography, Container } from "@mui/material";
import Dominance from "../dashboard/Dominance";
import MarketCap from "../dashboard/MarketCap";
import Volume from "../dashboard/Volume";
import MarketCapTotal from "../dashboard/MarketCapTotal";
import OpenInterest from "../dashboard/OpenInterest";

const Dashboard = () => {
  const [marketData, setMarketData] = useState({
    marketCap: '',
    marketCapChange: '',
    volume: '',
    volumeChange: '',
    dominance: '',
    btcPrice: '',
    btcPriceChange: '',
    ethPrice: '',
    ethPriceChange: '',
    totalMarketCap: '',
    totalMarketCapChange: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch BTC and ETH data
        const url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true';
        const response = await fetch(url, { method: 'GET', headers: { accept: 'application/json' } });
        const data = await response.json();

        const btcData = data.bitcoin;
        const ethData = data.ethereum;

        // Fetch global market data
        const globalUrl = 'https://api.coingecko.com/api/v3/global';
        const globalResponse = await fetch(globalUrl, { method: 'GET', headers: { accept: 'application/json' } });
        const globalData = await globalResponse.json();
        const totalMarketCap = globalData.data.total_market_cap.usd;
        const totalMarketCapChange = globalData.data.market_cap_change_percentage_24h_usd;

        const btcMarketCap = btcData.usd_market_cap;
        const totalVolume = btcData.usd_24h_vol;

        setMarketData({
          marketCap: `${(btcMarketCap / 1e12).toFixed(2)} T$`,
          marketCapChange: `${btcData.usd_24h_change.toFixed(2)}%`,
          volume: `${(totalVolume / 1e9).toFixed(2)} B$`,
          volumeChange: `${btcData.usd_24h_change.toFixed(2)}%`,
          dominance: `${((btcMarketCap / totalMarketCap) * 100).toFixed(2)}%`,
          btcPrice: `${btcData.usd.toFixed(2)}`,
          btcPriceChange: `${btcData.usd_24h_change.toFixed(2)}%`,
          ethPrice: `${ethData.usd.toFixed(2)}`,
          ethPriceChange: `${ethData.usd_24h_change.toFixed(2)}%`,
          totalMarketCap: `${(totalMarketCap / 1e12).toFixed(2)} T$`,
          totalMarketCapChange: `${totalMarketCapChange.toFixed(2)}%`,
        });
      } catch (error) {
        console.error('Error fetching market data', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Grid container spacing={2} style={{ padding: '20px' }}>
      <Grid item xs={12} sm={6} md={3}>
        <MarketCapTotal value={marketData.totalMarketCap} change={marketData.totalMarketCapChange} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <MarketCap value={marketData.marketCap} change={marketData.marketCapChange} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Volume value={marketData.volume} change={marketData.volumeChange} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Dominance  value={marketData.dominance} />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper  elevation={3} style={{ padding: '20px', textAlign: 'left', backgroundColor: '#2a2d34' }}>
          <Typography variant="h6" color="white">BTC</Typography>
          <Typography variant="h4" color="neutral">{marketData.btcPrice}<span style={{ color: 'white'}}>$</span></Typography>
          <Typography variant="body1" color={parseFloat(marketData.btcPriceChange) >= 0 ? "green" : "red"}>
            {marketData.btcPriceChange}
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <Paper elevation={3} style={{ padding: '20px', textAlign: 'left', backgroundColor: '#2a2d34' }}>
          <Typography variant="h6" color="white">ETH</Typography>
          <Typography variant="h4" color="neutral">{marketData.ethPrice}<span style={{ color: 'white'}}>$</span></Typography>
          <Typography variant="body1" color={parseFloat(marketData.ethPriceChange) >= 0 ? "green" : "red"}>
            {marketData.ethPriceChange}
          </Typography>
        </Paper>
      </Grid>
      <Container style={{padding: '20px'}} className='p-4 pt-20 flex flex-col justify-center items-center mx-auto'>
      <OpenInterest/>
      </Container>
    </Grid>
  );
}

export default Dashboard;


