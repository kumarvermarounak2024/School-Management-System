const express = require('express');
const router = express.Router();
const {
  CreateDesignation,
  GetDesignation,
  UpdateDesignation,
  DeleteDesignation
} = require('../controllers/designationController');

// Routes
router.post('/create', CreateDesignation);
router.get('/get', GetDesignation);
router.put('/update/:id', UpdateDesignation);
router.delete('/delete/:id', DeleteDesignation);

module.exports = router;
