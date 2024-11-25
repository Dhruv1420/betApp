/* eslint-disable react-hooks/exhaustive-deps */
import CloseIcon from "@mui/icons-material/Close";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BottomNav from "../components/Header";
import Loader from "../components/Loader";
import { server } from "../contants/keys";
import { useGetManualBetsQuery } from "../redux/api/betAPI";
import { userExist, userNotExist } from "../redux/reducer/userReducer";
import { RootState } from "../redux/store";
import { CustomError } from "../types/apiTypes";
import { User } from "../types/types";

interface MyReferralsDataType {
  name: string;
  email: string;
}

const Profile = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const [openProfile, setOpenProfile] = useState(false);
  const [openDeposit, setOpenDeposit] = useState(false);
  const [openReferrals, setOpenReferrals] = useState(false);
  const [openWithdraw, setOpenWithdraw] = useState(false);
  const [openManual, setOpenManual] = useState(false);
  const [referrals, setReferrals] = useState<MyReferralsDataType[]>([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data, isLoading, isError, error } = useGetManualBetsQuery(
    user?._id as string
  );

  const handleOpenProfile = () => setOpenProfile(true);
  const handleCloseProfile = () => setOpenProfile(false);

  const handleOpenReferrals = () => setOpenReferrals(true);
  const handleCloseReferrals = () => setOpenReferrals(false);

  const handleOpenDeposit = () => setOpenDeposit(true);
  const handleCloseDeposit = () => setOpenDeposit(false);

  const handleOpenWithdraw = () => setOpenWithdraw(true);
  const handleCloseWithdraw = () => setOpenWithdraw(false);

  const handleOpenManual = () => setOpenManual(true);
  const handleCloseManual = () => setOpenManual(false);

  const handleAboutUsClick = () => navigate("/about");

  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/user/logout`, {
        withCredentials: true,
      });

      localStorage.removeItem("user");
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

  useEffect(() => {
    const getProfile = async () => {
      try {
        const { data } = await axios.get(`${server}/api/v1/user/${user?._id}`, {
          withCredentials: true,
        });
        dispatch(userExist(data.user));
        localStorage.setItem("user", JSON.stringify(data.user));
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch user profile");
      }
    };

    const getReferrals = async () => {
      try {
        const { data } = await axios.post(
          `${server}/api/v1/user/myreferrals`,
          {
            referal: user?.referal,
          },
          {
            withCredentials: true,
          }
        );

        const details = data.users.map((user: User) => {
          return {
            name: user.name,
            email: user.email,
          };
        });

        setReferrals(details);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch referrals");
      }
    };

    getProfile();
    getReferrals();
  }, []);

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }

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
          sx={{
            cursor: "pointer",
            "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)" },
          }}
        >
          <ListItemText primary="Profile" />
        </ListItem>

        <ListItem
          component="button"
          onClick={handleOpenReferrals}
          sx={{
            cursor: "pointer",
            "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)" },
          }}
        >
          <ListItemText primary="My Referrals" />
        </ListItem>

        <ListItem
          component="button"
          onClick={handleOpenDeposit}
          sx={{
            cursor: "pointer",
            "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)" },
          }}
        >
          <ListItemText primary="Deposit Record" />
        </ListItem>

        <ListItem
          component="button"
          onClick={handleOpenWithdraw}
          sx={{
            cursor: "pointer",
            "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)" },
          }}
        >
          <ListItemText primary="Withdrawal Record" />
        </ListItem>

        <ListItem
          component="button"
          onClick={handleOpenManual}
          sx={{
            cursor: "pointer",
            "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)" },
          }}
        >
          <ListItemText primary="Manual Bet Record" />
        </ListItem>

        <ListItem
          component="button"
          sx={{
            cursor: "pointer",
            "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)" },
          }}
          onClick={handleAboutUsClick}
        >
          <ListItemText primary="About us" />
        </ListItem>

        <ListItem
          component="button"
          sx={{
            cursor: "pointer",
            "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)", color: "red" },
          }}
        >
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
              <Typography variant="body1">{user?.referal || "N/A"}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="subtitle1" fontWeight="bold">
                Referred By:
              </Typography>
              <Typography variant="body1">
                {user?.referalCode || "N/A"}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* My Referrals Dialog */}
      <Dialog
        open={openReferrals}
        onClose={handleCloseReferrals}
        fullWidth
        maxWidth="sm"
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={2}
        >
          <DialogTitle>My Referrals</DialogTitle>
          <IconButton onClick={handleCloseReferrals} edge="end">
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent dividers>
          {referrals.length > 0 ? (
            <List>
              {referrals.map((record, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={`User Name: ${record.name}`}
                    secondary={`Email: ${record.email}`}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography
              variant="body1"
              color="textSecondary"
              align="center"
              style={{ marginTop: "16px" }}
            >
              You have no referrals.
            </Typography>
          )}
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

      {/* Manual Bet Record Dialog */}
      <Dialog
        open={openManual}
        onClose={handleCloseManual}
        fullWidth
        maxWidth="sm"
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={2}
        >
          <DialogTitle>Manual Bet Record</DialogTitle>
          <IconButton onClick={handleCloseManual} edge="end">
            <CloseIcon />
          </IconButton>
        </Box>
        {isLoading ? (
          <Loader />
        ) : (
          <DialogContent dividers>
            <List>
              {data?.manualBets?.map((record, index) => (
                <ListItem key={index} divider>
                  <ListItemText
                    primary={`Number: ${record.number}`}
                    secondary={
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <span>Amount: {record.amount.toFixed(2)}</span>
                        <span>
                          Status:{" "}
                          <span
                            style={{
                              color:
                                record.status === "pending" ? "red" : "green",
                            }}
                          >
                            {record.status}
                          </span>
                        </span>
                        <span>Profit: {record.profit.toFixed(2)}</span>
                      </div>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </DialogContent>
        )}
      </Dialog>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Profile;
