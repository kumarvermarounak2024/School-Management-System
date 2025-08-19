const express = require('express');
const router = express.Router();
const {
  createLedger,
  getAllLedgers,
  getLedgerById,
  updateLedger,
  deleteLedger
} = require('../../controllers/Accounting/ledgerController');

router.post('/create', createLedger);
router.get('/getAll', getAllLedgers);
router.get('/get/:id', getLedgerById);
router.put('/update/:id', updateLedger);
router.delete('/delete/:id', deleteLedger);

module.exports = router;
