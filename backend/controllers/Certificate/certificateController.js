
const Certificate = require("../../models/Certificate/certificateModel");
const { uploadDocument: uploadFile } = require("../../config/cloudinary");

// Create certificate
exports.createCertificate = async (req, res) => {
  try {
    const {
      certificateName, applicableUser, pageLayout,
      photoStyle, photoSize, top, bottom, left, right,
      content, createdAt,
    } = req.body;

    const processUpload = async (fileField) => {
      const file = req.files?.[fileField]?.[0];
      if (!file) return null;
      const result = await uploadFile(file.buffer, "certificate_uploads", file.originalname, file.mimetype);
      return {
        public_id: result.public_id,
        url: result.secure_url,
        format: result.format,
        resource_type: result.resource_type,
      };
    };

    const signature = await processUpload("signature");
    const logo      = await processUpload("logo");
    const background= await processUpload("background");

    const newCert = new Certificate({
      certificateName, applicableUser, pageLayout,
      photoStyle, photoSize,
      layoutSpacing: { top, bottom, left, right },
      content, createdAt,
      signature, logo, background,
    });

    await newCert.save();
    res.status(201).json({ message: "Certificate created", data: newCert });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create certificate" });
  }
};

// Fetch all
exports.getCertificates = async (req, res) => {
  try {
    const data = await Certificate.find().sort({ createdAt: -1 });
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch certificates" });
  }
};

// Delete by ID
exports.deleteCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    await Certificate.findByIdAndDelete(id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
};

// Fetch single by ID
exports.getCertificateById = async (req, res) => {
  try {
    const cert = await Certificate.findById(req.params.id);
    if (!cert) return res.status(404).json({ message: "Not found" });
    res.json(cert);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed" });
  }
};

// ✅ Update certificate
exports.updateCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      certificateName, applicableUser, pageLayout,
      photoStyle, photoSize, top, bottom, left, right,
      content, createdAt,
    } = req.body;

    const processUpload = async (fileField) => {
      const file = req.files?.[fileField]?.[0];
      if (!file) return null;
      const result = await uploadFile(file.buffer, "certificate_uploads", file.originalname, file.mimetype);
      return {
        public_id: result.public_id,
        url: result.secure_url,
        format: result.format,
        resource_type: result.resource_type,
      };
    };

    const updateData = {
      certificateName, applicableUser, pageLayout,
      photoStyle, photoSize,
      layoutSpacing: { top, bottom, left, right },
      content, createdAt,
    };

    // Upload new files if provided
    const signature = await processUpload("signature");
    const logo = await processUpload("logo");
    const background = await processUpload("background");

    if (signature) updateData.signature = signature;
    if (logo) updateData.logo = logo;
    if (background) updateData.background = background;

    const updated = await Certificate.findByIdAndUpdate(id, updateData, { new: true });

    if (!updated) return res.status(404).json({ message: "Certificate not found" });

    res.json({ message: "Certificate updated", data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update certificate" });
  }
};
