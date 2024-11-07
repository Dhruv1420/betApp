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
  IconButton,
} from "@mui/material";
import BottomNav from "../components/Header";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { server } from "../contants/keys";
import { useDispatch } from "react-redux";
import { userNotExist } from "../redux/reducer/userReducer";
import toast from "react-hot-toast";

const Profile = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const [openProfile, setOpenProfile] = useState(false);
  const [openDeposit, setOpenDeposit] = useState(false);
  const [openWithdraw, setOpenWithdraw] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleOpenProfile = () => setOpenProfile(true);
  const handleCloseProfile = () => setOpenProfile(false);

  const handleOpenDeposit = () => setOpenDeposit(true);
  const handleCloseDeposit = () => setOpenDeposit(false);

  const handleOpenWithdraw = () => setOpenWithdraw(true);
  const handleCloseWithdraw = () => setOpenWithdraw(false);
  const handleAboutUsClick = () => {
    navigate("/about"); // Adjust the path based on your routing setup
  };

  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/user/logout`, {
        withCredentials: true,
      });

      dispatch(userNotExist());
      toast.success(data.message);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.message || "Something Went Wrong");
      } else if (error instanceof Error) {
        toast.error(error.message || "Something Went Wrong");
      } else {
        console.log("An unknown error occurred:", error);
        toast.error("An unknown error occurred");
      }
    }
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
          <span style={{ color: "Black", fontWeight: "bolder" }}>
            {user?.name}
          </span>
        </Typography>
        <Typography variant="h5" color="Black" mt={1}>
          Balance:{" "}
          <span style={{ color: "Red", fontWeight: "bolder" }}>
            {user?.coins.toFixed(2)} coins
          </span>
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
          <Button
            variant="contained"
            color="error"
            fullWidth
            onClick={() => navigate("/withdraw")}
          >
            Withdraw
          </Button>
        </Box>
        {user?.role === "admin" && (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => navigate("/admin")}
          >
            Admin Panel
          </Button>
        )}
      </Box>

      {/* Account Options */}
      <List>
        <ListItem
          component="button"
          onClick={handleOpenProfile}
          sx={{ cursor: "pointer" }}
        >
          <ListItemText primary="Profile" />
        </ListItem>
        <ListItem
          component="button"
          onClick={handleOpenDeposit}
          sx={{ cursor: "pointer" }}
        >
          <ListItemText primary="Deposit Record" />
        </ListItem>
        <ListItem
          component="button"
          onClick={handleOpenWithdraw}
          sx={{ cursor: "pointer" }}
        >
          <ListItemText primary="Withdrawal Record" />
        </ListItem>
        <ListItem
          component="button"
          sx={{ cursor: "pointer" }}
          onClick={handleAboutUsClick}
        >
          <ListItemText primary="About us" />
        </ListItem>

        <ListItem component="button" sx={{ cursor: "pointer" }}>
          <ListItemText primary="Logout" onClick={logoutHandler} />
        </ListItem>
      </List>

      {/* Profile Information Dialog */}
      <Dialog
        open={openProfile}
        onClose={handleCloseProfile}
        fullWidth
        maxWidth="sm"
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={2}
        >
          <DialogTitle>Profile Information</DialogTitle>
          <IconButton onClick={handleCloseProfile} edge="end">
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

      {/* Deposit Record Dialog */}
      <Dialog
        open={openDeposit}
        onClose={handleCloseDeposit}
        fullWidth
        maxWidth="sm"
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={2}
        >
          <DialogTitle>Deposit Record</DialogTitle>
          <IconButton onClick={handleCloseDeposit} edge="end">
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent dividers>
          <List>
            {user?.paymentHistory?.map((record, index) => (
              <ListItem key={index} divider>
                <ListItemText
                  primary={`Amount: ${record.amount}`}
                  secondary={`Reference Number: ${record.referenceNumber}`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>

      {/* Withdrawal Record Dialog */}
      <Dialog
        open={openWithdraw}
        onClose={handleCloseWithdraw}
        fullWidth
        maxWidth="sm"
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={2}
        >
          <DialogTitle>Withdrawal Record</DialogTitle>
          <IconButton onClick={handleCloseWithdraw} edge="end">
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent dividers>
          <List>
            {user?.withdrawHistory?.map((record, index) => (
              <ListItem key={index} divider>
                <ListItemText
                  primary={`Coins: ${record.coins}`}
                  secondary={`Status: ${record.status}`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Profile;
