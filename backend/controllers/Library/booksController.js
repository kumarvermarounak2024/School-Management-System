const Book = require("../../models/Library/booksModel");
const { uploadDocument } = require("../../config/cloudinary");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage }).single("coverImage");

// Create a new Book
exports.createBook = async (req, res) => {
  console.log("Create book endpoint hit");

  upload(req, res, async function (err) {
    if (err) {
      console.error("Multer error:", err);
      return res
        .status(500)
        .json({ message: "File upload error", error: err.message });
    }

    try {
      // console.log("Request body:", req.body);
      // console.log("Request file:", req.file);

      const {
        bookstitle,
        bookISBNNO,
        author,
        edition,
        purchaseDate,
        category,
        publisher,
        description,
        price,
        totalStock,
      } = req.body;

      // Log each field value
      console.log("Parsed fields:", {
        bookstitle,
        bookISBNNO,
        author,
        edition,
        purchaseDate,
        category,
        publisher,
        description,
        price,
        totalStock,
      });

      // Check for required fields using the payload field names
      if (!bookstitle || !bookISBNNO || !category || !totalStock) {
        console.log("Missing required fields. Received:", req.body);
        return res.status(400).json({
          message:
            "Missing required fields: bookstitle, bookISBNNO, category, totalStock",
          received: req.body,
        });
      }

      // Map the payload fields to model fields
      const bookData = {
        title: bookstitle,
        isbn: bookISBNNO,
        author,
        edition,
        purchaseDate,
        category,
        publisher,
        description,
        price: Number(price),
        totalStock: Number(totalStock),
      };

      // console.log("Mapped book data:", bookData);

      let coverImage = "";

      if (req.file) {
        console.log("Processing file upload");
        const uploadResult = await uploadDocument(
          req.file.buffer,
          "book_covers",
          req.file.originalname,
          req.file.mimetype
        );

        if (uploadResult?.url) {
          coverImage = uploadResult.url;
          console.log("File uploaded successfully:", coverImage);
        } else {
          console.error("File upload failed:", uploadResult);
          return res
            .status(500)
            .json({ message: "Failed to upload cover image" });
        }
      } else {
        console.log("No file uploaded");
      }

      const newBook = new Book({
        ...bookData,
        coverImage,
      });

      console.log("Attempting to save book:", newBook);

      const savedBook = await newBook.save();
      console.log("Book saved successfully:", savedBook);

      res.status(201).json({
        message: "Book created successfully",
        data: savedBook,
      });
    } catch (error) {
      console.error("Error creating book:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });

      res.status(500).json({
        message: "Server error",
        error: error.message,
        details: error.stack,
      });
    }
  });
};

// Get all Books
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().populate("category", "name")
    res.json({
      message: "Books retrieved successfully",
      data: books,
    });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Book by ID
exports.getBookById = async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findById(bookId).populate("category", "name");
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json({
      message: "Book retrieved successfully",
      data: book,
    });
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Book by ID
exports.updateBookById = async (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      return res
        .status(500)
        .json({ message: "File upload error", error: err.message });
    }

    try {
      const bookId = req.params.id;
      const updateData = { ...req.body };

      // If new cover image is uploaded, upload it and update URL
      if (req.file) {
        const uploadResult = await uploadDocument(
          req.file.buffer,
          "book_covers",
          req.file.originalname,
          req.file.mimetype
        );

        if (uploadResult?.url) {
          updateData.coverImage = uploadResult.url;
        } else {
          return res
            .status(500)
            .json({ message: "Failed to upload cover image" });
        }
      }

      const updatedBook = await Book.findByIdAndUpdate(bookId, updateData, {
        new: true,
        runValidators: true,
      });

      if (!updatedBook) {
        return res.status(404).json({ message: "Book not found" });
      }

      res.json({
        message: "Book updated successfully",
        data: updatedBook,
      });
    } catch (error) {
      console.error("Error updating book:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  });
};

// Delete Book by ID
exports.deleteBookById = async (req, res) => {
  try {
    const bookId = req.params.id;
    const deletedBook = await Book.findByIdAndDelete(bookId);
    if (!deletedBook) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json({
      message: "Book deleted successfully",
      data: deletedBook,
    });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};