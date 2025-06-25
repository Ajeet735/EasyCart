import React, { useState } from "react";
import "./CheckoutSection.css";

const CheckoutSection = ({ cartItems, total }) => {
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const handlePlaceOrder = () => {
    if (!address) {
      alert("Please enter a shipping address.");
      return;
    }
    alert("Order placed successfully!");
    // Optional: Send data to backend here
  };

  return (
    <div className="checkout-section">
      <h2 style={{color:"#364153"}}>Checkout</h2>

      <label style={{color:"#364153"}}>Shipping Address:</label>
      <textarea
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter your delivery address"
      />

      <h3 style={{color:"#364153"}}>Order Summary</h3>
      <ul>
        {cartItems.map((item) => (
          <li key={item._id}>
            {item.product_name} × {item.quantity} = ${item.price * item.quantity}
          </li>
        ))}
      </ul>

      <h4 style={{color:"#364153"}}>Total: ${total}</h4>

      <label style={{color:"#364153"}}>Payment Method:</label>
      <select
        value={paymentMethod}
        onChange={(e) => setPaymentMethod(e.target.value)}
      >
        <option value="cod">Cash on Delivery</option>
        <option value="upi">UPI</option>
        <option value="card">Credit/Debit Card</option>
      </select>

      <button 
      className="orderbutton"
      onClick={handlePlaceOrder}>Place Order</button>
    </div>
  );
};

export default CheckoutSection;
