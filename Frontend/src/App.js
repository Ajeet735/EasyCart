import "./App.css";
import HomePage from "./Components/Pages/HomePage"
import AdminPanel from "./Components/Pages/AdminPanel";
import AdminRoute from "./Components/Routes/AdminRoutes";
import Layout from "./Components/Layout/Layout";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./Components/Authpage/Register";
import Login from "./Components/Authpage/Login";
import AddProducts from "./Components/ProductsView.js/AddProducts";

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
        <Route path="/register" element={<Register/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="admin/addproduct" element={<AddProducts/>} />
        <Route path="/" element={<HomePage/>} />
       <Route path="/admin" element={<AdminRoute> <AdminPanel /> </AdminRoute> } 
  />
      </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
