import { useNavigate } from "react-router-dom";

const AdminHome = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Home</h1>
      
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
