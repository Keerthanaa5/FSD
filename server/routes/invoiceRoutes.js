import express from 'express';
import { 
  getInvoices, 
  getInvoiceById, 
  createInvoice, 
  updateInvoice, 
  deleteInvoice, 
  updatePaymentStatus 
} from '../controllers/invoiceController.js';

const router = express.Router();

router.route('/')
  .get(getInvoices)
  .post(createInvoice);

router.patch('/:id/payment', updatePaymentStatus);

router.route('/:id')
  .get(getInvoiceById)
  .put(updateInvoice)
  .delete(deleteInvoice);

export default router;
