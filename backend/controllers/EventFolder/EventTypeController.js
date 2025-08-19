const EventType = require('../../models/EventFolder/EventTypeModel');

// Create Event
exports.createEvent = async (req, res) => {
  try {
    const { name } = req.body;
    const event = new EventType({ name });
    await event.save();
    res.status(201).json({ message: 'Event created successfully', event });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get All Events
exports.getEvents = async (req, res) => {
  try {
    const events = await EventType.find().sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Update Event
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedEvent = await EventType.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ message: 'Event updated', event: updatedEvent });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete Event
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    await EventType.findByIdAndDelete(id);
    res.status(200).json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
