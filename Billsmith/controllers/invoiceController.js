const Invoice = require('../models/Invoice');
const Client = require('../models/Client');
const { INVOICE_NOT_FOUND, INVOICE_REMOVED, CLIENT_NOT_FOUND } = require('../utils/messages');

// @desc    Get all invoices (populated with client info)
// @route   GET /api/invoices
const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .select('-__v')
      .populate('client', 'businessName contactEmail');
    res.status(200).json(invoices);
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