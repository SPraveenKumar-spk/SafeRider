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
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import Logo from "../../assets/Logo.png";
import { useAuth } from "../../Store/Auth";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { LogoutUser, access_token } = useAuth();
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    console.log("Logging out admin");
    LogoutUser();
    navigate("/logout");
  };

  const handleTabChange = (tabId) => {
    console.log("Switching to tab:", tabId);
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
      <div className="flex pt-20">
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
            {selectedTab === "detection" && (
              <LiveDetection access_token={access_token} />
            )}
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
    recent_violations: [],
  });

  useEffect(() => {
    fetch(`${baseURL}/api/admin/dashboard`, {
      headers: { Authorization: `Bearer ${access_token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Dashboard data:", data);
        setStats(data);
      })
      .catch((err) => console.error("Error fetching stats:", err));
  }, [access_token, baseURL]);

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">
        Admin Overview
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {Object.entries({
          total_violations: stats.total_violations,
          fines_paid: stats.fines_paid,
          pending_cases: stats.pending_cases,
        }).map(([key, value], index) => (
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
      <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
        Recent Violations
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-sm font-semibold">Plate Number</th>
              <th className="p-3 text-sm font-semibold">Violation Type</th>
              <th className="p-3 text-sm font-semibold">Fine Amount</th>
              <th className="p-3 text-sm font-semibold">Status</th>
              <th className="p-3 text-sm font-semibold">Date</th>
            </tr>
          </thead>
          <tbody>
            {stats.recent_violations.map((violation) => (
              <tr key={violation.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{violation.plate_number}</td>
                <td className="p-3">{violation.violation_type}</td>
                <td className="p-3">₹{violation.fine_amount}</td>
                <td className="p-3">
                  <span
                    className={`${
                      violation.status === "paid"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {violation.status}
                  </span>
                </td>
                <td className="p-3">
                  {new Date(violation.date_detected).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const LiveDetection = ({ access_token }) => {
  const { baseURL, LogoutUser } = useAuth();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  const [detectionResult, setDetectionResult] = useState(null);
  const [error, setError] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log(
        `Selected file: ${file.name}, type: ${file.type}, size: ${file.size}`
      );
      const validTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!validTypes.includes(file.type)) {
        setError("Please upload a PNG or JPEG image");
        setSelectedImage(null);
        setImageUrl(null);
        return;
      }
      setError(null);
      setSelectedImage(file);
      setImageUrl(URL.createObjectURL(file)); // Preview uploaded image
    }
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      setError("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);
    console.log("Uploading image:", selectedImage.name);

    try {
      const res = await fetch(`${baseURL}/api/admin/detections`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        body: formData,
      });

      console.log(`Detection response status: ${res.status}`);
      let data;
      try {
        data = await res.json();
        console.log("Detection response:", data);
      } catch (jsonError) {
        console.error("Failed to parse JSON:", jsonError);
        const responseText = await res.text();
        console.log("Raw response:", responseText);
        throw new Error(`Invalid server response: ${responseText}`);
      }

      if (res.ok) {
        setDetectionResult(data);
        setError(null);
        // Fetch the processed image
        const detectionId = data.detection.id;
        console.log(
          "Fetching image from:",
          `${baseURL}/admin/detection-image/${detectionId}`
        );
        const imageResponse = await fetch(
          `${baseURL}/api/admin/detection-image/${detectionId}`,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
        if (imageResponse.ok) {
          const blob = await imageResponse.blob();
          const url = URL.createObjectURL(blob);
          setImageUrl(url);
          console.log("Image URL set:", url);
        } else {
          console.error("Image fetch failed:", imageResponse.status);
          setError(
            `Failed to load detection image (status ${imageResponse.status})`
          );
        }
      } else {
        console.error(
          "Detection error:",
          data.error || data.msg || "Unknown error"
        );
        if (res.status === 401) {
          setError("Authentication failed. Logging out...");
          LogoutUser();
          navigate("/login");
        } else if (res.status === 422) {
          setError(data.error || "Invalid image format or processing error");
        } else {
          setError(data.error || data.msg || "Detection failed");
        }
      }
    } catch (err) {
      console.error("Error uploading image:", err.message);
      setError(err.message || "Failed to upload image. Please try again.");
    }
  };

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">
        Upload Image for Detection
      </h2>
      <input
        type="file"
        accept="image/png,image/jpeg,image/jpg"
        onChange={handleImageChange}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        className="bg-[#007C5A] text-white px-4 py-2 rounded-lg hover:bg-[#005a40] transition-all duration-200"
        disabled={!selectedImage}
      >
        Upload & Detect
      </button>
      {error && <p className="mt-4 text-red-600">{error}</p>}
      {imageUrl && (
        <div className="mt-4">
          <strong>Preview:</strong>
          <img
            src={imageUrl}
            alt="Detection Preview"
            className="mt-2 max-w-full h-auto rounded"
            onError={(e) => {
              console.error("Image load error:", e);
              setError("Failed to display image");
              e.target.src =
                "https://via.placeholder.com/300x200?text=Image+Not+Available";
            }}
          />
        </div>
      )}
      {detectionResult && (
        <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            Detection Result
          </h3>
          <p>
            <strong>Plate Number:</strong> {detectionResult.plate_number}
          </p>
          <p>
            <strong>Helmet Detected:</strong>{" "}
            {detectionResult.helmet_detected ? "Yes" : "No"}
          </p>
          <p>
            <strong>Confidence:</strong>{" "}
            {(detectionResult.confidence * 100).toFixed(2)}%
          </p>
          {!detectionResult.helmet_detected && (
            <p className="text-red-600">
              <strong>Fine Amount:</strong> ₹100
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
  const [imageUrls, setImageUrls] = useState({});

  useEffect(() => {
    fetch(`${baseURL}/api/admin/violations`, {
      headers: { Authorization: `Bearer ${access_token}` },
    })
      .then((res) => res.json())
      .then(async (data) => {
        console.log("Violations data:", data);
        setViolations(data.violations || []);
        const urls = {};
        for (const violation of data.violations || []) {
          try {
            console.log(
              "Fetching violation image:",
              `${baseURL}/admin/detection-image/${violation.id}`
            );
            const imageResponse = await fetch(
              `${baseURL}/api/admin/detection-image/${violation.id}`,
              {
                headers: { Authorization: `Bearer ${access_token}` },
              }
            );
            if (imageResponse.ok) {
              const blob = await imageResponse.blob();
              urls[violation.id] = URL.createObjectURL(blob);
              console.log(`Image URL set for violation ${violation.id}`);
            } else {
              console.error(
                `Failed to fetch image for violation ${violation.id}: ${imageResponse.status}`
              );
            }
          } catch (err) {
            console.error(
              `Error fetching image for violation ${violation.id}:`,
              err
            );
          }
        }
        setImageUrls(urls);
      })
      .catch((err) => console.error("Error fetching violations:", err));
  }, [access_token, baseURL]);

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">
        Violation Records
      </h2>
      <div className="space-y-4">
        {violations.length > 0 ? (
          violations.map((violation) => (
            <div
              key={violation.id}
              className="p-4 bg-gray-50 rounded-lg shadow-sm"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
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
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(violation.date_detected).toLocaleString()}
                  </p>
                </div>
                {imageUrls[violation.id] ? (
                  <div>
                    <strong>Image:</strong>
                    <img
                      src={imageUrls[violation.id]}
                      alt={`Violation ${violation.id}`}
                      className="mt-2 max-w-full h-auto rounded"
                      onError={(e) => {
                        console.error(
                          `Image load error for violation ${violation.id}`
                        );
                        e.target.src =
                          "https://via.placeholder.com/300x200?text=Image+Not+Available";
                      }}
                    />
                  </div>
                ) : (
                  <p className="text-gray-600">No image available</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No violations found.</p>
        )}
      </div>
    </div>
  );
};

const UserManagement = ({ access_token }) => {
  const { baseURL } = useAuth();
  const [users, setUsers] = useState([]);
  const [expandedUser, setExpandedUser] = useState(null);

  const fetchUsers = () => {
    fetch(`${baseURL}/api/admin/violated-users`, {
      headers: { Authorization: `Bearer ${access_token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Violated users data:", data);
        setUsers(data.users || []);
      })
      .catch((err) => console.error("Error fetching users:", err));
  };

  useEffect(() => {
    fetchUsers();
  }, [access_token, baseURL]);

  const deleteUser = (id) => {
    fetch(`${baseURL}/api/admin/user/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${access_token}` },
    })
      .then(() => fetchUsers())
      .catch((err) => console.error("Error deleting user:", err));
  };

  const toggleViolations = (userId) => {
    setExpandedUser(expandedUser === userId ? null : userId);
  };

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">
        User Management
      </h2>
      <div className="space-y-4">
        {users.length > 0 ? (
          users.map((user) => (
            <div key={user.id} className="p-4 bg-gray-50 rounded-lg shadow-sm">
              <div className="flex justify-between items-center">
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
                <div className="flex gap-2 items-center">
                  <button
                    onClick={() => toggleViolations(user.id)}
                    className="text-[#007C5A] hover:text-[#005a40]"
                  >
                    {expandedUser === user.id ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </button>
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              {expandedUser === user.id && (
                <div className="mt-4">
                  <h4 className="text-md font-semibold text-gray-700 mb-2">
                    Violations
                  </h4>
                  {user.violations.length > 0 ? (
                    <ul className="space-y-2">
                      {user.violations.map((violation) => (
                        <li
                          key={violation.id}
                          className="p-2 bg-gray-100 rounded"
                        >
                          <p>
                            <strong>Plate Number:</strong>{" "}
                            {violation.plate_number}
                          </p>
                          <p>
                            <strong>Violation Type:</strong>{" "}
                            {violation.violation_type}
                          </p>
                          <p>
                            <strong>Fine Amount:</strong> ₹
                            {violation.fine_amount}
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
                          <p>
                            <strong>Date:</strong>{" "}
                            {new Date(violation.date_detected).toLocaleString()}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-600">No violations found.</p>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-600">No users found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
