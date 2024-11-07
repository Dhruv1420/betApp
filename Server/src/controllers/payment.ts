import QRCode from "qrcode";
import { TryCatch } from "../middlewares/error.js";
import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";
import { UpiId } from "../models/upiId.js";

export const createPaymentIntent = TryCatch(async (req, res, next) => {
  const { amount } = req.body;
  if (!amount) return next(new ErrorHandler("Please enter amount", 400));
  if (amount < 0)
    return next(new ErrorHandler("Please enter valid amount", 400));

  const upiIds = await UpiId.find();
  const randomIndex = Math.floor(Math.random() * upiIds.length);
  const upiId = upiIds[randomIndex];
  const receiverName = "Victory Online";
  const currency = "INR";

  const upiLink = `upi://pay?pa=${upiId.upiId}&pn=${receiverName}&am=${Number(
    amount
  )}&cu=${currency}`;

  QRCode.toDataURL(upiLink, (err, url) => {
    if (err) return next(new ErrorHandler("Error in generating QR Code", 400));

    return res.status(201).json({
      success: true,
      upiId: upiId.upiId,
      amount,
      url,
    });
  });
});

export const paymentDetails = TryCatch(async (req, res, next) => {
  const { id } = req.query;
  const { amount, referenceNumber } = req.body;

  if (!amount || !referenceNumber)
    return next(new ErrorHandler("Please enter all fields", 400));

  if (amount < 0)
    return next(new ErrorHandler("Please enter valid amount", 400));

  const user = await User.findById(id);
  if (!user) return next(new ErrorHandler("User Not Found", 404));

  user.paymentHistory.push({ amount, referenceNumber });
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Payment details updated successfully",
    user,
  });
});

export const changePaymentStatus = TryCatch(async (req, res, next) => {
  const { id, amount, referenceNumber, status } = req.body;
  const user = await User.findById(id);
  if (!user) return next(new ErrorHandler("User Not Found", 404));

  const paymentRecord = user.paymentHistory.find(
    (record) =>
      record.amount === amount && record.referenceNumber === referenceNumber
  );

  if (!paymentRecord)
    return next(new ErrorHandler("Payment Record Not Found", 404));

  if (paymentRecord.status === "completed")
    return next(new ErrorHandler("Payment already verified", 400));

  paymentRecord.status = status;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Payment status updated successfully",
    user,
  });
});

export const withdrawRequest = TryCatch(async (req, res, next) => {
  const { id } = req.query;
  const { coins, accNo, ifsc, contact, bankName, receiverName } = req.body;

  const user = await User.findById(id);
  if (!user) return next(new ErrorHandler("User Not Found", 404));

  if (!coins || !accNo || !ifsc || !contact || !bankName || !receiverName)
    return next(new ErrorHandler("Please enter all fields", 400));

  if (coins <= 100) return next(new ErrorHandler("Insufficient coins", 400));

  user.withdrawHistory.push({
    accNo,
    ifsc,
    contact,
    bankName,
    receiverName,
    coins,
  });
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Withdraw request sent successfully",
    user,
  });
});

export const changeWithdrawStatus = TryCatch(async (req, res, next) => {
  const { id, coins, accNo, ifsc, contact, bankName, receiverName, status } =
    req.body;
  const user = await User.findById(id);
  if (!user) return next(new ErrorHandler("User Not Found", 404));

  const withdrawRecord = user.withdrawHistory.find(
    (record) =>
      record.coins === coins &&
      record.accNo === accNo &&
      record.ifsc === ifsc &&
      record.contact === contact &&
      record.receiverName === receiverName &&
      record.bankName === bankName
  );

  if (!withdrawRecord)
    return next(new ErrorHandler("Payment Record Not Found", 404));

  if (withdrawRecord.status === "approved")
    return next(new ErrorHandler("Withdraw already verified", 400));

  withdrawRecord.status = status;
  if (status === "approved") {
    if (user.coins < coins) {
      return next(new ErrorHandler("Insufficient coins", 400));
    }
    user.coins -= coins;
  }
  await user.save();

  res.status(200).json({
    success: true,
    message: "Withdraw status updated successfully",
    user,
  });
});
