import {
  FaUser,
  FaBell,
  FaMotorcycle,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import Logo from "../../assets/Logo.png";
import { useAuth } from "../../Store/Auth";

const UserDashboard = () => {
  const { access_token, LogoutUser, baseURL } = useAuth();
  const navigate = useNavigate();

  const [userProfile, setUserProfile] = useState(null);
  const [violations, setViolations] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [imageUrls, setImageUrls] = useState({});

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("violations");
  const [selectedViolation, setSelectedViolation] = useState(null);

  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingViolations, setIsLoadingViolations] = useState(false);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [error, setError] = useState(null);

  const safeNavigate = useCallback(
    (path, options) => {
      if (!window.location.pathname.includes(path)) {
        console.log(`Navigating to ${path}`);
        navigate(path, { ...options, replace: true });
      } else {
        console.log(`Skipped navigation to ${path} (already on route)`);
      }
    },
    [navigate]
  );

  const fetchProfile = useCallback(async () => {
    if (!access_token) {
      console.log("No access_token, skipping fetchProfile");
      return;
    }
    setIsLoadingProfile(true);
    setError(null);
    try {
      console.log("Fetching profile from", `${baseURL}/api/user/profile`);
      const response = await fetch(`${baseURL}/api/user/profile`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Profile data:", data);
        setUserProfile(data);
      }
    } catch (err) {
      console.error("Error fetching profile:", err.message);
      setError(err.message || "Failed to load profile data.");
    } finally {
      setIsLoadingProfile(false);
    }
  }, [access_token, baseURL, LogoutUser, safeNavigate]);

  const fetchViolations = useCallback(async () => {
    if (!access_token) {
      console.log("No access_token, skipping fetchViolations");
      return;
    }
    setIsLoadingViolations(true);
    setError(null);
    try {
      console.log("Fetching violations from", `${baseURL}/api/user/violations`);
      const response = await fetch(`${baseURL}/api/user/violations`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Violations data:", data);
        setViolations(data.violations || []);

        const urls = {};
        for (const violation of data.violations || []) {
          try {
            console.log(
              "Fetching image:",
              `${baseURL}/api/admin/detection-image/${violation.detection_id}`
            );
            const imageResponse = await fetch(
              `${baseURL}/api/admin/detection-image/${violation.detection_id}`,
              {
                headers: { Authorization: `Bearer ${access_token}` },
              }
            );
            if (!imageResponse.ok) {
              throw new Error(
                `Image fetch failed for violation ${violation.id} (status ${imageResponse.status})`
              );
            }
            const blob = await imageResponse.blob();
            urls[violation.id] = URL.createObjectURL(blob);
            console.log(`Image URL created for violation ${violation.id}`);
          } catch (err) {
            console.error(
              `Error fetching image for violation ${violation.id}:`,
              err.message
            );
          }
        }
        setImageUrls(urls);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error ||
            `Failed to fetch violations (status ${response.status})`
        );
      }
    } catch (err) {
      console.error("Error fetching violations:", err.message);
      setError(err.message || "Failed to load violations.");
    } finally {
      setIsLoadingViolations(false);
    }
  }, [access_token, baseURL, LogoutUser, safeNavigate]);

  const fetchNotifications = useCallback(async () => {
    if (!access_token) {
      console.log("No access_token, skipping fetchNotifications");
      return;
    }
    setIsLoadingNotifications(true);
    setError(null);
    try {
      console.log(
        "Fetching notifications from",
        `${baseURL}/user/notifications`
      );
      const response = await fetch(`${baseURL}/api/user/notifications`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Notifications data:", data);
        setNotifications(data);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error ||
            `Failed to fetch notifications (status ${response.status})`
        );
      }
    } catch (err) {
      console.error("Error fetching notifications:", err.message);
      setError(err.message || "Failed to load notifications.");
    } finally {
      setIsLoadingNotifications(false);
    }
  }, [access_token, baseURL, LogoutUser, safeNavigate]);

  useEffect(() => {
    console.log("useEffect running, access_token:", !!access_token);
    if (!access_token) {
      safeNavigate("/login");
    } else {
      fetchProfile();
      fetchViolations();
      fetchNotifications();
    }
  }, [
    access_token,
    fetchProfile,
    fetchViolations,
    fetchNotifications,
    safeNavigate,
  ]);

  const handlePayment = async (fineId) => {
    if (!access_token) {
      console.log("No access_token, skipping payment");
      return;
    }
    try {
      console.log("Initiating payment for fine ID:", fineId);
      const response = await fetch(
        `${baseURL}/api/user/violations/${fineId}/pay`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Payment error:", response.status, errorData);
        throw new Error(
          errorData.error || `Payment failed (status ${response.status})`
        );
      }
      const data = await response.json();
      console.log("Payment response:", data);
      alert(data.message);
      setViolations((prev) =>
        prev.map((v) => (v.id === fineId ? { ...v, status: "paid" } : v))
      );
      if (selectedViolation && selectedViolation.id === fineId) {
        setSelectedViolation((prev) => ({ ...prev, status: "paid" }));
      } else {
        setSelectedViolation(null);
      }
      fetchNotifications();
    } catch (err) {
      console.error("Payment error:", err.message);
      setError(err.message || "Payment failed. Please try again.");
    }
  };

  const handleLogout = useCallback(() => {
    console.log("Logging out");
    LogoutUser();
    safeNavigate("/login");
  }, [LogoutUser, safeNavigate]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleSectionChange = (section) => {
    console.log("Changing section to:", section);
    setActiveSection(section);
    setSelectedViolation(null);
    setError(null);
    setIsSidebarOpen(false);
  };

  const isLoading =
    isLoadingProfile || isLoadingViolations || isLoadingNotifications;

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-white shadow-md p-4 flex items-center justify-between z-50">
        <div className="flex items-center gap-3">
          <button
            className="md:hidden text-2xl text-gray-700"
            onClick={toggleSidebar}
          >
            {isSidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
          <img
            src={Logo}
            className="w-12 h-11 cursor-pointer"
            alt="SafeRider Logo"
          />
          <a
            className="text-2xl text-[#007C5A] font-semibold cursor-pointer"
            href="#"
            onClick={() => handleSectionChange("violations")}
          >
            SafeRider
          </a>
        </div>
      </header>

      <div className="min-h-screen bg-gray-50 flex pt-16">
        <aside
          className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 md:static md:translate-x-0 ${
            isSidebarOpen
              ? "translate-x-0 top-16 h-[calc(100vh-4rem)]"
              : "-translate-x-full"
          }`}
        >
          <nav className="p-6 space-y-3">
            {[
              { label: "Profile", icon: FaUser, section: "profile" },
              {
                label: "Violations",
                icon: FaMotorcycle,
                section: "violations",
              },
              {
                label: "Notifications",
                icon: FaBell,
                section: "notifications",
              },
              { label: "Logout", icon: FaSignOutAlt, section: "logout" },
            ].map(({ label, icon: Icon, section }) => (
              <button
                key={section}
                onClick={
                  section === "logout"
                    ? handleLogout
                    : () => handleSectionChange(section)
                }
                className={`flex items-center w-full p-3 rounded-lg transition-all duration-200 ${
                  activeSection === section && section !== "logout"
                    ? "bg-[#007C5A] text-white font-semibold"
                    : "text-gray-700 hover:bg-gray-100 hover:text-[#007C5A]"
                }`}
              >
                <Icon className="mr-3 flex-shrink-0" />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-4 md:p-6 overflow-y-auto h-[calc(100vh-4rem)]">
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
              <button
                onClick={() => setError(null)}
                className="absolute top-0 bottom-0 right-0 px-4 py-3"
              >
                <FaTimes />
              </button>
            </div>
          )}
          {isLoading && (
            <p className="text-center text-gray-500 py-10">Loading...</p>
          )}
          {activeSection === "profile" && !isLoading && (
            <div className="bg-white rounded-xl shadow-md p-6 animate-fade">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Profile
              </h2>
              {userProfile ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(userProfile).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-sm text-gray-500 capitalize">
                        {key.replace(/_/g, " ")}
                      </p>
                      <p className="text-gray-800 font-medium">
                        {value || "Not provided"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-10">
                  No profile data available.
                </p>
              )}
            </div>
          )}
          {activeSection === "violations" && !isLoading && (
            <div className="bg-white rounded-xl shadow-md p-6">
              {selectedViolation ? (
                <div className="border border-gray-200 rounded-lg p-6 shadow-md animate-fade">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Violation Details (ID: {selectedViolation.id})
                    </h3>
                    <button
                      onClick={() => setSelectedViolation(null)}
                      className="text-gray-500 hover:text-gray-800 transition-colors"
                      aria-label="Close details"
                    >
                      <FaTimes size={20} />
                    </button>
                  </div>
                  <div className="space-y-6">
                    {imageUrls[selectedViolation.id] ? (
                      <img
                        src={imageUrls[selectedViolation.id]}
                        alt="Violation Capture"
                        className="w-full max-w-md mx-auto h-auto object-cover rounded-lg shadow-sm mb-4"
                        onError={(e) => {
                          console.error(
                            `Image load error for violation ${selectedViolation.id}`
                          );
                          e.target.src =
                            "https://via.placeholder.com/300x200?text=Image+Not+Available";
                        }}
                      />
                    ) : (
                      <div className="w-full max-w-md mx-auto h-48 flex items-center justify-center bg-gray-100 rounded-lg shadow-sm mb-4">
                        <p className="text-gray-500">No Image Available</p>
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-5">
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="text-gray-800 font-medium">
                          {new Date(
                            selectedViolation.date_detected
                          ).toLocaleString() || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Amount</p>
                        <p className="text-gray-800 font-semibold text-lg">
                          ₹{selectedViolation.fine_amount || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Violation Type</p>
                        <p className="text-gray-800">
                          {selectedViolation.violation_type || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Plate Number</p>
                        <p className="text-gray-800 font-medium">
                          {selectedViolation.plate_number || "N/A"}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <span
                          className={`inline-block text-sm px-3 py-1 rounded-full font-medium ${
                            selectedViolation.status === "pending"
                              ? "bg-red-100 text-red-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          {selectedViolation.status || "N/A"}
                        </span>
                      </div>
                    </div>
                    {selectedViolation.status === "pending" && (
                      <button
                        onClick={() => handlePayment(selectedViolation.id)}
                        className="w-full mt-4 bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-all duration-200 text-base font-medium"
                      >
                        Pay Now (₹{selectedViolation.fine_amount})
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedViolation(null)}
                      className="w-full mt-2 bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-300 transition-all duration-200 text-base"
                    >
                      Back to List
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                    Your Violations
                  </h2>
                  {violations.length > 0 ? (
                    <div className="space-y-4">
                      {violations.map((violation) => (
                        <div
                          key={violation.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-200 animate-fade-in"
                        >
                          <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 md:gap-4">
                            <div className="flex-grow">
                              <p className="text-sm text-gray-500">
                                {new Date(
                                  violation.date_detected
                                ).toLocaleString()}{" "}
                                - ID: {violation.id}
                              </p>
                              <p className="text-gray-800 font-medium mt-1">
                                {violation.violation_type} (
                                {violation.plate_number})
                              </p>
                            </div>
                            <div className="text-left md:text-right flex-shrink-0 mt-2 md:mt-0">
                              <p className="font-semibold text-gray-800 text-lg">
                                ₹{violation.fine_amount}
                              </p>
                              <span
                                className={`inline-block text-xs px-2 py-1 rounded-full font-medium mt-1 ${
                                  violation.status === "pending"
                                    ? "bg-red-100 text-red-600"
                                    : "bg-green-100 text-green-600"
                                }`}
                              >
                                {violation.status}
                              </span>
                            </div>
                          </div>
                          <div className="mt-4 flex flex-wrap gap-3">
                            <button
                              onClick={() => setSelectedViolation(violation)}
                              className="bg-[#007C5A] text-white px-4 py-2 text-sm rounded-lg hover:bg-[#005f44] transition-all duration-200"
                            >
                              View Details
                            </button>
                            {violation.status === "pending" && (
                              <button
                                onClick={() => handlePayment(violation.id)}
                                className="bg-indigo-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-indigo-700 transition-all duration-200"
                              >
                                Pay Now
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-10">
                      No violations found.
                    </p>
                  )}
                </>
              )}
            </div>
          )}
          {activeSection === "notifications" && !isLoading && (
            <div className="bg-white rounded-xl shadow-sm p-6 animate-fade">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Notifications
              </h2>
              {notifications.length > 0 ? (
                <div className="space-y-1">
                  {notifications.map((notification, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-all duration-200 rounded"
                    >
                      <FaBell
                        className={`mt-1 flex-shrink-0 ${
                          notification.includes("fine")
                            ? "text-red-500"
                            : notification.includes("payment")
                            ? "text-green-500"
                            : "text-yellow-500"
                        }`}
                        size={18}
                      />
                      <div className="flex-grow">
                        <p className="text-xs text-gray-500 mb-0.5">
                          {new Date().toLocaleString()}
                        </p>
                        <p className="text-gray-800 text-sm">{notification}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-10">
                  No new notifications.
                </p>
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default UserDashboard;
