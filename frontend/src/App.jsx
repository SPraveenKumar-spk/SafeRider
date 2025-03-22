import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoutes from "./Components/ProtectedRoutes";
import Home from "./Home";
import About from "./Pages/About";
import Signup from "./Pages/Authentication/Signup";
import SignIn from "./Pages/Authentication/Login";
import PasswordReset from "./Pages/Authentication/PasswordReset";
import Logout from "./Pages/Authentication/Logout";
import NotFound from "./Pages/NotFound";
import ForgotPassword from "./Pages/Authentication/ForgotPassword";
import Contact from "./Pages/Contact";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import UserDashboard from "./Components/Users/UserDashboard";
import UserProfile from "./Components/Users/UserProfile";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoutes />}>
            <Route path="/logout" element={<Logout />} />
          </Route>

          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/user" element={<UserDashboard />} />
          <Route path="/userprofile" element={<UserProfile />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/resetpassword" element={<PasswordReset />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

{
  /* <Route
          path="/admin"
          element={
            <ProtectedRoute element={AdminDashboard} allowedRoles={["admin"]} />
          }
        />
        <Route
          path="/user"
          element={
            <ProtectedRoute element={UserDashboard} allowedRoles={["user"]} />
          }
        /> */
}
