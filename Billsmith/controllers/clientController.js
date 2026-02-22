const Client = require('../models/Client');
const { CLIENT_NOT_FOUND, CLIENT_REMOVED } = require('../utils/messages');

// @desc    Get all clients
// @route   GET /api/clients
// const getClients = async (req, res) => {
//   try {
//     const clients = await Client.find().select('-__v');
//     res.status(200).json(clients);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const getClients = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit,10) || 10;
    const skip = (page - 1) * limit;

    // Filtering (Mongo operators)
    // Examples:
    // /clients?from=2026-01-01&to=2026-02-01  -> $gte/$lte on createdAt
    // /clients?statusNe=inactive             -> $ne on status
    const filter = {};

    // $gte / $lte on createdAt (date range)
    if (req.query.from || req.query.to) {
      filter.createdAt = {};
      if (req.query.from) filter.createdAt.$gte = new Date(req.query.from);
      if (req.query.to) filter.createdAt.$lte = new Date(req.query.to);
    }

    // $ne on status
    if (req.query.statusNe) {
      filter.status = { $ne: req.query.statusNe };
    }

    // Select (projection)
    // Use commas in the query string:
    // /clients?select=name,email
    // /clients?select=-__v,-updatedAt
    const select = req.query.select
      ? req.query.select.split(',').join(' ')
      : '';

    // Sort
    // /clients?sort=name
    // /clients?sort=-createdAt
    const sort = req.query.sort
      ? req.query.sort.split(',').join(' ')
      : '-createdAt';

    // Query
    const total = await Client.countDocuments(filter);

    const clients = await Client.find(filter)
      .select(select)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      results: clients.length,
      data: clients,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Get client by ID
// @route   GET /api/clients/:id
const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id).select('-__v');
    if (!client) {
      return res.status(404).json({ message: CLIENT_NOT_FOUND });
    }
    res.status(200).json(client);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a client
// @route   POST /api/clients
const createClient = async (req, res) => {
  try {
    const client = await Client.create(req.body);
    res.status(201).json(client);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a client
// @route   PUT /api/clients/:id
const updateClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select('-__v');
    if (!client) {
      return res.status(404).json({ message: CLIENT_NOT_FOUND });
    }
    res.status(200).json(client);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a client
// @route   DELETE /api/clients/:id
const deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) {
      return res.status(404).json({ message: CLIENT_NOT_FOUND });
    }
    res.status(200).json({ message: CLIENT_REMOVED });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
};