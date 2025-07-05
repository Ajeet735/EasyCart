import "./App.css";
import HomePage from "./Components/Pages/HomePage";
import AdminPanel from "./Components/Pages/AdminPanel";
import AdminRoute from "./Components/Routes/AdminRoutes";
import Layout from "./Components/Layout/Layout";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./Components/Authpage/Register";
import Login from "./Components/Authpage/Login";
import AddProducts from "./Components/ProductsView/AddProducts";
import GetAllProducts from "./Components/ProductsView/GetAllProducts";
import CartPage from "./Components/Pages/CartPage";
import ProductDetails from "./Components/ProductsView/ProductsDetails";
import CategoryProducts from "./Components/ProductsView/CategoryProducts";
import ProductSearch from "./Components/ProductsView/ProductSearch";

// ✅ Import Toaster
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      {/* ✅ Mount toast handler once */}
      <Toaster position="top-center" reverseOrder={false} />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/home" element={<HomePage />} />
            <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
            <Route path="/admin/addproduct" element={<AddProducts />} />
            <Route path="/users/getallProducts" element={<GetAllProducts />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/category/:category" element={<CategoryProducts />} />
            <Route path="/search" element={<ProductSearch />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
