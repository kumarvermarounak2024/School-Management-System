const Enquiry = require("../models/Enquiry");

exports.getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find()
      .populate("assigned", "name role")
      .populate("classApplyingFor", "name") // specify fields if needed
      .populate("reference", "name")
      .populate("response", "name");

    res.status(200).json({
      success: true,
      count: enquiries.length,
      data: enquiries,
    });
  } catch (err) {
    console.error("Error fetching enquiries:", err); // log error
    res.status(500).json({
      success: false,
      error: err.message || "Server Error",
    });
  }
};


exports.getEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id)
      .populate("assigned", "name role")
      .populate("classApplyingFor")
      .populate("reference", "name")
      .populate("response", "name");

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        error: "Enquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      data: enquiry,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};


exports.createEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.create(req.body);

    res.status(201).json({
      success: true,
      data: enquiry,
    });
  } catch (err) {
    
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        error: messages,
      });
    } else {
      return res.status(500).json({
        success: false,
        error: "Server Error",
      });
    }
  }
};


exports.updateEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        error: "Enquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      data: enquiry,
    });
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        error: messages,
      });
    } else {
      return res.status(500).json({
        success: false,
        error: "Server Error",
      });
    }
  }
};


exports.deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        error: "Enquiry not found",
      });
    }

    await enquiry.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Server Error",
    });
  }
};
