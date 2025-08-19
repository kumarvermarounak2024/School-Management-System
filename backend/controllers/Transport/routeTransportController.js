const RouteTransport = require('../../models/Transport/routeTansportModel');

// Create a new route
exports.createTransportRoute = async (req, res) => {
  try {
    console.log('Request Body:', req.body); 

    const { routeName, startPlace, stopPlace, remark } = req.body;

   
    if (!routeName || !startPlace || !stopPlace) {
      return res.status(400).json({ message: 'routeName, startPlace, and stopPlace are required.' });
    }

    const newRoute = new RouteTransport({
      routeName,
      startPlace,
      stopPlace,
      remark: remark || '', 
    });

    await newRoute.save();

    res.status(201).json({ message: 'Route created successfully.', data: newRoute });
  } catch (error) {
    console.error('Error creating route:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

exports.getAllTransportRoutes = async (req, res) => {
  try {
    const routes = await RouteTransport.find();
    res.status(200).json({ data: routes });
  } catch (error) {
    console.error('Error fetching routes:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

exports.getAllTransportRoutesById = async (req, res) => {
  try {
    const route = await RouteTransport.findById(req.params.id);
    if (!route) return res.status(404).json({
      message: "Route not found"
    });
    
    
    res.status(200).json({ data: route });
  } catch (error) {
    // Fixed: logging 'error' instead of 'route'
    console.log("Error fetching route:", error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

exports.updateTransportRoute = async (req, res) => {
  try {
    const { routeName, startPlace, stopPlace, remark } = req.body;
    
    const updateRoute = await RouteTransport.findByIdAndUpdate(
      req.params.id,
      { routeName, startPlace, stopPlace, remark },
      { new: true, runValidators: true }
    );
    
    if (!updateRoute) return res.status(404).json({
      message: "Route not found"
    });
    
    res.status(200).json({
      message: "Route updated successfully",
      data: updateRoute
    });

  } catch (error) {
    console.log('Error updating Route:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.deleteTransportRoute = async (req, res) => {
  try {
    const deletedRoute = await RouteTransport.findByIdAndDelete(req.params.id);
    if (!deletedRoute) return res.status(404).json({ message: 'Route not found.' });

    res.status(200).json({ message: 'Route deleted successfully.' });
  } catch (error) {
    console.error('Error deleting route:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};