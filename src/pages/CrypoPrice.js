import React from 'react';
import { Container, Typography } from '@mui/material';
import CryptoPriceList from '../dashboard/CryptoPriceList';

const CryptoPrice = () => {
  return (
    <Container className='p-4 flex flex-col justify-center items-center'>
      <Typography variant="h4" className="text-center my-4 pb-4">CryptoCurrency</Typography>
      <CryptoPriceList />
    </Container>
  );
};

export default CryptoPrice;
