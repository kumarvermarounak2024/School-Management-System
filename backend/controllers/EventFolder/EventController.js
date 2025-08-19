const Event = require("../../models/EventFolder/EventModel");
const { uploadDocument } = require("../../config/cloudinary");
// Create Event
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      type,
      audience,
      description,
      startDate,
      endDate,
      isHoliday,
      showWebsite,
      publish,
      createdBy,
    } = req.body; // ✅ Corrected here

    let eventPic = null;
    if (req.files?.image?.[0]) {
      eventPic = await uploadDocument(
        req.files.image[0].buffer,
        "event_image/photo"
      );
    }

    const event = new Event({
      title,
      type,
      audience,
      description,
      startDate,
      endDate,
      isHoliday,
      showWebsite,
      publish,
      createdBy,
      image: eventPic,
    });

    const newEvent = await event.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get All Events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .sort({ createdAt: -1 })
      .populate('type'); // this will populate the EventType info
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Update Event
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete Event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.status(200).json({ message: "Event deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
