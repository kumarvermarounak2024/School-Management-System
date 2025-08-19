const express = require('express');
const router = express.Router();
const controller = require('../controllers/Configuration/configurationController');

// Complaint Type
router.get('/complaint-types', controller.getAllComplaintTypes);
router.post('/complaint-types', controller.createComplaintType);
router.put('/complaint-types/:id', controller.updateComplaintType);
router.delete('/complaint-types/:id', controller.deleteComplaintType);

// Visiting Purpose
router.get('/visiting-purposes', controller.getAllVisitingPurposes);
router.post('/visiting-purposes', controller.createVisitingPurpose);
router.put('/visiting-purposes/:id', controller.updateVisitingPurpose);
router.delete('/visiting-purposes/:id', controller.deleteVisitingPurpose);

// Response
router.get('/responses', controller.getAllResponses);
router.post('/responses', controller.createResponse);
router.put('/responses/:id', controller.updateResponse);
router.delete('/responses/:id', controller.deleteResponse);

// Calling Purpose
router.get('/calling-purposes', controller.getAllCallingPurposes);
router.post('/calling-purposes', controller.createCallingPurpose);
router.put('/calling-purposes/:id', controller.updateCallingPurpose);
router.delete('/calling-purposes/:id', controller.deleteCallingPurpose);

// Reference
router.get('/references', controller.getAllReferences);
router.post('/references', controller.createReference);
router.put('/references/:id', controller.updateReference);
router.delete('/references/:id', controller.deleteReference);

module.exports = router;
