const express = require("express");
const router = express.Router();
const {
  createStudentIdCart,
  getStudentIdCarts,
  // getFilteredStudents
} = require("../controllers/ID_CardController/studentidcardController");

router.post("/create", createStudentIdCart);
// router.post("/filtered", getFilteredStudents);
router.get("/getall", getStudentIdCarts);

module.exports = router;
