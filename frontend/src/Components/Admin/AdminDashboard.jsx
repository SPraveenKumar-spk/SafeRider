// /src/components/AdminDashboard.js
import { useState, useEffect } from "react";
import {
  FaCamera,
  FaClipboardList,
  FaUsers,
  FaChartBar,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaTrash,
} from "react-icons/fa";
import Logo from "../../assets/Logo.png";
import { useAuth } from "../../Store/Auth";

const AdminDashboard = () => {
  const { LogoutUser, access_token } = useAuth();
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    LogoutUser();
  };

  const handleTabChange = (tabId) => {
    setSelectedTab(tabId);
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="fixed top-0 left-0 w-full bg-white p-4 shadow-md z-50 flex items-center justify-between">
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
      <div className="flex pt-16">
        <aside
          className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40 md:static md:translate-x-0 ${
            isSidebarOpen
              ? "translate-x-0 top-16 h-[calc(100vh-4rem)]"
              : "-translate-x-full"
          }`}
        >
          <nav className="p-4 space-y-2">
            {[
              { id: "dashboard", label: "Dashboard", icon: FaChartBar },
              { id: "detection", label: "Live Detection", icon: FaCamera },
              { id: "violations", label: "Violations", icon: FaClipboardList },
              { id: "users", label: "User Management", icon: FaUsers },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-3 p-3 w-full text-left rounded-lg transition-all duration-200 ${
                  selectedTab === tab.id
                    ? "bg-[#007C5A] text-white font-semibold"
                    : "text-gray-700 hover:bg-gray-50 hover:text-[#007C5A]"
                }`}
              >
                <tab.icon className="text-lg" />
                {tab.label}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 p-3 w-full text-left rounded-lg transition-all duration-200 text-gray-700 hover:bg-gray-50 hover:text-[#007C5A]"
            >
              <FaSignOutAlt className="text-lg" />
              Logout
            </button>
          </nav>
        </aside>
        <main className="flex-1 p-4 md:p-6 overflow-y-auto h-[calc(100vh-4rem)]">
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
            {selectedTab === "dashboard" && (
              <Dashboard access_token={access_token} />
            )}
            {selectedTab === "detection" && <LiveDetection />}
            {selectedTab === "violations" && (
              <Violations access_token={access_token} />
            )}
            {selectedTab === "users" && (
              <UserManagement access_token={access_token} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

const Dashboard = ({ access_token }) => {
  const { baseURL } = useAuth();
  const [stats, setStats] = useState({
    total_violations: 0,
    fines_paid: 0,
    pending_cases: 0,
  });

  useEffect(() => {
    fetch(`${baseURL}/dashboard`, {
      headers: { Authorization: `Bearer ${access_token}` },
    })
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error("Error fetching stats:", err));
  }, [access_token]);

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">
        Admin Overview
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(stats).map(([key, value], index) => (
          <div
            key={index}
            className="bg-[#007C5A] text-white p-4 rounded-lg text-center shadow-md hover:shadow-lg transition-all duration-200"
          >
            <h3 className="text-base md:text-lg font-semibold">
              {key.replace("_", " ").toUpperCase()}
            </h3>
            <p className="text-xl md:text-2xl mt-2">{value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const LiveDetection = ({ access_token }) => {
  const { baseURL } = useAuth();
  const [selectedImage, setSelectedImage] = useState(null);
  const [detectionResult, setDetectionResult] = useState(null);

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedImage) return;

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const res = await fetch(`${baseURL}/detect`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        body: formData,
      });

      if (res.ok) {
        const result = await res.json();
        setDetectionResult(result);
      } else {
        console.error("Error during detection");
      }
    } catch (err) {
      console.error("Error uploading image:", err);
    }
  };

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">
        Upload Image for Detection
      </h2>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        className="bg-[#007C5A] text-white px-4 py-2 rounded-lg hover:bg-[#005a40] transition-all duration-200"
      >
        Upload & Detect
      </button>

      {detectionResult && (
        <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Detection Result
          </h3>
          <p>
            <strong>Plate Number:</strong> {detectionResult.plate_number}
          </p>
          <p>
            <strong>Violation:</strong>{" "}
            {detectionResult.violation_detected ? "Yes" : "No"}
          </p>
          {detectionResult.violation_detected && (
            <p className="text-red-600">
              <strong>Fine Amount:</strong> ₹{detectionResult.fine_amount}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const Violations = ({ access_token }) => {
  const { baseURL } = useAuth();
  const [violations, setViolations] = useState([]);

  useEffect(() => {
    fetch(`${baseURL}/violations`, {
      headers: { Authorization: `Bearer ${access_token}` },
    })
      .then((res) => res.json())
      .then((data) => setViolations(data.violations))
      .catch((err) => console.error("Error fetching violations:", err));
  }, [access_token]);

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">
        Violation Records
      </h2>
      <ul className="space-y-4">
        {violations.map((violation) => (
          <li
            key={violation.id}
            className="p-4 bg-gray-50 rounded-lg shadow-sm"
          >
            <p>
              <strong>Plate Number:</strong> {violation.plate_number}
            </p>
            <p>
              <strong>Violation Type:</strong> {violation.violation_type}
            </p>
            <p>
              <strong>Fine Amount:</strong> ₹{violation.fine_amount}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`${
                  violation.status === "paid"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {violation.status}
              </span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

const UserManagement = ({ access_token }) => {
  const { baseURL } = useAuth();
  const [users, setUsers] = useState([]);

  const fetchUsers = () => {
    fetch(`${baseURL}/users`, {
      headers: { Authorization: `Bearer ${access_token}` },
    })
      .then((res) => res.json())
      .then((data) => setUsers(data.users))
      .catch((err) => console.error("Error fetching users:", err));
  };

  useEffect(() => {
    fetchUsers();
  }, [access_token]);

  const deleteUser = (id) => {
    fetch(`${baseURL}/user/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${access_token}` },
    })
      .then(() => fetchUsers())
      .catch((err) => console.error("Error deleting user:", err));
  };

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">
        User Management
      </h2>
      <ul className="space-y-4">
        {users.map((user) => (
          <li
            key={user.id}
            className="flex justify-between items-center p-4 bg-gray-50 rounded-lg shadow-sm"
          >
            <div>
              <p>
                <strong>Name:</strong> {user.username}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Role:</strong> {user.role}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => deleteUser(user.id)}
                className="text-red-600 hover:text-red-800"
              >
                <FaTrash />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
