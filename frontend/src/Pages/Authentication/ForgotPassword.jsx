import { useState } from "react";
import { useAuth } from "../../Store/Auth";
import { useToast } from "../../Store/ToastContext";
import Header from "../../Components/Header";
import Breadcrumbs from "../../Components/Breadcrumbs";

const ForgotPassword = () => {
  const { baseURL } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");

  const handleEmail = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${baseURL}/api/auth/forgotpassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        setEmail("");
        toast.success("Password reset link has been sent successfully.");
      } else {
        toast.error("Oops! Server error, try again later.");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <section className="bg-gray-200 min-h-screen flex flex-col items-center justify-center">
        <div className="w-full max-w-xl px-4">
          <Breadcrumbs />
        </div>
        <div className="bg-white rounded-lg shadow-md w-full max-w-md px-8 py-6">
          <h1 className="text-3xl text-[#4F46E5] font-semibold text-center">
            Forgot Password
          </h1>
          <p className="text-center text-gray-600 text-sm my-4">
            Enter your email address, and we'll send you a link to reset your
            password.
          </p>
          <form className="space-y-4" onSubmit={handleEmail}>
            <div>
              <label className="block mb-2 text-md font-medium text-gray-900">
                Your Email
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@gmail.com"
                className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="text-center">
              <button
                type="submit"
                className="w-full rounded-lg p-2 text-xl text-white bg-blue-400 hover:bg-blue-600 cursor-pointer"
              >
                Submit
              </button>
            </div>
            <div className="text-center">
              <a className="text-blue-800 hover:underline px-1" href="/login">
                Back to Login
              </a>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default ForgotPassword;
