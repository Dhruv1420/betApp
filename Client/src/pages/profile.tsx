import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import BottomNav from "../components/Header";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useState } from "react";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
const Profile = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const [open, setOpen] = useState(false);

  // Retrieve user data from Redux

  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div>
      {/* Profile Header */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        p={2}
        bgcolor="lightgray"
      >
        <Avatar
          alt={user?.name}
          src="/path-to-avatar.jpg"
          sx={{ width: 80, height: 80 }}
        />
        <Typography variant="h6" mt={2}>
          {user?.name}
        </Typography>
        <Typography variant="h5" color="primary" mt={1}>
          Balance: <span style={{ color: "orange" }}>{user?.coins}</span>
        </Typography>
        <Box
          display="flex"
          justifyContent="space-between"
          mt={2}
          width="60%"
          alignItems="start"
          gap={2}
        >
          <Button
            variant="contained"
            color="error"
            fullWidth
            onClick={() => navigate("/payment")}
          >
            Deposit
          </Button>
          <Button variant="contained" color="error" fullWidth>
            Withdraw
          </Button>
        </Box>
      </Box>

      {/* Account Options */}
      <List>
        <ListItem component="button" onClick={handleClickOpen}>
          <ListItemText primary="Profile" />
        </ListItem>
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            p={2}
          >
            <DialogTitle>Profile Information</DialogTitle>
            <IconButton onClick={handleClose} edge="end">
              <CloseIcon />
            </IconButton>
          </Box>
          <DialogContent dividers>
            <Box display="flex" flexDirection="column" gap={2}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1" fontWeight="bold">
                  Name:
                </Typography>
                <Typography variant="body1">{user?.name || "N/A"}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1" fontWeight="bold">
                  Email:
                </Typography>
                <Typography variant="body1">{user?.email || "N/A"}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1" fontWeight="bold">
                  Phone:
                </Typography>
                <Typography variant="body1">{user?.phone || "N/A"}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1" fontWeight="bold">
                  Gender:
                </Typography>
                <Typography variant="body1">{user?.gender || "N/A"}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="subtitle1" fontWeight="bold">
                  Referral Code:
                </Typography>
                <Typography variant="body1">
                  {user?.referalCode || "N/A"}
                </Typography>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
        <ListItem component="button">
          <ListItemText primary="Deposit Record" />
        </ListItem>
        <ListItem component="button">
          <ListItemText primary="Withdrawal Record" />
        </ListItem>
        <ListItem component="button">
          <ListItemText primary="Lottry Record" />
        </ListItem>
      </List>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Profile;
