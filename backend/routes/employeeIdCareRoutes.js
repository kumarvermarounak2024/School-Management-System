const express = require("express");
const router = express.Router();
const {
  createIDCard,
  getFilteredIDCards,
  getAllIdCards,
  getAllEmployeeIdCards,
  getEmployeeIdCardById,

} = require("../controllers/ID_CardController/employeeIdCardController");

router.post("/create", createIDCard);
router.post("/filter", getFilteredIDCards);
router.get("/getAll", getAllIdCards); 
router.get("/getall", getAllEmployeeIdCards); 
router.get("/get/:id", getEmployeeIdCardById); 


module.exports = router;
