const express = require("express");
const cors = require("cors");
const authRouter = require("./router/authRoute");
const categoryRoute = require("./router/categoryRoute");
const productRoute = require("./router/productRoute");
const dbConnect = require("./config/connectDb");
const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
//conect db
dbConnect();
app.use(express.json());
//load routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/product", productRoute);

app.listen(9000);
