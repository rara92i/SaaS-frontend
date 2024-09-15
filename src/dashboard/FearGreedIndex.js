import React from "react";
import { Card, CardContent, Typography, CircularProgress } from "@mui/material";

const FearGreedIndex = ({ value }) => {
  return (
    <Card>
      <CardContent>
        <Typography color={("black")} variant="h6" component="div">
          Fear & Greed
        </Typography>
        <Typography variant="h4" color="secondary">
          {value}
        </Typography>
        <CircularProgress variant="determinate"  value={value} />
      </CardContent>
    </Card>
  )
}

export default FearGreedIndex