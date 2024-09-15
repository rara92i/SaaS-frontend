import axios from 'axios';

const api = axios.create({
  baseURL: 'https://pro-api.coinmarketcap.com/v1/',
  headers: {
    
    'X-CMC_PRO_API_KEY': process.env.REACT_APP_COINMARKETCAP_API_KEY,
    'Accept': 'application/json',
  },
});

export default api