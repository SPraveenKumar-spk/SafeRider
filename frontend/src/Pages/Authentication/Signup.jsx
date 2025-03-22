import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FaUser, FaEnvelope, FaLock, FaKey } from "react-icons/fa";
import { useAuth } from "../../Store/Auth";
import { ImSpinner9 } from "react-icons/im";
import Header from "../../Components/Header";
import Breadcrumbs from "../../Components/Breadcrumbs";

function Signup() {
  const { baseURL } = useAuth();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      if (response.ok) {
        setUser({
          name: "",
          email: "",
          password: "",
          // role: "",
        });
        navigate("/login");
      } else if (response.status === 401) {
        setLoginError(true);
      }
    } catch (error) {
      console.log(error);
      setLoginError(true);
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
        <div className="w-full max-w-xl px-4 pt-20 ">
          <Breadcrumbs />
        </div>

        <div className="bg-white rounded-lg shadow-md w-full max-w-md px-8 py-6">
          <h1 className="text-3xl mb-4 text-[#4F46E5] font-semibold text-center">
            Sign up
          </h1>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-2 text-md font-medium text-gray-900">
                Your Name
              </label>
              <input
                type="text"
                name="name"
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={user.name}
                onChange={handleInput}
                placeholder="Your Name"
                required
              />
            </div>

            <div>
              <label className="block mb-2 text-md font-medium text-gray-900">
                Your Email
              </label>
              <input
                type="email"
                name="email"
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={user.email}
                onChange={handleInput}
                placeholder="Your Email"
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
                  name="password"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 placeholder:text-2xl"
                  value={user.password}
                  onChange={handleInput}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-2 text-gray-600"
                  onClick={togglePassword}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {loginError && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative"
                role="alert"
              >
                Email already exists.
              </div>
            )}

            <div className="text-center">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 rounded-lg p-2 text-2xl text-white bg-blue-400 hover:bg-blue-600 cursor-pointer disabled:opacity-50"
                disabled={loading}
              >
                {loading && <ImSpinner9 className="animate-spin" size={24} />}
                Register
              </button>
            </div>

            <p className="text-center text-gray-600 mt-4">
              Have already an account?
              <NavLink
                to="/login"
                className="text-blue-800 hover:underline px-1"
              >
                Login here
              </NavLink>
            </p>
          </form>
        </div>
      </section>
    </>
  );
}

export default Signup;
