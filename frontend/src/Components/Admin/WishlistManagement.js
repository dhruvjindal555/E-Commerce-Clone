import React, { useContext, useEffect, useState } from "react";
import WishlistContext from "../../context/WishlistContext/WishlistContext";
import { toast } from "react-toastify";
import LoadingPage from "../LoadingPage";
import LoadingContext from "../../context/LoadingContext/LoadingContext";

const WishlistManagement = () => {
  // Dummy data based on the Wishlist schema

  const [wishlists, setWishlists] = useState([]);
  const { getAllWishlist } = useContext(WishlistContext)
  const {loading} = useContext(LoadingContext)
 
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const data = await getAllWishlist()
        setWishlists(data);
      } catch (error) {
        toast.error(error)
        console.error(error);
      }
    }
    fetchWishlist()
  }, [])
  if (loading) return <LoadingPage/>
  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        Wishlist Management
      </h2>

      {wishlists.length === 0 ? (
        <p className="text-gray-600">No wishlists found.</p>
      ) : (
        <>
          {/* Table View: Visible on medium and larger screens */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead className="bg-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                    User
                  </th>
                  <th className="text-left py-3 px-4 uppercase font-semibold text-sm">
                    Items
                  </th>
                 
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {wishlists.map((wishlist) => (
                  <tr
                    className="border-b hover:bg-gray-50"
                    key={wishlist._id}
                  >
                    <td className="py-4 px-4">
                      <div className="font-medium text-lg">
                        {wishlist.user.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {wishlist.user.email}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {wishlist.items && wishlist.items.length > 0 ? (
                        <ul className="list-disc pl-5">
                          {wishlist.items.map((item) => (
                            <li key={item._id}>
                              <span className="font-medium">{item.name}</span> - $
                              {item.price}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-500">No items added</span>
                      )}
                    </td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Card View: Visible on small screens */}
          <div className="block md:hidden space-y-4">
            {wishlists.map((wishlist) => (
              <div
                key={wishlist._id}
                className="bg-white shadow-md rounded-lg p-4"
              >
                <div className="mb-2">
                  <div className="font-medium text-xl">
                    {wishlist.user.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {wishlist.user.email}
                  </div>
                </div>
                <div className="mb-4">
                  {wishlist.items && wishlist.items.length > 0 ? (
                    <ul className="list-disc pl-5">
                      {wishlist.items.map((item) => (
                        <li key={item._id}>
                          <span className="font-medium">{item.name}</span> - $
                          {item.price}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-500">No items added</span>
                  )}
                </div>
                
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default WishlistManagement;
