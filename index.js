
import "dotenv/config";
import express from "express";
import { sequelize } from "./models/index.js";
import router from "./routes/authRoute.js";

const app = express();

app.use(express.json());
app.use(router)

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database synced");

    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  })
  .catch((err) => {
    console.error(err);
  });