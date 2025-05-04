import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../Store/Auth";
import { useToast } from "../../store/ToastContext";
import { ImSpinner9 } from "react-icons/im";
import Header from "../../Components/Header";
import Breadcrumbs from "../../Components/Breadcrumbs";

function Login() {
  const { baseURL, storeToken, storeRole, isLoggedIn, userRole } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  useEffect(() => {
    if (isLoggedIn) {
      navigate(`/${userRole}`);
    }
  }, [navigate, isLoggedIn]);
  const notifyLoginError = () => toast.error("Something went wrong. Try again");
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        const data = await response.json();
        storeToken(data.access_token);
        storeRole(data.role);
        setUser({
          email: "",
          password: "",
        });
        setTimeout(() => {
          navigate(`/${data.role}`);
        }, 100);
      } else if (response.status === 404) {
        setLoginError(true);
      } else if (response.status === 401) {
        setInvalidUser(true);
      } else {
      }
    } catch (error) {
      setLoginError(true);
      notifyLoginError();
    } finally {
      setLoading(false);
    }
  };

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <section>
        <Header />
      </section>
      <section className="bg-gray-200 min-h-screen flex flex-col items-center ">
        <div className="w-full max-w-xl px-4 pt-25 ">
          <Breadcrumbs />
        </div>

        <div className="bg-white rounded-lg shadow-md w-full max-w-md px-8 py-6">
          <h1 className="text-3xl text-[#4F46E5] font-semibold text-center">
            Welcome Back
          </h1>

          <h3 className="text-2xl py-4 font-medium text-center ">
            Sign in to your account
          </h3>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-2 text-md font-medium text-gray-900">
                Your email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="yourname@gmail.com"
                value={user.email}
                onChange={handleInput}
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-md font-medium text-gray-900">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 placeholder:text-2xl"
                  placeholder="••••••••"
                  value={user.password}
                  onChange={handleInput}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  onClick={togglePassword}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {loginError && (
              <div className="alert alert-danger text-red-500" role="alert">
                Invalid email or password.
              </div>
            )}

            <div className="flex justify-end">
              <NavLink
                className="text-blue-500 hover:underline"
                to="/forgotpassword"
              >
                Forgot Password?
              </NavLink>
            </div>

            <div className="text-center">
              <button className="w-full flex items-center justify-center gap-2 rounded-lg p-2 text-2xl text-white bg-blue-400 hover:bg-blue-600 cursor-pointer">
                {loading && <ImSpinner9 className="animate-spin" size={20} />}
                Login
              </button>
            </div>

            <div className="text-center">
              <p>
                Don't have an account?
                <NavLink
                  className="text-blue-800 hover:underline px-1"
                  to="/register"
                >
                  Register
                </NavLink>
              </p>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}

export default Login;
