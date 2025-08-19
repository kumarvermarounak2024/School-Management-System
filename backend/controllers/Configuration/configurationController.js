const ComplaintType = require('../../models/Configuration/complaint_typeModel');
const VisitingPurpose = require('../../models/Configuration/visiting_purposeModel');
const Response = require('../../models/Configuration/responseModel');
const CallingPurpose = require('../../models/Configuration/calling_purposeModel');
const Reference = require('../../models/Configuration/referanceModel');



// 🔁 Generic functions for all models
const getAll = (Model) => async (req, res) => {
  try {
    const data = await Model.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const create = (Model) => async (req, res) => {
  try {
    const newDoc = new Model(req.body);
    const saved = await newDoc.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const update = (Model) => async (req, res) => {
  try {
    const updated = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Not found' });
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const remove = (Model) => async (req, res) => {
  try {
    const deleted = await Model.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllComplaintTypes: getAll(ComplaintType),
  createComplaintType: create(ComplaintType),
  updateComplaintType: update(ComplaintType),
  deleteComplaintType: remove(ComplaintType),

  getAllVisitingPurposes: getAll(VisitingPurpose),
  createVisitingPurpose: create(VisitingPurpose),
  updateVisitingPurpose: update(VisitingPurpose),
  deleteVisitingPurpose: remove(VisitingPurpose),

  getAllResponses: getAll(Response),
  createResponse: create(Response),
  updateResponse: update(Response),
  deleteResponse: remove(Response),

  getAllCallingPurposes: getAll(CallingPurpose),
  createCallingPurpose: create(CallingPurpose),
  updateCallingPurpose: update(CallingPurpose),
  deleteCallingPurpose: remove(CallingPurpose),

  getAllReferences: getAll(Reference),
  createReference: create(Reference),
  updateReference: update(Reference),
  deleteReference: remove(Reference),
};
