const Stoppage=require('../../models/Transport/stoppageModel');


exports.createStoppage=async(req,res)=>{
try{
    console.log("🔵 Incoming data:", req.body);
 const { stoppage, stopTiming, routeFare } = req.body;

    if (!stoppage || !stopTiming || !routeFare) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newStoppage = new Stoppage({
      stoppage,
      stopTiming,
      routeFare
    });

    await newStoppage.save();

    res.status(201).json({
      message: 'Stoppage created successfully.',
      data: newStoppage
    });


}catch(error){
console.error('Error creating stoppage:', error);
    res.status(500).json({ message: 'Internal server error.' });

}

};


exports.getAllStoppage = async (req, res) => {
  try {
    const stoppages = await Stoppage.find();
    res.status(200).json({ data: stoppages });
  } catch (error) {
    console.error('Error fetching stoppages:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};


exports.getStoppageById = async (req, res) => {
    try {
        const { id } = req.params;
        const stoppage = await Stoppage.findById(id);

        if (!stoppage) {
            return res.status(404).json({ message: 'Stoppage not found.' });
        }

        res.status(200).json({ data: stoppage });
    } catch (error) {
        console.error('Error fetching stoppage by ID:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

exports.updateStoppage = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedStoppage = await Stoppage.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedStoppage) {
            return res.status(404).json({ message: 'Stoppage not found.' });
        }

        res.status(200).json({
            message: 'Stoppage updated successfully.',
            data: updatedStoppage
        });
    } catch (error) {
        console.error('Error updating stoppage:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};

exports.deleteStoppage = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedStoppage = await Stoppage.findByIdAndDelete(id);

        if (!deletedStoppage) {
            return res.status(404).json({ message: 'Stoppage not found.' });
        }

        res.status(200).json({ message: 'Stoppage deleted successfully.' });
    } catch (error) {
        console.error('Error deleting stoppage:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};