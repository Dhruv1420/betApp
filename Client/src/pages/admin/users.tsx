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

interface DataType {
  _id: string;
  name: string;
  gender: string;
  phone: number;
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

  const deleteHandler = async (userId: string, userRole: string) => {
    if (userRole === "admin")
      return toast.error("Operation Invalid For This User");
    const res = await deleteUser({ userId, adminUserId: user?._id as string });
    responseToast(res, null, "");
  };

  const addCoinsHandler = async (userId: string, coins: number) => {
    const res = await addCoins({ userId, coins });
    responseToast(res, null, "");
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

          addCoins: (
            <button onClick={() => addCoinsHandler(i._id, i.coins)}>
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
    "Customers",
    rows.length > 4
  )();

  return (
    <div className="adminContainer">
      <main>{isLoading ? <Loader /> : Table}</main>
    </div>
  );
};

export default Customers;
