const express = require("express");
const router = express.Router();
const {
  createStudentIdCard,
  getStudentIdCards
} = require("../../controllers/Certificate/studentIdCardController");

router.post("/create", createStudentIdCard);
router.get("/getAll", getStudentIdCards);

module.exports = router;