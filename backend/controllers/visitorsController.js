const Visitor = require("../models/visitorsModel");

// Create a new visitor
exports.createVisitor = async (req, res) => {
  try {
    const newVisitor = await Visitor.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        visitor: newVisitor,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

// Get all visitors
exports.getAllVisitors = async (req, res) => {
  try {
    // Build query
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Visitor.find(JSON.parse(queryStr));

    // Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      query = query.select(fields);
    } else {
      query = query.select("-__v");
    }

    // Pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    // Execute query
    const visitors = await query;

    // Send response
    res.status(200).json({
      status: "success",
      results: visitors.length,
      data: {
        visitors,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

// Get a specific visitor
exports.getVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findById(req.params.id);

    if (!visitor) {
      return res.status(404).json({
        status: "fail",
        message: "No visitor found with that ID",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        visitor,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};

// Update a visitor
exports.updateVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!visitor) {
      return res.status(404).json({
        status: "fail",
        message: "No visitor found with that ID",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        visitor,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

// Delete a visitor
exports.deleteVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndDelete(req.params.id);

    if (!visitor) {
      return res.status(404).json({
        status: "fail",
        message: "No visitor found with that ID",
      });
    }

    res.status(204).json({
      status: "success",
      data: {},
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message,
    });
  }
};
