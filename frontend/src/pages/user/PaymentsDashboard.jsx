import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '@/services/api';
import { Download, Receipt, AlertCircle } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';

export default function PaymentsDashboard() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app we might put this in dashboardSlice, but local state is fine for simple lists
    const fetchPayments = async () => {
      try {
        // Mocking the payment fetch by pulling bookings that have captured payments.
        // Or if we have a direct /payments/my endpoint, use it.
        // Assuming we rely on bookings to show payment history for now.
        const res = await api.get('/bookings/my?status=confirmed,completed');
        const bookings = res.data.data;
        // Transform bookings into a payment ledger format
        const ledger = bookings.map(b => ({
          id: b._id,
          bookingId: b.bookingId,
          date: b.createdAt,
          amount: b.totalAmount,
          vehicle: b.vehicle?.name,
          status: 'captured',
          method: 'Razorpay'
        }));
        setPayments(ledger);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  if (loading) return <div className="animate-pulse">Loading payment history...</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      
      <div>
        <h1 className="text-h3 text-primary mb-1">Payment History</h1>
        <p className="text-secondary">View receipts and transaction records</p>
      </div>

      {payments.length === 0 ? (
        <EmptyState
          icon={Receipt}
          title="No Transactions"
          description="You have no recorded payments yet."
        />
      ) : (
        <div className="glass-card-elevated rounded-2xl overflow-hidden border border-border">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface/50 border-b border-border">
                  <th className="px-6 py-4 text-caption font-semibold text-secondary uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-caption font-semibold text-secondary uppercase tracking-wider">Reference</th>
                  <th className="px-6 py-4 text-caption font-semibold text-secondary uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-caption font-semibold text-secondary uppercase tracking-wider">Method</th>
                  <th className="px-6 py-4 text-caption font-semibold text-secondary uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-caption font-semibold text-secondary uppercase tracking-wider text-right">Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {payments.map((tx) => (
                  <tr key={tx.id} className="hover:bg-surface/30 transition-colors group">
                    <td className="px-6 py-4 text-body-sm text-secondary">
                      {new Date(tx.date).toLocaleDateString('en-GB', {day: '2-digit', month: 'short', year: 'numeric'})}
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs bg-surface border border-border px-2 py-1 rounded-md text-primary">
                        {tx.bookingId.substring(0,8).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-body-sm text-primary font-medium">
                      Booking: {tx.vehicle}
                    </td>
                    <td className="px-6 py-4 text-body-sm text-secondary">
                      {tx.method}
                    </td>
                    <td className="px-6 py-4 text-body-sm font-semibold text-primary">
                      ${tx.amount.toLocaleString('en-US')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-muted hover:text-accent transition-colors rounded-full hover:bg-accent/10 inline-flex">
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex items-start gap-3 p-4 rounded-xl bg-surface border border-border mt-8">
        <AlertCircle className="w-5 h-5 text-muted shrink-0 mt-0.5" />
        <p className="text-sm text-secondary">
          Invoices are generated automatically after a successful payment capture. For any billing discrepancies, please contact Luxoria Premium Support within 7 days of the transaction.
        </p>
      </div>

    </motion.div>
  );
}
