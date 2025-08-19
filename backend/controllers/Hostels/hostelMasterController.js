const Hotel = require('../../models/Hostel/Hostel_masterModel');

//============ Hotel Master Controller ============
exports.createHotel = async (req, res) => {
  try {
    console.log("Creating hotel with data:", req.body);  
    const HostelMaster = req.body;
    const newHostel = new Hotel(HostelMaster);
    await newHostel.save();
    res.status(201).json({
      message: "Hotel created successfully",
      data: newHostel,
    });
  } catch (error) {
    console.error("Error creating hotel:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//============ Get All Hotels ============
exports.getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.status(200).json({
      message: "Hotels retrieved successfully",
      data: hotels,
    });
  } catch (error) {
    console.error("Error retrieving hotels:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//============ Get Hotel by ID ============
exports.getHotelById = async (req, res) => {
  try {
    const hotelId = req.params.id;
    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    res.status(200).json({
      message: "Hotel retrieved successfully",
      data: hotel,
    });
  } catch (error) {
    console.error("Error retrieving hotel:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//============ Update Hotel by ID ============
exports.updateHotelById = async (req, res) => {
  try {
    const hotelId = req.params.id;
    const updatedData = req.body;
    const updatedHotel = await Hotel.findByIdAndUpdate(hotelId, updatedData, {
      new: true,
    });
    if (!updatedHotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    res.status(200).json({
      message: "Hotel updated successfully",
      data: updatedHotel,
    });
  } catch (error) {
    console.error("Error updating hotel:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
//============ Delete Hotel by ID ============
exports.deleteHotelById = async (req, res) => {
  try {
    const hotelId = req.params.id;
    const deletedHotel = await Hotel.findByIdAndDelete(hotelId);
    if (!deletedHotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    res.status(200).json({
      message: "Hotel deleted successfully",
      data: deletedHotel,
    });
  } catch (error) {
    console.error("Error deleting hotel:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



//============ Hostel Category Controller ============
const Category = require("../../models/Hostel/Hostel_CategoryModel");

//============ Get Hotels by Category ============
exports.getHotelsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const hotels = await Category.find({ Category: categoryId });
    if (hotels.length === 0) {
      return res
        .status(404)
        .json({ message: "No hotels found for this category" });
    }
    res.status(200).json({
      message: "Hotels retrieved successfully",
      data: hotels,
    });
  } catch (error) {
    console.error("Error retrieving hotels by category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
//============ Get All Categories ============
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({
      message: "Categories retrieved successfully",
      data: categories,
    });
  } catch (error) {
    console.error("Error retrieving categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//============ Create Category ============
exports.createCategory = async (req, res) => {
  try {
    const categoryData = req.body;
    const newCategory = new Category(categoryData);
    await newCategory.save();
    res.status(201).json({
      message: "Category created successfully",
      data: newCategory,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
//============ Update Category by ID ============
exports.updateCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const updatedData = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      updatedData,
      { new: true } // return the updated document
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//============ Delete Category by ID ============
exports.deleteCategoryById = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const deletedCategory = await Category.findByIdAndDelete(categoryId);
    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({
      message: "Category deleted successfully",
      data: deletedCategory,
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


// ============= Hostel Room Controller ============
const HostelRoom = require("../../models/Hostel/Hostel_RoomsModel");

//============ Create Room ============
exports.createRoom = async (req, res) =>
  {
  try {
    const roomData = req.body;
    console.log("Creating room with data:", roomData);
    
    const newRoom = new HostelRoom(roomData);
    await newRoom.save();
    res.status(201).json({
      message: "Room created successfully",
      data: newRoom,
    });
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//============ Get All Rooms ============
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await HostelRoom.find()
      .populate("hostelmasterId", "Hostel_Name")
      .populate("CategoryId");

    res.status(200).json({
      message: "Rooms retrieved successfully",
      data: rooms,
    });
  } catch (error) {
    console.error("Error retrieving rooms:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
//============ Get Room by ID ============
exports.getRoomById = async (req, res) => {
  try {
    const roomId = req.params.id;

    const room = await HostelRoom.findById(roomId)
      .populate("hostelmasterId", "Hostel_Name")
      .populate("CategoryId");

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json({
      message: "Room retrieved successfully",
      data: room,
    });
  } catch (error) {
    console.error("Error retrieving room:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


//============ Update Room by ID ============
exports.updateRoom = async (req, res) => {
  try {
    const roomId = req.params.id;
    const updatedData = req.body;

    const updatedRoom = await HostelRoom.findByIdAndUpdate(roomId, updatedData, {
      new: true,
    });

    if (!updatedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json({
      message: "Room updated successfully",
      data: updatedRoom,
    });
  } catch (error) {
    console.error("Error updating room:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//==============  Delete Room by ID =============
exports.deleteRoom = async (req, res) => {
  try {
    const roomId = req.params.id;

    const deletedRoom = await HostelRoom.findByIdAndDelete(roomId);

    if (!deletedRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.status(200).json({
      message: "Room deleted successfully",
      data: deletedRoom,
    });
  } catch (error) {
    console.error("Error deleting room:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};