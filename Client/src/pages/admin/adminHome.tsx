/* eslint-disable react-hooks/rules-of-hooks */
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const adminHome = () => {
  const navigate = useNavigate();

  return (
    <>
      <div>adminHome</div>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        onClick={() => navigate("/admin/users")}
      >
        Users
      </Button>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        onClick={() => navigate("/admin/lottrystart")}
      >
        Lottery Control
      </Button>
    </>
  );
};

export default adminHome;
