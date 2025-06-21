import "./App.css";
import HomePage from "./Components/Pages/HomePage"
import AdminPanel from "./Components/Pages/AdminPanel";
import AdminRoute from "./Components/Routes/AdminRoutes";
import Layout from "./Components/Layout/Layout";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./Components/Authpage/Register";
import Login from "./Components/Authpage/Login";
import AddProducts from "./Components/ProductsView.js/AddProducts";
import GetAllProducts from "./Components/ProductsView.js/GetAllProducts";
import CartPage from "./Components/Pages/CartPage";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* For other routes, use layout */}
        <Route element={ <Layout />}>
                <Route path="/login" element={<Login/>} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
                <Route path="/admin/addproduct" element={<AddProducts />} />
                <Route path="/users/getallProducts" element={<GetAllProducts />} />
                <Route path="/cart" element = {<CartPage/>}/>   
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App