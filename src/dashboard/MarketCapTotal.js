import React from 'react';
import { Typography, Card, CardContent } from "@mui/material";

const MarketCapTotal = ({ value, change }) => {
  return (
    <Card style={{ backgroundColor: "#191919"}}>
      <CardContent>
      <Typography variant="h6" color="white">Total Market Cap</Typography>
      <Typography variant="h4" color="white">{value}</Typography>
      <Typography variant="body1" color={parseFloat(change) >= 0 ? "green" : "red"}>
        {change}
      </Typography>
      </CardContent>
    </Card>
  );
};

export default MarketCapTotal;
