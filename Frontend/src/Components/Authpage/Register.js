import {useState } from "react";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { FaPencilAlt } from "react-icons/fa";
import { FaPhoneFlip } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa";
import {useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import "./Register.css";
import logo from "../../assets/logo/easycart.png";
import background from "../../assets/logo/Rwave.png";
import toplayer from "../../assets/logo/logo1.svg";
const Register = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    phone: "",
  });

  
  const [role, setRole] = useState("");
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const SubmitHandler = async (e) => {
    e.preventDefault();

    if ( !formData.first_name || !formData.last_name || !formData.email ||  !formData.password || !formData.phone || !role){
      toast.error("please fill all the field!")
      return
    }

    console.log(formData);
    try {

      const payload = {
        ...formData,
        role: role
      }
      const { data } = await axios.post("http://localhost:8000/users/signup",payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      toast.success(data); // assuming Go backend returns a plain string

      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        phone: "",
      });

      setRole('');
      navigate("/login");
    
    } catch (error) {
      toast.error(error?.response?.data?.error || "Registration failed");
    }
  };
  

  return (
    <section className="authPage"
    style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "contain",      // makes the whole image visible
      backgroundPosition: "right top",
        backgroundRepeat: "no-repeat"
        
      }}
    >
       <img src={toplayer} alt="Layer" className="topLayerImage" />
      <div className="auth-container">
        <div className="header">
          <img src= {logo}  alt="logo" />
          <h3>Create a new account</h3>
        </div>

        <form onSubmit={SubmitHandler}>

          <div className="inputTag">
            <label>Login As</label>
            <div>
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="">Select Role</option>
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
              <FaRegUser />
            </div>
          </div>
          {/* First Name */}
          <div className="inputTag">
            <label>First Name</label>
            <div>
              <input
                type="text"
                name="first_name"
                placeholder="Enter your first name"
                value={formData.first_name}
                onChange={handleChange}
              />
              <FaPencilAlt />
            </div>
          </div>

          {/* Last Name */}
          <div className="inputTag">
            <label>Last Name</label>
            <div>
              <input
                type="text"
                name="last_name"
                placeholder="Enter your last name"
                value={formData.last_name}
                onChange={handleChange}
              />
              <FaPencilAlt />
            </div>
          </div>

          {/* Email */}
          <div className="inputTag">
            <label>Email Address</label>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
              <MdOutlineMailOutline />
            </div>
          </div>

          {/* Phone */}
          <div className="inputTag">
            <label>Phone Number</label>
            <div>
              <input
                type="text"
                name="phone"
                placeholder="Enter your phone"
                value={formData.phone}
                onChange={handleChange}
              />
              <FaPhoneFlip />
            </div>
          </div>

          {/* Password */}
          <div className="inputTag">
            <label>Password</label>
            <div>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
              />
              <RiLock2Fill />
            </div>
          </div>
          <button type="submit">Register</button>
        </form>
      </div>
    </section>
  );
};

export default Register;
