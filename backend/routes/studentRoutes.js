
const express = require("express");
const router = express.Router();
const {getStudents} = require("../controllers/studentController");

router.get("/get", getStudents);


module.exports = router;
