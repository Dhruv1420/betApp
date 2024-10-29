import { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useWithdrawRequestMutation } from "../redux/api/paymnetAPI"; // Adjust the import path as necessary
import { RootState } from "../redux/store";


const Withdraw = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const [coins, setCoins] = useState<number>(0);
  const [withdrawRequest, { isLoading }] = useWithdrawRequestMutation();
  const navigate = useNavigate();

  const handleWithdraw = async () => {
    if (coins <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!user) {
      toast.error("User is not authenticated");
      navigate("/login");
      return;
    }

    const requestPayload = {
      _id: user._id,  // Use user ID from Redux state
      coins,
    };

    try {
      const response = await withdrawRequest(requestPayload).unwrap();
      toast.success(response?.message || "Withdrawal Successful");
      navigate("/profile");
      toast.success("Your balance will be updated shortly.");
    } catch (error) {
      toast.error("Withdrawal failed");
      console.error(user);
      console.error(error);
    }
  };

  return (
    <div className="withdraw-container">
      <h1>Withdraw Funds</h1>
      <label>
        Amount:
        <input
          type="number"
          value={coins}
          onChange={(e) => setCoins(Number(e.target.value))}
          placeholder="Enter amount"
          required
        />
      </label>
      <button onClick={handleWithdraw} disabled={isLoading}>
        {isLoading ? 'Processing...' : 'Withdraw'}
      </button>
    </div>
  );
};

export default Withdraw;
