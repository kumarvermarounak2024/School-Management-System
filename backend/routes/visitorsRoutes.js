const express = require("express");
const {
  createVisitor,
  getAllVisitors,
  getVisitor,
  updateVisitor,
  deleteVisitor,
} = require("../controllers/visitorsController");

const router = express.Router();

router.route("/createVisitors").post(createVisitor);
router.route("/getAllVisitors").get(getAllVisitors);
router.route("/getVisitorsById/:id").get(getVisitor);
router.route("/updateVisitorsById/:id").patch(updateVisitor);
router.route("/deleteVisitorsById/:id").delete(deleteVisitor);

module.exports = router;
