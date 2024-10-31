/* eslint-disable react-hooks/rules-of-hooks */
import { Button } from "@mui/material";
import { ReactElement, useEffect, useState } from "react";
import {
  useAddUpiMutation,
  useDltUpiMutation,
  useGetUpiQuery,
} from "../../redux/api/upiAPI";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { responseToast } from "../../utils/features";
import { Column } from "react-table";
import TableHOC from "../../components/admin/TableHOC";
import toast from "react-hot-toast";
import { CustomError } from "../../types/apiTypes";
import Loader from "../../components/Loader";
import { FaTrash } from "react-icons/fa";

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
            <button onClick={() => deleteHandler(i.upiId)}>
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
    <>
      <input
        type="text"
        id="number"
        value={upiId}
        onChange={(e) => setUpiId(e.target.value)}
        placeholder="Enter Upi ID"
        required
      />
      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        onClick={addUpiId}
      >
        Add UPI ID
      </Button>

      <main>{isLoading ? <Loader /> : Table}</main>
    </>
  );
};

export default UpiIds;
