import express from "express";
import {
  getProfiles,
  searchProfiles,
} from "../controllers/profileController.js";

const router = express.Router();

router.get("/", getProfiles);
router.get("/search", searchProfiles);

export default router;
