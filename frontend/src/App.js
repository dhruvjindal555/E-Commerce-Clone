import Navbar from "./Components/Home/Navbar";
import LogIn from "./Components/Auth/LogIn";
import SignUp from "./Components/Auth/SignUp";
import Contact from "./Components/User/Contact";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import Poster from "./Components/Home/Poster";
import BestOfClothings from "./Components/Home/BestOfClothings";
import BestofElectronics from "./Components/Home/BestOfElectronics";
import Products, { productsLoader } from "./Components/Products/Products";
import ProductPage, { productPageLoader } from "./Components/Products/ProductPage";
import HomeLayout from "./Layout/HomeLayout";
import AuthLayout from "./Layout/AuthLayout";
import Cart from "./Components/Cart/Cart";
import Footer from "./Components/Footer";
import VerifyOTP from "./Components/Auth/VerifyOTP";
import { ToastContainer } from 'react-toastify';
import ProfilePage from "./Components/User/ProfilePage";
import CartState from "./context/CartContext/CartState";
import AuthState from "./context/AuthContext/AuthState";
import OrderState from "./context/OrderContext/OrderState";
import LoadingState from "./context/LoadingContext/LoadingState";
import Error404 from "./Components/Error404";
import WishlistContext from "./context/WishlistContext/WishlistContext";
import WishlistState from "./context/WishlistContext/WishlistState";
import Dashboard from "./Components/Admin/Dashboard/Dashboard";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import WishlistManagement from "./Components/Admin/WishlistManagement"
import ProductManagement from "./Components/Admin/ProductManagement/ProductManagement"
import UserManagement from "./Components/Admin/UserManagement"
import ReviewManagement from "./Components/Admin/ReviewManagement"
import OrderManagement from "./Components/Admin/OrderManagement"
import ProductState from "./context/ProductContext/ProductState";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51OWKAVSDJ0AxOUCaBITPNU4CmAR0Uey5xYo8uPMoVGjwox5LGoWkds5eg3WIFhLrcIZpNGQCzn6NWrhbP2AClk3k00CLeANSVp'); // publishable key

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<HomeLayout />} >
        <Route index path="" element={<><Poster /><BestOfClothings /><BestofElectronics /></>} />
        <Route path="*" element={<Error404 />} />
        <Route path="cart" element={<Cart />} />
        <Route path="profilePage" element={<ProfilePage />} />
        <Route path=":mainCategory" element={<Products />} loader={productsLoader} />
        <Route path=":mainCategory/:subCategory" element={<Products />} loader={productsLoader} />
        <Route path=":mainCategory/:subCategory/:id" element={<ProductPage />} loader={productPageLoader} />
      </Route >
      {/* Routes with No Categories Layout */}
      <Route path="Contact" element={<><Navbar /><Contact /><Footer /></>} />
      <Route path="/admin" element={<AdminDashboard />}>
        {/* Default route */}
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="wishlist" element={<WishlistManagement />} />
        <Route path="products" element={<ProductManagement />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="reviews" element={<ReviewManagement />} />
        <Route path="orders" element={<OrderManagement />} />
      </Route>
      <Route path="auth" element={<AuthLayout />}>
        <Route path="login" element={<LogIn />} />
        <Route path="signup" element={<SignUp />} />
        <Route path="signup/verify" element={<VerifyOTP />} />
      </Route>
    </>
  )
)

function App() {
  return (
    <LoadingState>
      <AuthState>
        <WishlistState>
          <CartState>
            <ProductState>
              <OrderState>
                <Elements stripe={stripePromise}>
                  <ToastContainer
                    position="top-right"
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss={false}
                    draggable
                    pauseOnHover={false}
                    theme="dark"
                  />
                  <RouterProvider router={router} />
                </Elements>
              </OrderState>
            </ProductState>
          </CartState>
        </WishlistState>
      </AuthState>
    </LoadingState >
  );
}
export default App;