import { Router } from "express";

import Auth from "../controllers/authController.js";

import { authMiddleware } from "../utils/authMiddelware.js";
import { login } from "../controllers/userLoginController.js";
import { register } from "../controllers/userRegisterController.js";
import Sync from "../controllers/syncController.js";

const router = Router();



router.get("/", (req, res) => {
  res.send("welcome user");
});



// JWT AUTH

router.post("/register",register);

router.post("/login",login);



// GITHUB OAUTH

router.get("/auth/connect", Auth.connect);

router.get("/auth/callback", Auth.callback);



// PROTECTED ROUTE

router.get("/profile",authMiddleware,async (req, res) => {
    res.json({
      user: req.user,
    });
  }
);

router.get("/getRepo",Auth.getRepo)

router.post("/sync/github",Sync.syncRepo)


export default router;