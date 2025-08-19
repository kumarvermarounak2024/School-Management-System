const BookCategory = require("../../models/Library/bookCategoryModel");


exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const existing = await BookCategory.findOne({ name });
    if (existing) {
      return res.status(409).json({ message: "Category already exists" });
    }

    const category = new BookCategory({ name });
    await category.save();

    res.status(201).json({
      message: "Book category created successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await BookCategory.find().sort({ createdAt: -1 });
    res.status(200).json({ data: categories });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await BookCategory.findById(id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ data: category });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const updated = await BookCategory.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
      message: "Category updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update Category Error:", error); // Log real error
    res.status(500).json({
      message: "Server error",
      error: error.message || "Unknown error"
    });
  }
};


exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await BookCategory.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

