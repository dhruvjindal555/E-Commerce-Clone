import React, { useState } from "react";

const dummyUsers = [
  {
    id: 1,
    fullName: "John Doe",
    email: "john.doe@example.com",
    phoneNumber: "9876543210",
    lastLoginDate: "2024-02-10",
    profileUrl: "https://via.placeholder.com/50",
    address: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      pinCode: "10001",
      country: "USA",
    },
  },
  {
    id: 2,
    fullName: "Jane Smith",
    email: "jane.smith@example.com",
    phoneNumber: "9123456789",
    lastLoginDate: "2024-02-08",
    profileUrl: "https://via.placeholder.com/50",
    address: {
      street: "456 Elm St",
      city: "Los Angeles",
      state: "CA",
      pinCode: "90001",
      country: "USA",
    },
  },
];

const UserManagement = () => {
  const [users, setUsers] = useState(dummyUsers);
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

  const saveChanges = () => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => (user.id === selectedUser.id ? selectedUser : user))
    );
    closeModal();
  };

  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <div className="overflow-x-auto">
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
              <tr key={user.id} className="cursor-pointer hover:bg-gray-100">
                <td className="border p-2 text-center">
                  <img src={user.profileUrl} alt="Profile" className="w-10 h-10 rounded-full shadow-md" />
                </td>
                <td className="border p-2">{user.fullName}</td>
                <td className="border p-2">{user.email}</td>
                <td className="border p-2">{user.phoneNumber}</td>
                <td className="border p-2">{user.lastLoginDate}</td>
                <td className="border p-2">
                  <button className="bg-blue-600 text-white px-3 py-1 rounded shadow-md" onClick={() => openModal(user)}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-[80vw] max-w-4xl transform scale-105 flex flex-col">
            <h3 className="text-lg font-bold mb-4">Edit User</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold">Full Name</label>
                <input type="text" name="fullName" value={selectedUser.fullName} onChange={handleInputChange} className="w-full p-2 border rounded-lg shadow-sm" />
                <label className="block font-semibold">Email</label>
                <input type="email" name="email" value={selectedUser.email} onChange={handleInputChange} className="w-full p-2 border rounded-lg shadow-sm" />
                <label className="block font-semibold">Phone Number</label>
                <input type="text" name="phoneNumber" value={selectedUser.phoneNumber} onChange={handleInputChange} className="w-full p-2 border rounded-lg shadow-sm" />
              </div>
              <div>
                <h4 className="font-bold">Address</h4>
                <label className="block font-semibold">Street</label>
                <input type="text" name="street" value={selectedUser.address.street} onChange={handleAddressChange} className="w-full p-2 border rounded-lg shadow-sm" />
                <label className="block font-semibold">City</label>
                <input type="text" name="city" value={selectedUser.address.city} onChange={handleAddressChange} className="w-full p-2 border rounded-lg shadow-sm" />
                <label className="block font-semibold">State</label>
                <input type="text" name="state" value={selectedUser.address.state} onChange={handleAddressChange} className="w-full p-2 border rounded-lg shadow-sm" />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <button className="bg-gray-400 px-4 py-2 rounded shadow-md" onClick={closeModal}>Cancel</button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded shadow-md" onClick={saveChanges}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
