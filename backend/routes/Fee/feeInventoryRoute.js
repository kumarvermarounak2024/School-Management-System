// const express = require("express");
// const router = express.Router();

// const {
//   createInvoiceEntry,
//   getAllInvoices,
//   getInvoiceById,
//   updateInvoiceById,
//   deleteInvoiceById,
// } = require("../../controllers/Fee/inventoryListController");

// router.post("/create", createInvoiceEntry);
// router.get("/getAll", getAllInvoices);
// router.get("/get/:id", getInvoiceById);
// router.put("/update/:id", updateInvoiceById);
// router.delete("/delete/:id", deleteInvoiceById);

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const inventoryController = require("../../controllers/Fee/inventoryListController");
// const {
//   // createInvoiceEntry,
//   getAllInvoices,
//   getInvoiceById,
//   updateInvoice,
//   deleteInvoice,
// } = inventoryController;


// // router.post("/create", createInvoiceEntry);
// router.get("/getAll", getAllInvoices);
// router.get("/get/:id", getInvoiceById);
// router.put("/update/:id", updateInvoice);     
// router.delete("/delete/:id", deleteInvoice);  


// module.exports = router;
const express = require('express');
const router = express.Router();
const {
  createInvoiceEntry,
  getAllInvoices,
  getInvoiceById,
  updateInvoice,
  deleteInvoice,
} = require('../../controllers/Fee/inventoryListController');

router.post('/create', createInvoiceEntry);
router.get('/getAll', getAllInvoices);
router.get('/getById/:id', getInvoiceById);
router.put('/update/:id', updateInvoice);
router.delete('/delete/:id', deleteInvoice);

module.exports = router;
