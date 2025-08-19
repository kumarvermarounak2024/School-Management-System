const express = require("express");
const router = express.Router();
const {
  createTeacherIdCard,
  getAllTeacherIdCards,
} = require("../controllers/teacherController");

router.post("/create", createTeacherIdCard);
router.get("/getall", getAllTeacherIdCards);

module.exports = router;
