import { useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useCreatePaymentIntentMutation,
  usePaymentDetailsMutation,
} from "../redux/api/paymnetAPI";
import { RootState } from "../redux/store";
import "../styles/Payment.scss"; // Import your SCSS file

const Payment = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);

  const [amount, setAmount] = useState<number>(0);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [upiId, setUpiId] = useState<string>("");
  const [referenceNumber, setReferenceNumber] = useState<string>("");

  const [createPaymentIntent] = useCreatePaymentIntentMutation();
  const [paymentDetails] = usePaymentDetailsMutation();

  const navigate = useNavigate();

  const handlePayment = async () => {
    try {
      const response = await createPaymentIntent({ amount }).unwrap();
      if (response.url) {
        setQrCodeUrl(response.url);
        setUpiId(response.upiId || "");
      } else {
        toast.error("QR code URL is undefined");
      }
    } catch (error) {
      toast.error("Payment creation error");
      console.log(error);
    }
  };

  const submitHandler = async () => {
    try {
      if (!user) {
        toast.error("User is not authenticated");
        navigate("/login");
        return;
      }

      const details = {
        _id: user._id,
        amount,
        referenceNumber,
      };
      const data = await paymentDetails(details).unwrap();
      toast.success(data?.message || "Payment Success");
      navigate("/profile");
      toast.success("Balance will be updated shortly");
    } catch (error) {
      toast.error("Payment Creation Error");
      console.log(error);
    }
  };

  return (
    <div className="payment-container">
      <h1>Create Payment</h1>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        placeholder="Enter amount"
        required
      />
      <button onClick={handlePayment}>Create Payment</button>
      {qrCodeUrl && (
        <div className="qr-code-container">
          <h2>Scan the QR Code or use the upiId: {upiId}</h2>
          <img src={qrCodeUrl} alt="Payment QR Code" />
          <input
            type="text"
            value={referenceNumber}
            onChange={(e) => setReferenceNumber(e.target.value)}
            placeholder="Enter Reference Number"
            required
          />
          <button onClick={submitHandler}>Pay</button>
        </div>
      )}
    </div>
  );
};

export default Payment;
