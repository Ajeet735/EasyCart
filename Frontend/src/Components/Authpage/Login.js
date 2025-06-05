import { useContext, useState } from "react";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { Context } from "../../main";
import "../../App.css";
import "./Login.css";

const Login = () => {
  const [formData, setFormdata] = useState({
    email: "",
    password: "",
  });
  const {  setIsAuthorized,setUser } = useContext(Context);
  const navigate = useNavigate()

  const inputHandler = (e) => {
    const { name, value } = e.target;
    setFormdata((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const SubmitLogin = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post(
      "http://localhost:8000/users/login",
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    const userData = response.data;

    toast.success(`Welcome ${userData.first_name || "User"}`);

    setFormdata({ email: "", password: "" });

    setIsAuthorized(true);
    setUser(userData);
    
    navigate("/"); // ✅ navigate to home
  } catch (error) {
    console.error("Login failed:", error);
    toast.error(error?.response?.data?.error || "Login failed");
  }
};

  return (
    <section className="authPage">
      <div className="container">
        <div className="header">
          <img src="/careerconnect-Black.png" alt="logo" />
          <h3>Login to your account</h3>
        </div>

        <form onSubmit={SubmitLogin}>
          
          <div className="inputTag">
            <label>Email Address</label>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={inputHandler}
                required
              />
              <MdOutlineMailOutline />
            </div>
          </div>

          <div className="inputTag">
            <label>Password</label>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={inputHandler}
                required
              />
              <RiLock2Fill />
            </div>
          </div>

          <button type="submit">Login</button>
        </form>
      </div>

      <div className="banner">
        <img src="/login.png" alt="login" />
      </div>
    </section>
  );
};

export default Login;
