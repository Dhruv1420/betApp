import {
  Avatar,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import BottomNav from "../components/Header";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const Profile = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

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
          alt="Rajawat"
          src="/path-to-avatar.jpg"
          sx={{ width: 80, height: 80 }}
        />
        <Typography variant="h6" mt={2}>
          {user?.name}
        </Typography>
        <Typography variant="h5" color="primary" mt={1}>
          Balance: <span style={{ color: "orange" }}>{user?.coins}</span>
        </Typography>
        <Box display="flex" justifyContent="space-between" mt={2} width="100%">
          <Button variant="contained" color="error" fullWidth>
            Deposit
          </Button>
          <Button variant="contained" color="error" fullWidth>
            Withdraw
          </Button>
        </Box>
      </Box>

      {/* Account Options */}
      <List>
        <ListItem component="button">
          <ListItemText primary="Order" />
        </ListItem>
        <ListItem component="button">
          <ListItemText primary="Pre-order" />
        </ListItem>
        <ListItem component="button">
          <ListItemText primary="Transfer" />
        </ListItem>
        <ListItem component="button">
          <ListItemText primary="Deposit Record" />
        </ListItem>
        <ListItem component="button">
          <ListItemText primary="Withdrawal Record" />
        </ListItem>
        <ListItem component="button">
          <ListItemText primary="Fund Record" />
        </ListItem>
        <ListItem component="button">
          <ListItemText primary="Profit Report" />
        </ListItem>
      </List>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Profile;
