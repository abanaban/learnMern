import express, { json } from "express";
import  {test, updateUser} from "../controllers/user.controller.js";
import { verifyToken } from "../verifyUser.js";

const router = express.Router();

router.get("/test", test);
router.post('/update/:id',verifyToken, updateUser)
export default router;
