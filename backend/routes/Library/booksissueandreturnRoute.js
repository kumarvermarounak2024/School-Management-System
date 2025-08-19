const express = require("express");
const router = express.Router();
const controller = require("../../controllers/Library/booksIssueAndReturnController");

router.post("/create", controller.createBookIssue);
router.get("/getAll", controller.getAllBookIssues);
router.get("/getById/:id", controller.getBookIssueById);
router.delete("/delete/:id", controller.deleteBookIssue);
router.put("/update/:id", controller.updateBookIssue);

module.exports = router;

