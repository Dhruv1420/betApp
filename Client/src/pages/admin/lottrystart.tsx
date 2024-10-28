/* eslint-disable react-hooks/rules-of-hooks */
import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";

const lottrystart = () => {
  const [number, setNumber] = useState("");
  const [amount, setAmount] = useState("");

  const handleStart = () => {
    console.log("Start Button Clicked", { number, amount });
  };

  const handleStop = () => {
    console.log("Stop Button Clicked");
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      <TextField
        label="Number"
        type="number"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        variant="outlined"
        fullWidth
      />
      <TextField
        label="Amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        variant="outlined"
        fullWidth
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleStart}
        sx={{ mt: 2, width: "100%" }}
      >
        Start
      </Button>
      <Button
        variant="contained"
        color="error"
        onClick={handleStop}
        sx={{ mt: 1, width: "100%" }}
      >
        Stop
      </Button>
    </Box>
  );
};

export default lottrystart;
