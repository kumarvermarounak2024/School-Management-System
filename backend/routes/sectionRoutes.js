const express = require("express");
const router = express.Router();
const sectionController = require("../controllers/sectionController");

router.post("/create", sectionController.createSection);
router.get("/getAll", sectionController.getAllSections);
router.get("/get/:id", sectionController.getSectionById);
router.put("/update/:id", sectionController.updateSection);
router.delete("/delete/:id", sectionController.deleteSection);

module.exports = router;
