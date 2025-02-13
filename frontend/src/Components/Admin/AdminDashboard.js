import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";

function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    // Add your logout logic here (e.g., clearing tokens)
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 text-white transform transition-transform duration-200 ease-in-out 
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} xl:relative xl:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 text-2xl font-bold border-b border-gray-700">
            Admin Panel
            {/* Close button for mobile */}
            <button
              onClick={toggleSidebar}
              className="md:hidden text-gray-400 hover:text-white"
              aria-label="Close sidebar"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <nav className="flex-1 mt-6">
            {[
              { to: "dashboard", label: "Dashboard" },
              { to: "wishlist", label: "Wishlist Management" },
              { to: "products", label: "Product Management" },
              { to: "users", label: "User Management" },
              { to: "reviews", label: "Review Management" },
              { to: "orders", label: "Order Management" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="block py-2 px-4 hover:bg-gray-700 transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 rounded transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center bg-gray-800 text-white p-4">
          <button
            onClick={toggleSidebar}
            className="mr-4 focus:outline-none"
            aria-label="Toggle sidebar"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <h1 className="text-lg font-bold">Admin Dashboard</h1>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
