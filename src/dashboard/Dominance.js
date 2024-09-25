import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import { FaBitcoin} from 'react-icons/fa'

const Dominance = ({ value }) => {
  return (
    <Card style={{ backgroundColor: "#2a2d34"}} >
      <CardContent>
        <Typography color={("white")} variant="h6" component="div">
          Dominance
        </Typography>
        <Typography variant="h4" color="white">
          {value}
        </Typography>
        <Typography color={("white")} style={{alignItems:"center", display:"flex"}}  component="div">
          <FaBitcoin size={20} color="orange" style={{marginRight:5}} />
          BTC
        </Typography>
      </CardContent>
    </Card>
  )
}

export default Dominance