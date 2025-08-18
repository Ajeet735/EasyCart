🛒 EasyCart

A modern, full-stack e-commerce platform built with React.js (frontend), Go (backend), and MongoDB (database).
EasyCart provides a seamless shopping experience with features like product browsing, search, cart management, authentication, and order tracking.

🚀 Tech Stack
Frontend

⚛️ React.js – Fast and interactive UI

🎨 TailwindCSS / CSS Modules – Modern styling (customizable)

🔄 Axios – API requests

Backend

🐹 Go (Golang) – High-performance backend

🌐 Gin / Fiber (if used) – Web framework for routing & middleware

🔐 JWT Authentication – Secure user sessions

📦 RESTful APIs – For products, users, and orders

Database

🍃 MongoDB Atlas – Cloud database for scalability

🔍 Mongoose / Official Go Driver – ODM/driver for MongoDB

✨ Features

👤 User Authentication & Authorization (JWT-based login & signup)

🛍️ Product Management (list, search, filter, categories)

🛒 Shopping Cart & Checkout

💳 Order Management (track orders, payment status simulation)

🖼️ Product Details Page with related products

📱 Responsive Design for mobile & desktop

🛠️ Admin Panel (optional: manage products, categories, users)



⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/your-username/easycart.git
cd easycart

2️⃣ Backend (Go) Setup
cd backend
go mod tidy
go run main.go


The backend will start at http://localhost:5000

3️⃣ Frontend (React) Setup
cd frontend
npm install
npm start


The frontend will start at http://localhost:3000

4️⃣ Environment Variables

Create .env in backend:

MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/easycart
JWT_SECRET=your_jwt_secret
PORT=5000




🐳 Docker Support (Optional)
docker-compose up --build

👨‍💻 Author 
Ajeet Kumar – Full Stack Developer
