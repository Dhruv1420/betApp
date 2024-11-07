import { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useWithdrawRequestMutation } from "../redux/api/paymnetAPI"; // Adjust the import path as necessary
import { RootState } from "../redux/store";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

const Withdraw = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const [accountNumber, setAccountNumber] = useState<string>("");
  const [ifscCode, setIfscCode] = useState<string>("");
  const [bankName, setBankName] = useState<string>("");
  const [receiverName, setReceiverName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [coins, setCoins] = useState<number>(0);
  const [withdrawRequest, { isLoading }] = useWithdrawRequestMutation();
  const navigate = useNavigate();

  const handleWithdraw = async () => {
    if (!user) {
      toast.error("User is not authenticated");
      navigate("/login");
      return;
    }

    if (coins > user.coins) {
      toast.error("Insufficient coins");
      return;
    }

    if (coins <= 100) {
      toast.error("Please enter a valid amount");
      return;
    }

    const isNumeric = (str: string) => /^\d+$/.test(str);
    if (phoneNumber.length !== 10 || !isNumeric(phoneNumber)) {
      toast.error("Please enter a valid 10 digit phone number");
      return;
    }

    if (!user) {
      toast.error("User is not authenticated");
      navigate("/login");
      return;
    }

    const requestPayload = {
      _id: user._id,
      coins,
      accNo: accountNumber,
      ifsc: ifscCode,
      bankName,
      receiverName,
      contact: Number(phoneNumber),
    };

    try {
      const response = await withdrawRequest(requestPayload).unwrap();
      toast.success(
        response?.message || "Withdrawal request sent Successfully"
      );
      navigate("/profile");
      toast.success("Your balance will be updated shortly.");
    } catch (error) {
      toast.error("Withdrawal failed");
      console.error(user);
      console.error(error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          p: 4,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Withdraw Funds
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Account Number"
              variant="outlined"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="IFSC Code"
              variant="outlined"
              value={ifscCode}
              onChange={(e) => setIfscCode(e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Bank Name"
              variant="outlined"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Receiver's Name"
              variant="outlined"
              value={receiverName}
              onChange={(e) => setReceiverName(e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Phone Number"
              variant="outlined"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Amount (Coins)"
              variant="outlined"
              type="number"
              value={coins}
              onChange={(e) => setCoins(Number(e.target.value))}
              required
            />
            <Typography variant="caption" color="error">
              *Minimum amount (coins) should be 100
            </Typography>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleWithdraw}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} /> : "Withdraw"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Withdraw;
