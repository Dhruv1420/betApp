import React, { useState } from 'react';
import '../styles/Payment.scss';

const Payment: React.FC = () => {
    const [copySuccess, setCopySuccess] = useState(false);
  
    // Function to handle copying the UPI ID to the clipboard
    const copyToClipboard = () => {
      const upiID = 'jana240931296@janabank';
      navigator.clipboard.writeText(upiID).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000); // Reset copy success after 2 seconds
      }).catch((err) => {
        console.error('Failed to copy: ', err);
      });
    };
  
    return (
      <div className="payment-page">
        <div className="payment-container">
          <h2 className="amount">Total Amount Payable: <span>₹129.0</span></h2>
          
          <div className="option option-1">
            <h3>Option 1:</h3>
            <p>Use Mobile Scan code to pay</p>
            <div className="qr-code">
              <img src="path/to/qr-code.png" alt="QR Code" />
            </div>
            <img src="path/to/paytm-logo.png" alt="Paytm" className="pay-logo" />
          </div>
          
          <div className="option option-2">
            <h3>Option 2:</h3>
            <p>1. Open your UPI wallet and complete the transfer</p>
            <div className="upi-section">
              <p><strong>UPI:</strong> jana240931296@janabank</p>
              <button className="copy-btn" onClick={copyToClipboard}>Copy</button>
              {copySuccess && <span className="copy-success">Copied!</span>}
            </div>
            <p>2. Record your reference No. (Ref No.) after payment</p>
            <div className="reference-input">
              <input type="text" placeholder="Input 12-digit here" />
            </div>
          </div>
  
          <div className="instructions">
            <h4>Instructions for Deposits:</h4>
            <p>1. Please save the QR code or copy the UPI ID for payment purposes. The account is only valid for a single deposit.</p>
            <p>2. Ensure the deposited amount matches the stated amount to avoid a failed transaction.</p>
            <p>3. You may pay through any app for the given UPI ID.</p>
            <p>4. Complete the transaction in 5 minutes or the money may be lost.</p>
            <p>5. Within 24 hours, 5 failed deposit attempts will temporarily suspend your ID for 24 hours.</p>
          </div>
  
          <button className="submit-btn">Submit</button>
        </div>
      </div>
    );
  };

export default Payment;
