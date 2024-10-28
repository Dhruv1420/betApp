import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Column } from "react-table";
import TableHOC from "../../components/admin/TableHOC";
import {
  useAllUsersQuery,
  useDeleteUserMutation,
} from "../../redux/api/userAPI";
import { RootState } from "../../redux/store";

import { responseToast } from "../../utils/features";
import Loader from "../../components/Loader";

interface DataType {
  name: string;
  email: string;
  gender: string;
  role: string;
  phone: number;
  action: ReactElement;
}

const columns: Column<DataType>[] = [

  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Gender",
    accessor: "gender",
  },
  {
    Header: "Email",
    accessor: "email",
  },
  {
    Header: "Role",
    accessor: "role",
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

  const deleteHandler = async (userId: string, userRole: string) => {
    if (userRole === "admin")
      return toast.error("Operation Invalid For This User");
    const res = await deleteUser({ userId, adminUserId: user?._id as string });
    responseToast(res, null, "");
  };

  if (isError) {
    // toast.error("error");
    console.log(error);
    console.log(user);
    console.log(document.cookie);
  }

  useEffect(() => {
    if (data) {
      setRows(
        data.users.map((i) => ({
          name: i.name,
          email: i.email,
          gender: i.gender,
          role: i.role,
          phone: i.phone,

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
     
      <main>{isLoading ? <Loader  /> : Table}</main>
    </div>
  );
};

export default Customers;
