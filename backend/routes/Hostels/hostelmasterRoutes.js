const express = require("express");
const router = express.Router();
const {
  createHotel,
  getAllHotels,
  getHotelById,
  updateHotelById,
  deleteHotelById,
  createCategory,
  getHotelsByCategory,
  getAllCategories,
  updateCategoryById,
  deleteCategoryById,
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom

} = require("../../controllers/Hostels/hostelMasterController");

//============== Hostel Master Routes ==============
router.post("/create", createHotel);
router.get("/getAll", getAllHotels);
router.get("/getById/:id", getHotelById);
router.put("/update/:id", updateHotelById);
router.delete("/delete/:id", deleteHotelById);

//=============== Hostel Category Routes ==============
router.post("/category/create", createCategory);
router.get("/category/getAll", getAllCategories);
router.get("/category/getById/:id", getHotelsByCategory);
router.put("/category/update/:id", updateCategoryById);
router.delete("/category/delete/:id", deleteCategoryById);

//=============== Hostel Room Routes ==============

router.post("/room/create", createRoom);
router.get("/room/getAll", getAllRooms);
router.get("/room/getById/:id", getRoomById);
router.put("/room/update/:id", updateRoom);
router.delete("/room/delete/:id", deleteRoom);


module.exports = router;
