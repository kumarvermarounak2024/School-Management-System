const IdCardTemplate = require("../../models/idcardTemplateModel")
const { uploadDocument, deleteDocument } = require("../../config/cloudinary");


//============ create ==============

const createIdCardTemplate = async (req, res) => {
  try {
    const {
      idCardName,
      applicableUser, // now expects string like "Student", "Teacher"
      pageLayoutWidth,
      pageLayoutHeight,
      userPhotoStyle,
      userPhotoSize,
      topSpace,
      bottomSpace,
      leftSpace,
      rightSpace,
      Certificate_Content,
    } = req.body;

    // Upload images to Cloudinary if files exist
    let signatureImage = null;
    let logoImage = null;
    let backgroundImage = null;

    if (req.files?.signatureImage?.[0]) {
      signatureImage = await uploadDocument(req.files.signatureImage[0].buffer, "id_card_templates/signatures");
    }

    if (req.files?.logoImage?.[0]) {
      logoImage = await uploadDocument(req.files.logoImage[0].buffer, "id_card_templates/logos");
    }

    if (req.files?.backgroundImage?.[0]) {
      backgroundImage = await uploadDocument(req.files.backgroundImage[0].buffer, "id_card_templates/backgrounds");
    }

    const newTemplate = new IdCardTemplate({
      idCardName,
      applicableUser,
      pageLayout: {
        width: pageLayoutWidth,
        height: pageLayoutHeight,
      },
      userPhotoStyle: {
        style: userPhotoStyle,
        size: userPhotoSize,
      },
      layoutSpacing: {
        top: topSpace,
        bottom: bottomSpace,
        left: leftSpace,
        right: rightSpace,
      },
      signatureImage: signatureImage?.url || "",
      logoImage: logoImage?.url || "",
      backgroundImage: backgroundImage?.url || "",
      Certificate_Content,
    });

    const savedTemplate = await newTemplate.save();

    res.status(201).json({
      success: true,
      message: "ID card template created successfully",
      data: savedTemplate,
    });
  } catch (error) {
    console.error("Error creating ID card template:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create ID card template",
      error: error.message,
    });
  }
};

module.exports = { createIdCardTemplate };



// =============== Get all ID card templates ===================


const getAllIdCardTemplates = async (req, res) => {
  try {
    const templates = await IdCardTemplate.find();
    res.status(200).json({
      success: true,
      data: templates
    });
  } catch (error) {
    console.error("Error fetching templates:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch templates",
      error: error.message
    });
  }
};




// ================= Get single ID card template by ID ==============

const getIdCardTemplateById = async (req, res) => {
  try {
    let template = await IdCardTemplate.findById(req.params.id).populate("applicableUser");

    if (!template) {
      return res.status(404).json({ success: false, message: "Template not found" });
    }

    // Clean image path (Windows to Unix style)
    const cleanPath = (path) => (path ? path.replace(/\\/g, "/") : null);

    // Convert populated applicableUser object to string (e.g., name or role)
    template = {
      ...template._doc,
      signatureImage: cleanPath(template.signatureImage),
      logoImage: cleanPath(template.logoImage),
      backgroundImage: cleanPath(template.backgroundImage),
      applicableUser: typeof template.applicableUser === 'object' && template.applicableUser !== null
        ? template.applicableUser.name || template.applicableUser.role || "User"
        : template.applicableUser,
    };

    // Final response
    res.status(200).json({
      success: true,
      data: template
    });
  } catch (error) {
    console.error("Error fetching template:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch template",
      error: error.message
    });
  }
};


// =================== Update ID card template ================== 
const updateIdCardTemplate = async (req, res) => {
  try {
    const { id } = req.params;

    // Find existing template
    const existingTemplate = await IdCardTemplate.findById(id);
    if (!existingTemplate) {
      return res.status(404).json({ error: "ID Card Template not found" });
    }

    // Prepare update object from body
    const {
      idCardName,
      applicableUser,
      pageLayout,
      userPhotoStyle,
      layoutSpacing,
      Certificate_Content,
    } = req.body;

    const updateData = {
      idCardName,
      applicableUser,
      pageLayout: JSON.parse(pageLayout || "{}"),
      userPhotoStyle: JSON.parse(userPhotoStyle || "{}"),
      layoutSpacing: JSON.parse(layoutSpacing || "{}"),
      Certificate_Content,
    };

    // Upload files if provided
    const fileFields = [
      { field: "logoImage", existing: existingTemplate.logoImage },
      { field: "signatureImage", existing: existingTemplate.signatureImage },
      { field: "backgroundImage", existing: existingTemplate.backgroundImage },
    ];

    for (const { field, existing } of fileFields) {
      const file = req.files?.[field]?.[0];
      if (file) {
        // Delete previous image if exists
        if (existing) {
          const publicId = extractPublicId(existing);
          if (publicId) await deleteDocument(publicId);
        }

        const uploaded = await uploadDocument(file.buffer, "id_card_templates", file.originalname, file.mimetype);
        if (uploaded?.url) updateData[field] = uploaded.url;
      }
    }

    // Update document
    const updated = await IdCardTemplate.findByIdAndUpdate(id, updateData, { new: true });

    res.status(200).json({
      message: "ID Card Template updated successfully",
      data: updated,
    });

  } catch (error) {
    console.error("Update failed:", error);
    res.status(500).json({ error: "Failed to update ID Card Template" });
  }
};

/**
 * Extract Cloudinary public_id from URL
 * e.g. https://res.cloudinary.com/demo/image/upload/v1234567890/folder/file.jpg
 * => folder/file
 */
const extractPublicId = (url) => {
  try {
    const parts = url.split("/");
    const fileName = parts.pop().split(".")[0]; // remove extension
    const folder = parts.slice(-2, -1)[0]; // assumes one folder level
    return `${folder}/${fileName}`;
  } catch {
    return null;
  }
};




// ================ Delete ID card template ====================
const deleteIdCardTemplate = async (req, res) => {
  try {
    const template = await IdCardTemplate.findById(req.params.id);
    if (!template) {
      return res.status(404).json({ message: "Template not found" });
    }

    // Delete image from Cloudinary
    if (template.backgroundImage?.public_id) {
      await deleteDocument(template.backgroundImage.public_id);
    }

    await IdCardTemplate.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Template deleted" });
  } catch (error) {
    console.error("Error deleting template:", error);
    res.status(500).json({ message: "Failed to delete template" });
  }
};

module.exports = {
    createIdCardTemplate,
  getAllIdCardTemplates,
  getIdCardTemplateById,
  updateIdCardTemplate,
  deleteIdCardTemplate,
};


