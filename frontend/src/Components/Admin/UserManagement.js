import React, { useContext, useEffect, useState } from "react";
import LoadingContext from "../../context/LoadingContext/LoadingContext";
import LoadingPage from "../LoadingPage";
import { toast } from "react-toastify";
import { FaUserCircle } from "react-icons/fa";
import AuthContext from "../../context/AuthContext/AuthContext";

const UserManagement = () => {
  const { loading, setLoading } = useContext(LoadingContext);
  const { updateUserByAdmin, deleteUserByAdmin } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const openModal = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser((prevUser) => ({
      ...prevUser,
      address: {
        ...prevUser.address,
        [name]: value,
      },
    }));
  };

  const saveChanges = async () => {
    try {
      console.log(selectedUser);
      const newUser = await updateUserByAdmin(selectedUser)
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user._id === selectedUser._id ? newUser.user : user))
      );
      closeModal();
      toast.success('User details updated successfully')
    } catch (error) {
      toast.error(error.message)
    }
  };

  const deleteUser = async (userId) => {
    try {
      await deleteUserByAdmin(userId);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      toast.success('User deleted successfully')
    } catch (error) {
      toast.error(error.message)
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  // console.log(filteredUsers);  


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:8888/user/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authToken: window.localStorage.getItem("authToken"),
          },
        });

        const data = await response.json();
        if (!response.ok) {
          setLoading(false);
          console.log(data);
          throw new Error("Failed to fetch users");
        }

        setLoading(false);
        setUsers(data.users);
        // console.log(data);        
        if (data.success) {
          return data.user;
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        toast.error(error);
        console.error("Error fetching user details:", error);
      }
    };
    fetchUsers();
  }, [setLoading]);

  if (loading) return <LoadingPage />;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">User Management</h2>
      <input
        type="text"
        placeholder="Search by name or email"
        className="w-full p-2 border mb-4 rounded shadow-sm"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Profile</th>
              <th className="border p-2">Full Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Phone Number</th>
              <th className="border p-2">Last Login</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id} className="hover:bg-gray-100">
                <td className="border p-2 text-center ">
                  {user.profileUrl ? (
                    <img
                      src={user.profileUrl}
                      alt="Profile"
                      className={`w-12 h-12 rounded-full shadow-md  ${user.role === 'admin' ? 'border-4 border-red-600' : ""}`}
                    />
                  ) : (
                    <FaUserCircle className={`text-gray-500 text-5xl ${user.role === 'admin' ? 'border-4 border-red-600 rounded-full' : ""}`} />
                  )}
                </td>
                <td className="border p-2">
                  {user.fullName ? user.fullName : "Not available"}
                </td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">
                  {user.phoneNumber ? user.phoneNumber : "Not available"}
                </td>
                <td className="border p-2">
                  {user.lastLoginDate
                    ? new Date(user.lastLoginDate).toLocaleString()
                    : "Not available"}
                </td>
                <td className="border p-2 flex gap-2 justify-center">
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded shadow-md"
                    onClick={() => openModal(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 text-white px-3 py-1 rounded shadow-md"
                    onClick={() => deleteUser(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card/List View */}
      <div className="md:hidden grid gap-4">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="bg-white shadow rounded p-4 flex flex-col gap-2"
          >
            <div className="flex items-center gap-4">
              {user.profileUrl ? (
                <img
                  src={user.profileUrl}
                  alt="Profile"
                  className="w-12 h-12 rounded-full shadow-md"
                />
              ) : (
                <FaUserCircle className="text-gray-500 text-5xl" />
              )}
              <div>
                <div className="font-bold">
                  {user.fullName ? user.fullName : "Not available"}
                </div>
                <div className="text-sm text-gray-500">{user.email}</div>
              </div>
            </div>
            <div className="text-sm">
              <span className="font-bold">Phone: </span>
              {user.phoneNumber ? user.phoneNumber : "Not available"}
            </div>
            <div className="text-sm">
              <span className="font-bold">Role: </span>
              {user.role ? String(user.role.split('').slice(0, 1).join('')).toLocaleUpperCase() + user.role.split('').slice(1).join('') : "Not available"}
            </div>
            <div className="text-sm">
              <span className="font-bold">Last Login: </span>
              {user.lastLoginDate
                ? new Date(user.lastLoginDate).toLocaleString()
                : "Not available"}
            </div>
            <div className="mt-2 flex gap-2 justify-end">
              <button
                onClick={() => openModal(user)}
                className="bg-blue-600 text-white px-3 py-1 rounded shadow-md"
              >
                Edit
              </button>
              <button
                onClick={() => deleteUser(user._id)}
                className="bg-red-600 text-white px-3 py-1 rounded shadow-md"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md md:max-w-2xl max-h-[90vh] overflow-y-auto">
            <header className="px-6 py-4 border-b sticky top-0 bg-white z-10">
              <h3 className="text-2xl font-semibold text-gray-800">Edit User</h3>
            </header>

            <main className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <section>
                <div className="mb-3">
                  <label
                    htmlFor="fullName"
                    className="block text-gray-700 text-sm font-bold mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={selectedUser.fullName}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="email"
                    className="block text-gray-700 text-sm font-bold mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={selectedUser.email}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="phoneNumber"
                    className="block text-gray-700 text-sm font-bold mb-1"
                  >
                    Phone Number
                  </label>
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={selectedUser.phoneNumber}
                    onChange={handleInputChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
              </section>

              <section>
                <h4 className="font-semibold text-gray-800 mb-2">Address</h4>
                <div className="mb-3">
                  <label
                    htmlFor="street"
                    className="block text-gray-700 text-sm font-bold mb-1"
                  >
                    Street
                  </label>
                  <input
                    type="text"
                    id="street"
                    name="street"
                    value={selectedUser.address.street}
                    onChange={handleAddressChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="city"
                    className="block text-gray-700 text-sm font-bold mb-1"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={selectedUser.address.city}
                    onChange={handleAddressChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="state"
                    className="block text-gray-700 text-sm font-bold mb-1"
                  >
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={selectedUser.address.state}
                    onChange={handleAddressChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="pinCode"
                    className="block text-gray-700 text-sm font-bold mb-1"
                  >
                    Pin Code
                  </label>
                  <input
                    type="text"
                    id="pinCode"
                    name="pinCode"
                    value={selectedUser.address.pinCode}
                    onChange={handleAddressChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="country"
                    className="block text-gray-700 text-sm font-bold mb-1"
                  >
                    Country
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={selectedUser.address.country}
                    onChange={handleAddressChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
              </section>
            </main>

            <footer className="px-6 py-4 bg-gray-50 flex justify-end items-center space-x-3 sticky bottom-0  z-10">
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={saveChanges}
              >
                Save Changes
              </button>
            </footer>
          </div>
        </div>
      )}

    </div>
  );
};

export default UserManagement;
