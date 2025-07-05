import { useState } from "react";
import API from "../../api";
import "./AddProducts.css";

const AddProducts = () => {
  const [formData, setFormData] = useState({
    product_name: "",
    price: "",
    rating: "",
    image: "",
  });

    const InputChangeHandler = (e) => {
    const {name, value} = e.target
    setFormData((prev) => ({
    ...prev,
    [name] : value

    }))
};

  const SubmitHandler = async (e) => {
    e.preventDefault()
try {
 const response = await API.post("/admin/addproduct", formData)
  console.log(response.data)

  alert("Product added successfully!")
  setFormData({
    product_name: '',
    price: '',
    rating: '',
    image: '',
  })
} catch(err){
console.error(err);
alert("Failed to add products")
}

}


  return (
    <form onSubmit={SubmitHandler} className="add-product-form">
  <h2 className="form-title">Add New Products</h2>
  
  <input
    name="product_name"
    placeholder="Product Name"
    onChange={InputChangeHandler}
    value={formData.product_name}
    required
    className="form-input"
  />
  
  <input
    name="price"
    placeholder="Price"
    onChange={InputChangeHandler}
    value={formData.price}
    required
    className="form-input"
  />
  
  <input
    name="rating"
    placeholder="Rating"
    onChange={InputChangeHandler}
    value={formData.rating}
    required
    className="form-input"
  />
  
  <input
    name="image"
    placeholder="Image URL"
    onChange={InputChangeHandler}
    value={formData.image}
    required
    className="form-input"
  />

  <button type="submit" className="submit-button">Add Product</button>
</form>

  );
};

export default AddProducts;
