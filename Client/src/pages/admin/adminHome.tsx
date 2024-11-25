import { useNavigate } from "react-router-dom";
import { useGetUserActiveCountQuery } from "../../redux/api/userAPI";
import { useSelector } from "react-redux";
import { RootState, server } from "../../redux/store";
import Loader from "../../components/Loader";
import { CustomError } from "../../types/apiTypes";
import toast from "react-hot-toast";
import axios, { AxiosError } from "axios";

const AdminHome = () => {
  const navigate = useNavigate();

  const { user } = useSelector((state: RootState) => state.userReducer);

  const { isLoading, data, isError, error } = useGetUserActiveCountQuery(
    user?._id as string
  );

  const activateAllUsers = async () => {
    try {
      const response = await axios.get(
        `${server}/api/v1/user/activeusers?id=${user?._id}`,
        {
          withCredentials: true,
        }
      );
      console.log(response);
      toast.success(response.data.message);
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(
          error?.response?.data?.message || "Failed to activate all users"
        );
      } else if (error instanceof Error) {
        toast.error(error.message || "Something Went Wrong");
      } else {
        console.log("An unknown error occurred:", error);
        toast.error("An unknown error occurred");
      }
    }
  };

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }

  return isLoading ? (
    <Loader />
  ) : (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Home</h1>

      {/* Active Users Box */}
      <div className="w-full max-w-md bg-green-100 text-green-800 font-semibold py-3 px-4 rounded-lg shadow-md mb-6 flex items-center justify-between">
        <span>Active Users: {data?.activeUserCounts || 0}</span>
        <button
          className="bg-green-600 text-white font-medium py-2 px-4 rounded hover:bg-green-700 transition duration-300"
          onClick={activateAllUsers}
        >
          Activate All Users
        </button>
      </div>

      {/* Navigation Buttons */}
      <button
        className="w-full max-w-md bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-200 ease-in-out mb-4"
        onClick={() => navigate("/admin/users")}
      >
        Users
      </button>

      <button
        className="w-full max-w-md bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-200 ease-in-out mb-4"
        onClick={() => navigate("/admin/lottrystart")}
      >
        Lottery Control
      </button>

      <button
        className="w-full max-w-md bg-blue-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-200 ease-in-out mb-4"
        onClick={() => navigate("/admin/upi")}
      >
        UPI IDs
      </button>
    </div>
  );
};

export default AdminHome;
