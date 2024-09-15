import React from 'react'
import { Card, CardContent, Typography } from '@mui/material';

const MarketCap = ({ value, change }) => {
  return (
    <Card style={{ backgroundColor: "#191919"}}>
      <CardContent>
        <Typography color={("white")} variant="h6" component="div">
          Market Cap BTC
        </Typography>
        <Typography variant="h4" color="white">
          {value}
        </Typography>
        <Typography  color={parseFloat(change) >= 0 ? "green" : "red"}>
          {change}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default MarketCap