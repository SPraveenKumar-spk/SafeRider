import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../Store/Auth";
import Header from "../../Components/Header";

const PasswordReset = () => {
  const { baseURL } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromUrl = queryParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError("Invalid or expired link.");
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch(
        `${baseURL}/api/auth/resetpassword?token=${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ newPassword }),
        }
      );

      if (response.ok) {
        setSuccess("Password has been reset successfully.");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        const data = await response.json();
        setError(data.message || "Failed to reset password. Please try again.");
      }
    } catch {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center text-blue-600">
            Reset Password
          </h2>
          {error && (
            <div className="mt-3 text-red-600 bg-red-100 p-2 rounded text-center">
              {error}
            </div>
          )}
          {success && (
            <div className="mt-3 text-green-600 bg-green-100 p-2 rounded text-center">
              {success}
            </div>
          )}
          <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-md font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-md font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="w-full bg-blue-500 text-white text-lg font-medium p-2 rounded-lg hover:bg-blue-600 transition"
              >
                Reset Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default PasswordReset;
