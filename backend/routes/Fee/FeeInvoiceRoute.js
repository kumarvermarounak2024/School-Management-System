const express = require("express");
const router = express.Router();
const {
  createFeeCollection,
  getAllFeeCollections,
  getFeeCollectionById,
  updateFeeCollection,
  updateStatusById, // Add the new import
  deleteFeeCollection,
} = require("../../controllers/Fee/FeeInvoiceController");

router.post("/create", createFeeCollection);
router.get("/getAll", getAllFeeCollections);
router.get("/getById/:id", getFeeCollectionById);
router.put("/update/:id", updateFeeCollection);
router.put("/updateStatus/:id", updateStatusById); // Add the new route
router.delete("/delete/:id", deleteFeeCollection);

module.exports = router;
