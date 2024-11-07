import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiCoinStack } from "react-icons/bi";
import { FaTrash } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { MdOutlinePayment } from "react-icons/md";
import { TbStatusChange } from "react-icons/tb";
import { useSelector } from "react-redux";
import { Column } from "react-table";
import TableHOC from "../../components/admin/TableHOC";
import Loader from "../../components/Loader";
import { useAddCoinsMutation } from "../../redux/api/adminAPI";
import {
  useAllUsersQuery,
  useDeleteUserMutation,
} from "../../redux/api/userAPI";
import { RootState } from "../../redux/store";
import "../../styles/admin/users.scss";
import { CustomError, MessageResponse } from "../../types/apiTypes";
import { User } from "../../types/types";
import { responseToast } from "../../utils/features";
import {
  useStatusChangeMutation,
  useStatusChangeWithdrawMutation,
} from "../../redux/api/paymnetAPI";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

interface DataType {
  _id: string;
  name: string;
  gender: string;
  phone: number;
  referralCode: string;
  paymentHistory: ReactElement;
  withdrawHistory: ReactElement;
  addCoins: ReactElement;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "ID",
    accessor: "_id",
  },
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Gender",
    accessor: "gender",
  },
  {
    Header: "Phone",
    accessor: "phone",
  },
  {
    Header: "Referral Code",
    accessor: "referralCode",
  },
  {
    Header: "Payment History",
    accessor: "paymentHistory",
  },
  {
    Header: "Withdraw History",
    accessor: "withdrawHistory",
  },
  {
    Header: "Add Coins",
    accessor: "addCoins",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const Customers = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const { isLoading, data, isError, error } = useAllUsersQuery(
    user?._id as string
  );

  const [rows, setRows] = useState<DataType[]>([]);
  const [deleteUser] = useDeleteUserMutation();
  const [addCoins] = useAddCoinsMutation();
  const [statusChange] = useStatusChangeMutation();
  const [withdrawStatus] = useStatusChangeWithdrawMutation();

  // State to manage dialog visibility and coin input
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogPayment, setIsDialogPayment] = useState(false);
  const [isDialogWithdraw, setIsDialogWithdraw] = useState(false);
  const [userr, setUserr] = useState<User>();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [coinInput, setCoinInput] = useState<number>(0);

  const deleteHandler = async (userId: string, userRole: string) => {
    if (userRole === "admin")
      return toast.error("Operation Invalid For This User");
    const res = await deleteUser({ userId, adminUserId: user?._id as string });
    responseToast(res, null, "");
  };

  const addCoinsHandler = async (
    userId: string,
    adminUserId: string,
    coins: number
  ) => {
    const res = await addCoins({ userId, adminUserId, coins });
    responseToast(res, null, "");
  };

  // Open dialog with selected user ID
  const openDialog = (userId: string) => {
    setSelectedUserId(userId);
    setIsDialogOpen(true);
    setUserr(data?.users.find((i) => i._id === userId));
  };

  const openDialogPayment = (userId: string, history: string) => {
    setSelectedUserId(userId);
    if (history === "deposit") setIsDialogPayment(true);
    if (history === "withdraw") setIsDialogWithdraw(true);
    setUserr(data?.users.find((i) => i._id === userId));
  };

  const handleCloseDeposit = () => {
    setIsDialogPayment(false);
    setIsDialogWithdraw(false);
  };

  // Close dialog
  const closeDialog = () => {
    setIsDialogOpen(false);
    setCoinInput(0);
    setSelectedUserId(null);
  };

  // Handle form submission
  const handleAddCoinsSubmit = () => {
    if (selectedUserId && coinInput > 0 && user) {
      addCoinsHandler(selectedUserId, user._id, coinInput); // Pass adminUserId
      closeDialog();
    } else {
      toast.error("Please enter a valid number of coins");
    }
  };

  const changeStatus = async (
    userId: string,
    amount: number,
    referenceNumber: string
  ) => {
    const res = await statusChange({
      id: userId,
      _id: user?._id as string,
      amount,
      referenceNumber,
      status: "completed",
    });

    if (res && res.data) {
      toast.success(res?.data.message || "status changed");
    } else {
      const error = res.error as FetchBaseQueryError;
      const messageResponse = error.data as MessageResponse;
      toast.error(messageResponse.message);
    }
  };

  const changeStatusWithdraw = async (
    userId: string,
    coins: number,
    accNo: string,
    ifsc: string,
    bankName: string,
    receiverName: string,
    contact: number,
    status: string
  ) => {
    const res = await withdrawStatus({
      id: userId,
      _id: user?._id as string,
      coins,
      accNo,
      ifsc,
      bankName,
      receiverName,
      contact,
      status: status === "approved" ? "approved" : "not approved",
    });

    if (res && res.data) {
      toast.success(res?.data.message || "Withdraw status changed");
    } else {
      const error = res.error as FetchBaseQueryError;
      const messageResponse = error.data as MessageResponse;
      toast.error(messageResponse.message);
    }
  };

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }

  useEffect(() => {
    if (data) {
      setRows(
        data.users.map((i) => ({
          _id: i._id,
          name: i.name,
          gender: i.gender,
          phone: i.phone,
          referralCode:
            i.referalCode === "" || i.referalCode === null
              ? "NaN"
              : i.referalCode,
          paymentHistory: (
            <button onClick={() => openDialogPayment(i._id, "deposit")}>
              <MdOutlinePayment />
            </button>
          ),
          withdrawHistory: (
            <button onClick={() => openDialogPayment(i._id, "withdraw")}>
              <MdOutlinePayment />
            </button>
          ),
          addCoins: (
            <button onClick={() => openDialog(i._id)}>
              <BiCoinStack />
            </button>
          ),
          action: (
            <button onClick={() => deleteHandler(i._id, i.role)}>
              <FaTrash />
            </button>
          ),
        }))
      );
    }
  }, [data]);

  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboardProductBox",
    "All Users",
    rows.length > 4
  )();

  return (
    <div className="adminContainer">
      <main>{isLoading ? <Loader /> : Table}</main>

      {/* Dialog for adding coins */}
      {isDialogOpen && (
        <div className="dialogOverlay">
          <div className="dialogContent">
            <h2>Add Coins</h2>
            <h6>User Coins: {userr?.coins.toFixed(2)}</h6>
            <input
              type="number"
              placeholder="Enter number of coins"
              value={coinInput}
              onChange={(e) => setCoinInput(Number(e.target.value))}
            />
            <button onClick={handleAddCoinsSubmit}>Submit</button>
            <button onClick={closeDialog}>Cancel</button>
          </div>
        </div>
      )}

      <Dialog
        open={isDialogPayment}
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
            <IoMdClose />
          </IconButton>
        </Box>
        <DialogContent dividers>
          <List
            sx={{
              width: "100%",
              maxWidth: 600,
              bgcolor: "background.paper",
              margin: "0 auto",
            }}
          >
            {userr?.paymentHistory?.map((record, index) => (
              <React.Fragment key={index}>
                <ListItem divider>
                  <ListItemText
                    primary={
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", color: "text.primary" }}
                      >
                        Amount: ${record.amount}
                      </Typography>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        Reference Number: {record.referenceNumber}
                      </Typography>
                    }
                  />

                  <Typography
                    variant="body2"
                    sx={{
                      marginRight: 2,
                      color:
                        record.status === "completed"
                          ? "success.main"
                          : "error.main",
                    }}
                  >
                    {record.status}
                  </Typography>

                  <IconButton
                    color="primary"
                    onClick={() =>
                      changeStatus(
                        userr._id,
                        record.amount,
                        record.referenceNumber
                      )
                    }
                    aria-label="Change Status"
                    sx={{
                      "&:hover": {
                        color: "primary.dark",
                      },
                    }}
                  >
                    <TbStatusChange size={24} />
                  </IconButton>
                </ListItem>
                {index < userr.paymentHistory.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isDialogWithdraw}
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
          <DialogTitle>Withdraw Record</DialogTitle>
          <IconButton onClick={handleCloseDeposit} edge="end">
            <IoMdClose />
          </IconButton>
        </Box>
        <DialogContent dividers>
          <List
            sx={{
              width: "100%",
              maxWidth: 600,
              bgcolor: "background.paper",
              margin: "0 auto",
            }}
          >
            {userr?.withdrawHistory?.map((record, index) => (
              <React.Fragment key={index}>
                <ListItem divider>
                  <ListItemText
                    primary={
                      <>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: "bold", color: "text.primary" }}
                        >
                          Account Number: {record.accNo}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          IFSC Code: {record.ifsc}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          Bank Name: {record.bankName}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          Receiver's Name: {record.receiverName}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ color: "text.secondary" }}
                        >
                          Contact: {record.contact}
                        </Typography>
                      </>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                      >
                        Coins: {record.coins}
                      </Typography>
                    }
                  />

                  <Typography
                    variant="body2"
                    sx={{
                      marginRight: 2,
                      color:
                        record.status === "approved"
                          ? "success.main"
                          : "error.main",
                    }}
                  >
                    {record.status}
                  </Typography>

                  <button
                  className=" rounded-lg bg-[#4e44ce] px-2 mx-2 py-1 text-white"
                    onClick={() =>
                      changeStatusWithdraw(
                        userr._id,
                        record.coins,
                        record.accNo,
                        record.ifsc,
                        record.bankName,
                        record.receiverName,
                        record.contact,
                        "approved"
                      )
                    }
                    aria-label="Change Status"
                    
                  >
                    Approved
                  </button>

                  <button
                  className=" rounded-lg bg-red-500 w-44 mx-2 px-2 py-1 text-white"
                  onClick={() =>
                      changeStatusWithdraw(
                        userr._id,
                        record.coins,
                        record.accNo,
                        record.ifsc,
                        record.bankName,
                        record.receiverName,
                        record.contact,
                        "not approved"
                      )
                    }
                    aria-label="Change Status"
                    
                  >
                    Not Approved
                  </button>
                </ListItem>
                {index < userr.withdrawHistory.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Customers;
