// const express = require("express");
// const router = express.Router();

// const {
//   createEmployee,
//   getAllEmployees,
//   getEmployeeById,
//   updateEmployee,
//   deleteEmployee,
// } = require("../controllers/employeeController");

// router.post('/create', createEmployee);
// router.get("/get", getAllEmployees);
// router.get("/get/:id", getEmployeeById);
// router.put("/update/:id", updateEmployee);
// router.delete("/delete/:id", deleteEmployee);

// module.exports = router;

const express = require("express");
const router = express.Router();
const {
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployeeById,
  getEmployees,
} = require("../controllers/employeeController");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  "/create",
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "documents", maxCount: 10 },
  ]),
  createEmployee
);
router.put(
  "/update/:id",
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "documents", maxCount: 10 },
  ]),
  updateEmployee
);
router.delete("/delete/:id", deleteEmployee);
router.get("/get/:id", getEmployeeById);
router.get("/get", getEmployees);

module.exports = router;
