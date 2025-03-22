import { FaUserCircle, FaEdit, FaLock, FaSignOutAlt } from "react-icons/fa";
import { useState } from "react";

const UserProfile = () => {
  const [user, setUser] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+1234567890",
  });

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <div className="flex items-center space-x-6 mb-6">
        <FaUserCircle className="text-6xl text-gray-700" />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-gray-600">{user.phone}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button className="flex items-center justify-center w-full p-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600">
          <FaEdit className="mr-2" /> Edit Profile
        </button>
        <button className="flex items-center justify-center w-full p-4 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600">
          <FaLock className="mr-2" /> Change Password
        </button>
        <button className="flex items-center justify-center w-full p-4 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600">
          <FaSignOutAlt className="mr-2" /> Logout
        </button>
      </div>
    </div>
  );
};

export default UserProfile;
