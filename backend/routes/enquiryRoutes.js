const express = require("express");
const router = express.Router();
const {
  getEnquiries,
  getEnquiry,
  createEnquiry,
  updateEnquiry,
  deleteEnquiry,
} = require("../controllers/enquiryControllers");


router.route("/createEnquiry").post(createEnquiry);
router.route("/getEnquiry").get(getEnquiries);
router.route("/getEnquiryById/:id").get(getEnquiry);
router.route("/updateEnquiryById/:id").put(updateEnquiry);
router.route("/deleteEnquiryById/:id").delete(deleteEnquiry);


module.exports = router;
