/* eslint-disable react-hooks/exhaustive-deps */
import { ReactElement, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Column } from "react-table";
import TableHOC from "../../components/admin/TableHOC";
import Loader from "../../components/Loader";
import {
  useAddUpiMutation,
  useDltUpiMutation,
  useGetUpiQuery,
} from "../../redux/api/upiAPI";
import { RootState } from "../../redux/store";
import { CustomError } from "../../types/apiTypes";
import { responseToast } from "../../utils/features";

interface DataType {
  _id: string;
  upiId: string;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "ID",
    accessor: "_id",
  },
  {
    Header: "UPI ID",
    accessor: "upiId",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];

const UpiIds = () => {
  const { user } = useSelector((state: RootState) => state.userReducer);
  const { isLoading, data, isError, error } = useGetUpiQuery(
    user?._id as string
  );

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }

  const [upiId, setUpiId] = useState("");
  const [rows, setRows] = useState<DataType[]>([]);

  const [addUpi] = useAddUpiMutation();
  const [dltUpi] = useDltUpiMutation();

  const addUpiId = async () => {
    const res = await addUpi({ upiId: upiId, _id: user?._id as string });
    setUpiId("");
    responseToast(res, null, "");
  };

  const deleteHandler = async (upiId: string) => {
    if (data?.upiIds?.length === 1)
      return toast.error("At least one UPI ID is required");
    const res = await dltUpi({ upiId, _id: user?._id as string });
    responseToast(res, null, "");
  };

  useEffect(() => {
    if (data && data.upiIds) {
      setRows(
        data.upiIds?.map((i, idx) => ({
          key: idx,
          _id: i._id,
          upiId: i.upiId,
          action: (
            <button
              onClick={() => deleteHandler(i.upiId)}
              className="text-red-600 hover:text-red-800 transition duration-200"
            >
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
    "UPI IDs",
    rows.length > 4
  )();

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage UPI IDs</h1>

      <div className="flex items-center space-x-4 mb-6">
        <input
          type="text"
          id="number"
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
          placeholder="Enter UPI ID"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addUpiId}
          className="px-6 w-44 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Add UPI ID
        </button>
      </div>

      <main className="bg-gray-50 rounded-lg p-4">
        {isLoading ? <Loader /> : Table}
      </main>
    </div>
  );
};

export default UpiIds;
