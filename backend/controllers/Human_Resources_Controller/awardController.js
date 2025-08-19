const Award = require("../../models/Human_Resources_Model/awardModel");

// Create a new award
exports.createAward = async (req, res) => {
  try {
    const {
      role,
      winner,
      awardName,
      giftItem,
      cashPrice,
      awardReason,
      givenDate
    } = req.body;

    // Basic validation
    if (!role || !winner || !awardName || !giftItem || !awardReason || !givenDate) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    // Convert givenDate to Date object
    const givenDateObj = new Date(givenDate);
    if (isNaN(givenDateObj)) {
      return res.status(400).json({ message: 'Invalid date format for givenDate' });
    }

    const newAward = new Award({
      role,
      winner,
      awardName,
      giftItem,
      cashPrice,
      awardReason,
      givenDate: givenDateObj
    });

    const savedAward = await newAward.save();
    res.status(201).json(savedAward);
  } catch (error) {
    res.status(500).json({ message: 'Error creating award', error: error.message });
  }
};

// Get all awards
exports.getAllAwards = async (req, res) => {
  try {
    const awards = await Award.find().sort({ createdAt: -1 });
    res.status(200).json(awards);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching awards', error: error.message });
  }
};
// single delette by id 
// Delete award by ID
exports.deleteAwardById = async (req, res) => {
  try {
    const awardId = req.params.id;

    const deletedAward = await Award.findByIdAndDelete(awardId);

    if (!deletedAward) {
      return res.status(404).json({ message: 'Award not found' });
    }

    res.status(200).json({ message: 'Award deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting award', error: error.message });
  }
};

// Update award by ID
exports.updateAward = async (req, res) => {
  try {
    const awardId = req.params.id;
    const {
      role,
      winner,
      awardName,
      giftItem,
      cashPrice,
      awardReason,
      givenDate
    } = req.body;

    // Basic validation
    if (!role || !winner || !awardName || !giftItem || !awardReason || !givenDate) {
      return res.status(400).json({ message: 'All required fields must be filled' });
    }

    const updatedAward = await Award.findByIdAndUpdate(
      awardId,
      {
        role,
        winner,
        awardName,
        giftItem,
        cashPrice,
        awardReason,
        givenDate: new Date(givenDate)
      },
      { new: true }
    );

    if (!updatedAward) {
      return res.status(404).json({ message: 'Award not found' });
    }

    res.status(200).json(updatedAward);
  } catch (error) {
    res.status(500).json({ message: 'Error updating award', error: error.message });
  }
};


// Delete all awards
exports.deleteAllAwards = async (req, res) => {
  try {
    await Award.deleteMany({});
    res.status(200).json({ message: "All awards deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting awards", error });
  }
};