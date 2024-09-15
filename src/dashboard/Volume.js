import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

const volume = ({ value, change }) => {
  return (
    <Card  style={{ backgroundColor: "#191919"}}>
      <CardContent>
        <Typography color={("white")} variant="h5" component="div">
          Volume
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

export default volume