const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Client',
    },
    amount: {
      type: Number,
      required: [true, 'Invoice amount is required'],
      min: [0.01, 'Amount must be greater than zero'],
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'paid', 'overdue'],
        message: '{VALUE} is not a valid status',
      },
      default: 'pending',
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Invoice', invoiceSchema);