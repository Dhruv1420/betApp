import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { BiCoinStack } from "react-icons/bi";
import { useSelector } from "react-redux";
import { Column } from "react-table";
import TableHOC from "../../components/admin/TableHOC";
import Loader from "../../components/Loader";
import {
  useAllUsersQuery,
  useDeleteUserMutation,
} from "../../redux/api/userAPI";
import { RootState } from "../../redux/store";
import { responseToast } from "../../utils/features";
import { CustomError } from "../../types/apiTypes";
import { useAddCoinsMutation } from "../../redux/api/adminAPI";
import "../../styles/admin/users.scss";

interface DataType {
  _id: string;
  name: string;
  gender: string;
  phone: number;
  referralCode: string;
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

  // State to manage dialog visibility and coin input
  const [isDialogOpen, setIsDialogOpen] = useState(false);
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
          referralCode: i.referalCode === null ? "NaN" : i.referalCode,
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
    </div>
  );
};

export default Customers;
