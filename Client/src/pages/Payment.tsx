import React, { useState } from 'react';
import { useCreatePaymentIntentMutation } from '../redux/api/paymnetAPI'; // Adjust the path as needed

const Payment = () => {
  const [amount, setAmount] = useState<number>(0); // State for the amount
  const [qrCodeUrl, setQrCodeUrl] = useState<string>(''); // State for the QR code URL
  const [createPaymentIntent] = useCreatePaymentIntentMutation(); // Hook from RTK Query

  const handlePayment = async () => {
    try {
      const response = await createPaymentIntent({ amount }).unwrap();
      // Ensure response.url is defined before setting it
      if (response.url) {
        setQrCodeUrl(response.url); // Set the QR code URL from the response
      } else {
        console.error('QR code URL is undefined'); // Handle the undefined case if necessary
      }
    } catch (error) {
      console.error('Payment creation error:', error);
    }
  };

  return (
    <div>
      <h1>Create Payment</h1>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        placeholder="Enter amount"
      />
      <button onClick={handlePayment}>Create Payment</button>
      {qrCodeUrl && (
        <div>
          <h2>Scan the QR Code</h2>
          <img src={qrCodeUrl} alt="Payment QR Code" style={{ width: '200px', height: '200px' }} />
        </div>
      )}
    </div>
  );
};

export default Payment;