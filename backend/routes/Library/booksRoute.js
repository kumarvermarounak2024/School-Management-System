const express = require("express");
const router = express.Router();

const {createBook,
    getAllBooks,
    getBookById,
    updateBookById,
    deleteBookById,
  

}= require("../../controllers/Library/booksController");

// Create a new book with optional cover image
router.post("/create", createBook);

// Get all books
router.get("/getAll", getAllBooks);

// Get a book by ID
router.get("/get/:id", getBookById);

// Update a book by ID with optional cover image update
router.put("/update/:id",updateBookById);

// Delete a book by ID
router.delete("/delete/:id", deleteBookById);

module.exports = router;


