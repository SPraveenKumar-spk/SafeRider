import {
  FaUser,
  FaBell,
  FaMotorcycle,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useState } from "react";
import Logo from "../../assets/Logo.png";

const UserDashboard = () => {
  const [violations, setViolations] = useState([
    {
      id: 1,
      date: "2025-03-01",
      status: "Pending",
      amount: "$50",
      details:
        "Speeding violation in a school zone. Camera captured vehicle exceeding the speed limit by 15 mph.",
      image: "https://via.placeholder.com/300x200?text=Speeding+Violation",
    },
    {
      id: 2,
      date: "2025-02-25",
      status: "Paid",
      amount: "$30",
      details:
        "Parking violation - parked in a no-parking zone for 45 minutes.",
      image: "https://via.placeholder.com/300x200?text=Parking+Violation",
    },
  ]);

  const [notifications] = useState([
    {
      id: 1,
      date: "2025-03-07",
      message: "New violation recorded: Speeding in school zone.",
    },
    {
      id: 2,
      date: "2025-03-06",
      message: "Payment due reminder for violation ID 1.",
    },
    {
      id: 3,
      date: "2025-03-06",
      message: "Payment due reminder for violation ID 1.",
    },
    {
      id: 4,
      date: "2025-02-26",
      message: "Payment confirmed for violation ID 2.",
    },
    {
      id: 5,
      date: "2025-02-25",
      message: "New violation recorded: Parking violation.",
    },
  ]);

  const [userProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    licenseNumber: "ABC-12345",
    address: "123 Main St, Anytown, USA",
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("violations");
  const [selectedViolation, setSelectedViolation] = useState(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setSelectedViolation(null);
    setIsSidebarOpen(false);
  };

  const handlePayment = (violationId) => {
    alert(`Payment initiated for violation ID: ${violationId}`);
    setViolations((prev) =>
      prev.map((v) => (v.id === violationId ? { ...v, status: "Paid" } : v))
    );
    setSelectedViolation(null);
  };

  const handleLogout = () => {
    alert("Logging out...");
  };

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
                    : "text-gray-700 hover:bg-gray-50 hover:text-[#007C5A]"
                }`}
              >
                <Icon className="mr-3" /> {label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-6 overflow-y-auto h-[calc(100vh-4rem)]">
          {activeSection === "profile" && !selectedViolation && (
            <div className="bg-white rounded-xl shadow-md p-6 animate-fade">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Profile
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(userProfile).map(([key, value]) => (
                  <div key={key}>
                    <p className="text-sm text-gray-500 capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </p>
                    <p className="text-gray-800 font-medium">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "violations" && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Your Violations
              </h2>
              {!selectedViolation ? (
                <div className="space-y-4">
                  {violations.map((violation) => (
                    <div
                      key={violation.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-all duration-200"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-500">
                            {violation.date}
                          </p>
                          <p className="text-gray-800 font-medium">
                            {violation.details.substring(0, 50)}...
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-800">
                            {violation.amount}
                          </p>
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              violation.status === "Pending"
                                ? "bg-red-100 text-red-600"
                                : "bg-green-100 text-green-600"
                            }`}
                          >
                            {violation.status}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 flex md:gap-3 gap-2">
                        <div>
                          <button
                            onClick={() => setSelectedViolation(violation)}
                            className="bg-[#007C5A] text-white md:px-4 md:py-2 px-2 py-2 rounded-lg hover:bg-[#005f44] transition-all duration-200"
                          >
                            View Details
                          </button>
                        </div>
                        {violation.status === "Pending" && (
                          <div>
                            <button
                              onClick={() => handlePayment(violation.id)}
                              className="bg-indigo-600 text-white md:px-4 md:py-2 px-2 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-200"
                            >
                              Pay Now
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg p-6 shadow-md animate-fade">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Violation Details
                    </h3>
                    <button
                      onClick={() => setSelectedViolation(null)}
                      className="text-gray-500 hover:text-gray-800 transition-colors"
                    >
                      <FaTimes size={20} />
                    </button>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <img
                        src={selectedViolation.image}
                        alt="Violation Capture"
                        className="w-full h-48 object-cover rounded-lg shadow-sm"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="text-gray-800 font-medium">
                        {selectedViolation.date}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Details</p>
                      <p className="text-gray-800">
                        {selectedViolation.details}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Amount</p>
                      <p className="text-gray-800 font-semibold">
                        {selectedViolation.amount}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span
                        className={`text-sm px-3 py-1 rounded-full font-medium ${
                          selectedViolation.status === "Pending"
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {selectedViolation.status}
                      </span>
                    </div>
                    {selectedViolation.status === "Pending" && (
                      <button
                        onClick={() => handlePayment(selectedViolation.id)}
                        className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all duration-200"
                      >
                        Pay Now
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeSection === "notifications" && !selectedViolation && (
            <div className="bg-white rounded-xl shadow-sm p-6 animate-fade">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Notifications
              </h2>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-start gap-3 p-3 border-b border-gray-100 hover:bg-gray-50 transition-all duration-200"
                  >
                    <FaBell className="text-[#ff4f4f] mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">
                        {notification.date}
                      </p>
                      <p className="text-gray-800">{notification.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default UserDashboard;
