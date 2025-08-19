const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    isbn: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    edition: {
      type: String,
      required: true,
    },
    purchaseDate: {
      type: Date,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BookCategory",
      required: true,
    },
    publisher: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    totalStock: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);