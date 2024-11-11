import { Suspense, lazy, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Loader from "./components/Loader";
import { userExist, userNotExist } from "./redux/reducer/userReducer";
import { RootState, server } from "./redux/store";

import ProtectedRoute from "./components/ProtectedRoute";
import axios from "axios";

const Home = lazy(() => import("./pages/Home"));
const UserComponent = lazy(() => import("./pages/UserComponent"));
const Profile = lazy(() => import("./pages/profile"));
const Login = lazy(() => import("./pages/login"));
const Register = lazy(() => import("./pages/registration"));
const Victory = lazy(() => import("./pages/victory"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Payment = lazy(() => import("./pages/Payment"));
const ManualBettingPage = lazy(() => import("./pages/manualbatting"));
const Withdraw = lazy(() => import("./pages/withdraw"));
const WagerDetails = lazy(() => import("./pages/WagerDetails"));
const About = lazy(() => import("./pages/about"));

const Users = lazy(() => import("./pages/admin/users"));
const UpiIds = lazy(() => import("./pages/admin/upiIds"));
const AdminHome = lazy(() => import("./pages/admin/adminHome"));
const Lottrystart = lazy(() => import("./pages/admin/lottrystart"));

const App = () => {
  const { user, loading } = useSelector(
    (state: RootState) => state.userReducer
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = () => {
      axios
        .get(`${server}/api/v1/user/me`, { withCredentials: true })
        .then(({ data }) => {
          dispatch(userExist(data.user));
          localStorage.setItem("user", JSON.stringify(data.user));
        })
        .catch(() => dispatch(userNotExist()));
    };

    fetchUser();

    const interval = setInterval(fetchUser, 30000);

    return () => clearInterval(interval);
  }, [dispatch]);

  return loading ? (
    <Loader />
  ) : (
    <Router>
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route
            path="/register"
            element={
              <ProtectedRoute isAuthenticated={user ? false : true}>
                <Register />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <ProtectedRoute
                isAuthenticated={user ? false : true}
                redirect="/"
              >
                <Login />
              </ProtectedRoute>
            }
          />

          <Route
            element={<ProtectedRoute isAuthenticated={user ? true : false} />}
          >
            <Route path="/" element={<Home />} />
            <Route path="/lottery" element={<WagerDetails />} />
            <Route path="/lottryresult" element={<UserComponent />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/victory" element={<Victory />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/withdraw" element={<Withdraw />} />
            <Route path="/about" element={<About />} />
            <Route path="/manualbetting" element={<ManualBettingPage />} />
          </Route>

          {/* Admin Routes */}
          <Route
            element={
              <ProtectedRoute
                isAuthenticated={true}
                adminOnly={true}
                admin={user?.role === "admin" ? true : false}
              />
            }
          >
            <Route path="/admin" element={<AdminHome />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/lottrystart" element={<Lottrystart />} />
            <Route path="/admin/upi" element={<UpiIds />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster position="bottom-center" />
    </Router>
  );
};

export default App;
