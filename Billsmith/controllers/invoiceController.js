const Invoice = require('../models/Invoice');
const Client = require('../models/Client');
const { INVOICE_NOT_FOUND, INVOICE_REMOVED, CLIENT_NOT_FOUND } = require('../utils/messages');

// @desc    Get all invoices (populated with client info)
// @route   GET /api/invoices
// @desc    Get all invoices (populated with client info) + filtering/select/sort/pagination
// @route   GET /api/invoices
const getInvoices = async (req, res) => {
  try {
    // 1) Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // 2) Filtering (Mongo operators)
    // Examples:
    // /api/invoices?minTotal=100&maxTotal=500
    // /api/invoices?statusIn=sent,paid
    // Combine:
    // /api/invoices?minTotal=100&maxTotal=500&statusIn=sent,paid
    const filter = {};

    // $gte / $lte on total
    if (req.query.minTotal || req.query.maxTotal) {
      filter.total = {};
      if (req.query.minTotal) filter.total.$gte = Number(req.query.minTotal);
      if (req.query.maxTotal) filter.total.$lte = Number(req.query.maxTotal);
    }

    // $in on status
    if (req.query.statusIn) {
      const statuses = req.query.statusIn.split(',').map((s) => s.trim());
      filter.status = { $in: statuses };
    }

    // (Optional) filter by client id if you want:
    // /api/invoices?clientId=xxxx
    if (req.query.clientId) {
      filter.client = req.query.clientId;
    }

    // 3) Select (projection) via query string
    // Use commas in URL:
    // /api/invoices?select=total,status,client
    // /api/invoices?select=-__v,-updatedAt
    // Default: keep your -__v behavior if no select param provided
    const select = req.query.select
      ? req.query.select.split(',').join(' ')
      : '-__v';

    // 4) Sort (required on at least one endpoint)
    // /api/invoices?sort=total
    // /api/invoices?sort=-createdAt
    const sort = req.query.sort
      ? req.query.sort.split(',').join(' ')
      : '-createdAt';

    // 5) Query (with pagination)
    const total = await Invoice.countDocuments(filter);

    const invoices = await Invoice.find(filter)
      .select(select)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('client', 'businessName contactEmail');

    res.status(200).json({
      success: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      results: invoices.length,
      data: invoices,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get invoice by ID
// @route   GET /api/invoices/:id
const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .select('-__v')
      .populate('client', 'businessName contactEmail');
    if (!invoice) {
      return res.status(404).json({ message: INVOICE_NOT_FOUND });
    }
    res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an invoice
// @route   POST /api/invoices
const createInvoice = async (req, res) => {
  try {
    // If a client ID is provided, verify the client exists
    if (req.body.client) {
      const client = await Client.findById(req.body.client);
      if (!client) {
        return res.status(404).json({ message: CLIENT_NOT_FOUND });
      }
    }
    const invoice = await Invoice.create(req.body);
    res.status(201).json(invoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update an invoice
// @route   PUT /api/invoices/:id
const updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).select('-__v');
    if (!invoice) {
      return res.status(404).json({ message: INVOICE_NOT_FOUND });
    }
    res.status(200).json(invoice);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an invoice
// @route   DELETE /api/invoices/:id
const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: INVOICE_NOT_FOUND });
    }
    res.status(200).json({ message: INVOICE_REMOVED });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
};