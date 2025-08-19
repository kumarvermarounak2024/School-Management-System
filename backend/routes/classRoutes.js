const express = require("express");
const router = express.Router();
const classController = require("../controllers/classController");

router.post("/create", classController.createClass);
router.get("/getAll", classController.getAllClasses);
router.get("/get:id", classController.getClassById);
router.put("/update/:id", classController.updateClass);
router.delete("/delete/:id", classController.deleteClass);

module.exports = router;
