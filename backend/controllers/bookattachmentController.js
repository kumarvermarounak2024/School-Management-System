const Attachment = require('../models/bookattachmentModel');
const { uploadDocument, deleteDocument } = require('../config/cloudinary');
const mongoose = require('mongoose');

//============ Create Attachment ============
exports.createAttachment = async (req, res) => {
  try {
    console.log();
    
    if (!req.file) {
      return res.status(400).json({ message: 'Attachment file is required' });
    }

    // Upload the file to Cloudinary
    const file = req.file;
    const uploaded = await uploadDocument(
      file.buffer,
      'attachments',
      file.originalname,
      file.mimetype
    );

    if (!uploaded || !uploaded.url) {
      return res.status(500).json({ message: 'Failed to upload attachment' });
    }

    // Prepare the new attachment data
    const {
      title,
      type,
      publishDate,
      remarks,
      availableForAll,
      notAccordingSubject,
      class: classId,
      subject: subjectId,
    } = req.body;

    const newAttachmentData = {
      title,
      type,
      publishDate: new Date(publishDate),
      remarks,
      attachmentUrl: uploaded.url,
      availableForAll: availableForAll === 'true',
      notAccordingSubject: notAccordingSubject === 'true',
    };

    // Add class if valid
    if (classId && mongoose.Types.ObjectId.isValid(classId)) {
      newAttachmentData.class = classId;
    }

    // Add subject if valid
    if (subjectId && mongoose.Types.ObjectId.isValid(subjectId)) {
      newAttachmentData.subject = subjectId;
    }

    const newAttachment = new Attachment(newAttachmentData);
    await newAttachment.save();

    res.status(201).json({
      message: 'Attachment created successfully',
      data: newAttachment,
    });
  } catch (err) {
    console.error('Error creating attachment:', err);
    res.status(500).json({
      message: 'Error creating attachment',
      error: err.message,
    });
  }
};

//============ Get All Attachments ============
exports.getAllAttachments = async (req, res) => {
  try {
    const attachments = await Attachment.find()
      .populate('class')
      .populate('subject');

    res.status(200).json({ data: attachments });
  } catch (err) {
    res.status(500).json({
      message: 'Error fetching attachments',
      error: err.message,
    });
  }
};

//============ Update Attachment ============
exports.updateAttachment = async (req, res) => {
  try {
    const attachmentId = req.params.id;

    // Check if attachment exists
    const existingAttachment = await Attachment.findById(attachmentId);
    if (!existingAttachment) {
      return res.status(404).json({ message: 'Attachment not found' });
    }

    // Build the update data
    const updateData = {
      title: req.body.title,
      type: req.body.type,
      publishDate: req.body.publishDate,
      remarks: req.body.remarks,
      availableForAll: req.body.availableForAll === 'true',
      notAccordingSubject: req.body.notAccordingSubject === 'true',
    };

    // Add class only if it's a valid ObjectId
    if (req.body.class && mongoose.Types.ObjectId.isValid(req.body.class)) {
      updateData.class = req.body.class;
    } else {
      updateData.class = null;
    }

    // Add subject only if it's a valid ObjectId
    if (req.body.subject && mongoose.Types.ObjectId.isValid(req.body.subject)) {
      updateData.subject = req.body.subject;
    } else {
      updateData.subject = null;
    }

    // If a new file is uploaded, handle Cloudinary upload & old file deletion
    if (req.file) {
      const file = req.file;

      // Upload new document
      const uploaded = await uploadDocument(
        file.buffer,
        'attachments',
        file.originalname,
        file.mimetype
      );

      if (!uploaded) {
        return res.status(500).json({ message: 'Failed to upload new attachment' });
      }

      // Delete old attachment from Cloudinary if exists
      const publicIdMatch = existingAttachment.attachmentUrl.match(/\/attachments\/([^/.]+)/);
      if (publicIdMatch && publicIdMatch[1]) {
await deleteDocument(`attachments/${publicIdMatch[1]}`, 'raw');
      }

      updateData.attachmentUrl = uploaded.url;
    }

    // Update attachment in database
    const updatedAttachment = await Attachment.findByIdAndUpdate(
      attachmentId,
      updateData,
      { new: true }
    );

    res.status(200).json({
      message: 'Attachment updated successfully',
      data: updatedAttachment,
    });

  } catch (err) {
    console.error('Error updating attachment:', err);
    res.status(500).json({
      message: 'Error updating attachment',
      error: err.message,
    });
  }
};

exports.deleteAttachment = async (req, res) => {
  try {
    const attachment = await Attachment.findById(req.params.id);

    if (!attachment) {
      return res.status(404).json({ message: 'Attachment not found' });
    }

    // Extract file extension to determine resource type
    const extension = attachment.attachmentUrl.split('.').pop().toLowerCase();
    let resourceType = 'raw';

    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension)) {
      resourceType = 'image';
    } else if (['mp4', 'avi', 'mov', 'webm'].includes(extension)) {
      resourceType = 'video';
    }

    // Extract public ID from Cloudinary URL
    const publicIdMatch = attachment.attachmentUrl.match(/\/attachments\/([^\.\/]+)\./);
    if (publicIdMatch && publicIdMatch[1]) {
      const publicId = `attachments/${publicIdMatch[1]}`;
      await deleteDocument(publicId, resourceType);
    }

    await Attachment.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Attachment deleted successfully' });
  } catch (err) {
    console.error('Error deleting attachment:', err);
    res.status(500).json({ message: 'Error deleting attachment', error: err.message });
  }
};

