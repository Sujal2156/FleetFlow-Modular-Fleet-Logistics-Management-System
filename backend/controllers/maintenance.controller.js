import Maintenance from '../models/Maintenance.model.js';

// Get all maintenance records
export const getAllMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.find()
      .populate('vehicle')
      .sort({ date: -1 });
    res.status(200).json(maintenance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single maintenance record
export const getMaintenanceById = async (req, res) => {
  try {
    const maintenance = await Maintenance.findById(req.params.id).populate('vehicle');
    if (!maintenance) {
      return res.status(404).json({ message: 'Maintenance record not found' });
    }
    res.status(200).json(maintenance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create maintenance record
export const createMaintenance = async (req, res) => {
  try {
    const maintenance = new Maintenance(req.body);
    const savedMaintenance = await maintenance.save();
    res.status(201).json(savedMaintenance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update maintenance record
export const updateMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!maintenance) {
      return res.status(404).json({ message: 'Maintenance record not found' });
    }
    res.status(200).json(maintenance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete maintenance record
export const deleteMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.findByIdAndDelete(req.params.id);
    if (!maintenance) {
      return res.status(404).json({ message: 'Maintenance record not found' });
    }
    res.status(200).json({ message: 'Maintenance record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
