import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now, 
  },
  amount: {
    type: String,
    required: true,
  },
  remarks: {
    type: String,
    required: false,
  },
}, {
  timestamps: true, 
});

const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', TransactionSchema);

export default Transaction;
