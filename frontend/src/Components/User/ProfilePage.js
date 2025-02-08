import { useContext, useEffect, useState } from "react";
import { FaUserCircle, FaBoxOpen, FaCog, FaUpload, FaBars, FaTimes } from "react-icons/fa";
import OrderContext from "../../context/OrderContext/OrderContext";
import OrderDetails from "./OrderDetails";
import LoadingPage from "../LoadingPage";
import AuthContext from "../../context/AuthContext/AuthContext";
import { toast } from "react-toastify";
import LoadingContext from "../../context/LoadingContext/LoadingContext";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const { orders } = useContext(OrderContext);
  const { fetchUserDetails, updateUserDetails } = useContext(AuthContext);
  const { loading, setLoading} = useContext(LoadingContext);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    address: {
      street: '',
      city: '',
      state: '',
      pinCode: '',
      country: ''
    }
  });
  // Order filter state
  const [orderFilter, setOrderFilter] = useState({
    status: "all",
    year: "2025",
    month: "all", // Added month filter
  });

  // Sort state
  const [sortOrder, setSortOrder] = useState("des"); // Default sort order

  // Month options for the select dropdown
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: (i + 1).toString(),
    label: new Date(0, i).toLocaleString('en-US', { month: 'long' }),
  }));

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    const orderYear = orderDate.getFullYear().toString();
    const orderMonth = (orderDate.getMonth() + 1).toString(); // Months are 0-based in JS

    return (
      (orderFilter.status === "all" || order.orderStatus === orderFilter.status) &&
      orderYear === orderFilter.year &&
      (orderFilter.month === "all" || orderMonth === orderFilter.month)
    );
  });

  // Sort filtered orders
  const sortedOrders = filteredOrders.sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);

    return sortOrder === "des" ? dateB - dateA : dateA - dateB; // Ascending or descending sort
  });

  // Handle Profile Picture Upload
  const handleProfileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const profileFormData = new FormData();
    profileFormData.append('profileImage', file); // ✅ Matches Multer's expected field name

    try {
      setLoading(true);
      const response = await fetch('http://localhost:8888/user/upload-profile', {
        method: 'POST',
        headers: {
          'authToken': window.localStorage.getItem('authToken'), // 
        },
        body: profileFormData
      });
      setLoading(false);

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Upload failed');
      }

      console.log('Cloudinary Response:', responseData);
      // Now update user details with the Cloudinary URL
      const updatedUser = await updateUserDetails({
        ...formData,
        profileUrl: responseData.profileUrl // Use Cloudinary URL from backend
      });
      setProfileImage(URL.createObjectURL(file)); // ✅ Update state with the returned URL
      toast.success('Profile Photo Updated Successfully');
    } catch (error) {
      console.error('Error uploading profile:', error);
      toast.error(error.message);
    }
  };


  // Fetch user details on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await fetchUserDetails();
        console.log(userData);
        setFormData({
          fullName: userData.fullName,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          address: userData.address
        });
        setProfileImage(userData.profileUrl);
        console.log(userData);
      } catch (error) {
        toast.error('Failed to fetch user details');
        console.log(error);
      }
    };
    loadUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedUser = await updateUserDetails({ ...formData, profileUrl: profileImage }); // Update user details with profile image

      setFormData({
        fullName: updatedUser.user.fullName,
        email: updatedUser.user.email,
        phoneNumber: updatedUser.user.phoneNumber,
        address: updatedUser.user.address
      });

      toast.success('Successfully updated user details');
    } catch (error) {
      // Show the error message coming from the server
      toast.error(error.message);
      console.log('Validation Error:', error.message);
    }
  };

  if (loading) return <LoadingPage/>
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* Mobile Menu Toggle */}
      <button
        className="md:hidden flex items-center text-gray-700 mb-4"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Profile Section */}
      <div className="bg-white p-4 md:p-6 rounded-lg shadow-md flex flex-col md:flex-row items-center gap-4">
        <div className="relative">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border"
            />
          ) : (
            <FaUserCircle className="text-gray-500 text-6xl md:text-7xl" />
          )}
          <input type="file" className="hidden" id="profileUpload" onChange={handleProfileUpload} />
          <label
            htmlFor="profileUpload"
            className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer"
          >
            <FaUpload size={14} />
          </label>
        </div>
        <div className="text-center md:text-left">
          <h2 className="text-lg md:text-xl font-semibold">{formData.fullName}</h2>
          <p className="text-gray-600 text-sm md:text-base">{formData.email}</p>
        </div>
      </div>

      {/* Tabs Section (Responsive) */}
      <div className={`flex flex-col md:flex-row gap-4 mt-4 border-b pb-2 ${menuOpen ? "block" : "hidden md:flex"}`}>
        <button
          onClick={() => setActiveTab("orders")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md ${activeTab === "orders" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
        >
          <FaBoxOpen /> My Orders
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`flex items-center gap-2 px-4 py-2 rounded-md ${activeTab === "settings" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
        >
          <FaCog /> Account Settings
        </button>
      </div>

      {/* Content Section */}
      <div className="mt-4">
        {/* Orders Section */}
        {activeTab === "orders" && (
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className='w-full flex justify-between'>
              <h3 className="text-lg font-semibold">Recent Orders</h3>
              <div>
                <span className='w-fit mx-10'>
                  {`Showing ${sortedOrders.length} of ${orders.length} results`}
                </span>
              </div>
            </div>
            <div className="mt-4 flex flex-col md:flex-row gap-4">
              <ul className="md:w-3/4 order-1">
                {sortedOrders.length > 0 ? (
                  sortedOrders.map((order) => (
                    <OrderDetails order={order} key={order._id} />
                  ))
                ) : (
                  <p className="text-gray-500">No orders found.</p>
                )}
              </ul>

              {/* Filter Box */}
              <div className="md:w-1/4 bg-gray-100 p-3 rounded-md">
                <label className="block text-sm font-medium">Filter by Status</label>
                <select
                  className="w-full p-2 rounded-md border mt-1"
                  value={orderFilter.status}
                  onChange={(e) => setOrderFilter({ ...orderFilter, status: e.target.value })}
                >
                  <option value="all">All</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Pending">Pending</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <label className="block text-sm font-medium mt-3">Filter by Year</label>
                <select
                  className="w-full p-2 rounded-md border mt-1"
                  value={orderFilter.year}
                  onChange={(e) => setOrderFilter({ ...orderFilter, year: e.target.value })}
                >
                  <option value="2025">2025</option>
                  <option value="2024">2024</option>
                </select>

                {/* Add Month Filter */}
                <label className="block text-sm font-medium mt-3">Filter by Month</label>
                <select
                  className="w-full p-2 rounded-md border mt-1"
                  value={orderFilter.month}
                  onChange={(e) => setOrderFilter({ ...orderFilter, month: e.target.value })}
                >
                  <option value="all">All Months</option>
                  {months.map(month => (
                    <option key={month.value} value={month.value}>
                      {month.label}
                    </option>
                  ))}
                </select>

                {/* Sort By Feature */}
                <label className="block text-sm font-medium mt-3">Sort By</label>
                <select
                  className="w-full p-2 rounded-md border mt-1"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="asc">Date Ascending</option>
                  <option value="desc">Date Descending</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Account Settings Section */}
        {activeTab === "settings" && (
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Account Settings</h3>
            <form onSubmit={handleSubmit} className="mt-4 space-y-3">
              {Object.keys(formData).map((key) => {
                if (key !== 'address') {
                  return <div key={key} className="flex flex-col md:flex-row md:items-center justify-between">
                    <label className="text-gray-700 capitalize text-sm md:text-base">{key}</label>
                    <input
                      type="text"
                      className="border px-2 py-1 rounded-md text-sm md:text-base"
                      value={formData[key]}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    />
                  </div>
                }
                return (
                  <div key={key} className="space-y-3">
                    {formData.address && Object.keys(formData.address).map((key) => (
                      <div key={key} className="flex flex-col md:flex-row md:items-center justify-between">
                        <label className="text-gray-700 capitalize text-sm md:text-base">{key}</label>
                        <input
                          type="text"
                          className="border px-2 py-1 rounded-md text-sm md:text-base"
                          value={formData.address[key]}
                          onChange={(e) => setFormData({
                            ...formData, address: {
                              ...formData.address,
                              [key]: e.target.value
                            }
                          })}
                        />
                      </div>
                    ))}
                  </div>
                )
              })}
              <button type="submit" className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md">
                Update Details
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
