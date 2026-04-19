'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hook/useAuth';
import { usePurchases } from '@/hook/usePurchases';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const colors = {
  primary: '#9E1B18',
  primaryLight: '#FFF0EF',
  accent: '#C5A059',
  creamBg: '#F9F7F2',
  textDark: '#2D2D2D',
  textMuted: '#6B5C4A',
  border: '#E8E0D4',
  success: '#2D6A4F',
  successLight: '#E7F7EE',
  warning: '#B45309',
  warningLight: '#FFF4E5',
};

export default function PurchaseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { getToken } = useAuth();
  const { deletePurchase } = usePurchases();
  const [purchase, setPurchase] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchPurchase();
  }, [id]);

  const fetchPurchase = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const response = await fetch(`${BASE_URL}api/purchases/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.success) {
        setPurchase(data.data);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const success = await deletePurchase(id);
    if (success) {
      router.push('/purchases');
    }
  };

  const modeIcon = { cash: '💵', upi: '📱', bank: '🏦' };
  const today = new Date().toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: colors.creamBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>
          <div style={{
            width: '40px',
            height: '40px',
            border: `3px solid ${colors.border}`,
            borderTopColor: colors.primary,
            borderRadius: '50%',
            margin: '0 auto 16px',
            animation: 'spin 0.8s linear infinite',
          }} />
          <p style={{ color: colors.textMuted }}>Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (!purchase) {
    return (
      <div style={{ minHeight: '100vh', background: colors.creamBg, padding: '40px 20px', textAlign: 'center' }}>
        <p>Purchase not found</p>
        <Link href="/purchases">
          <button style={{ background: colors.primary, color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', marginTop: '16px', cursor: 'pointer' }}>
            Back to Purchases
          </button>
        </Link>
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ minHeight: '100vh', background: colors.creamBg, fontFamily: "'DM Sans', sans-serif", paddingBottom: '100px' }}>

        {/* Header */}
        <div style={{
          background: colors.creamBg,
          padding: '14px 16px',
          borderBottom: `2px solid ${colors.accent}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}>
          <Link href="/purchases" style={{ textDecoration: 'none', color: colors.primary, fontSize: '24px' }}>←</Link>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', fontWeight: 700, color: colors.primary, margin: 0 }}>
            Mirchi Mart
          </h1>
          <button
            onClick={() => setShowDeleteModal(true)}
            style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer' }}
          >
            🗑️
          </button>
        </div>

        {/* Invoice */}
        <div style={{ maxWidth: '430px', margin: '0 auto', padding: '12px' }}>
          <div style={{
            background: '#fff',
            borderRadius: '20px',
            border: `1px solid ${colors.border}`,
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
          }}>
            {/* Jai Shree Ram */}
            <div style={{ background: colors.primary, padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.25)' }} />
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '14px', fontStyle: 'italic', fontWeight: 600, color: '#fff', letterSpacing: '0.1em' }}>
                🙏 Jai Shree Ram 🙏
              </span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.25)' }} />
            </div>

            {/* Header */}
            <div style={{ padding: '16px 18px 14px', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>🌶️</div>
                <div>
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '16px', fontWeight: 800, color: colors.primary }}>Mirchi Mart</div>
                  <div style={{ fontSize: '11px', color: colors.textMuted }}>Wholesale Traders</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: colors.primary, background: colors.primaryLight, padding: '3px 10px', borderRadius: '20px', display: 'inline-block' }}>
                  {purchase.invoice_number}
                </div>
                <div style={{ fontSize: '11px', color: colors.textMuted, marginTop: '4px' }}>{today}</div>
              </div>
            </div>

            {/* Customer */}
            <div style={{ padding: '12px 16px', background: colors.creamBg, borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: colors.textDark }}>{purchase.customer.name}</div>
                <div style={{ fontSize: '12px', color: colors.textMuted, marginTop: '2px' }}>📞 {purchase.customer.mobile || '—'}</div>
              </div>
              <div style={{
                padding: '5px 14px',
                borderRadius: '30px',
                fontSize: '11px',
                fontWeight: 800,
                background: purchase.payment.status === 'paid' ? colors.successLight : colors.warningLight,
                color: purchase.payment.status === 'paid' ? colors.success : colors.warning,
              }}>
                {purchase.payment.status === 'paid' ? 'Paid' : purchase.payment.status === 'partial' ? 'Partial' : 'Pending'}
              </div>
            </div>

            {/* Meta */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: `1px solid ${colors.border}` }}>
              {[
                { k: 'Crop', v: purchase.crop },
                { k: 'Price / kg', v: `₹${purchase.price_per_kg}` },
                { k: 'Total Bags', v: purchase.totals.total_bags },
                { k: 'Gross Weight', v: `${purchase.totals.gross_weight} kg` },
                { k: 'Total Deduction', v: `−${purchase.totals.total_deduction} kg` },
                { k: 'Net Weight', v: `${purchase.totals.net_weight} kg` },
              ].map((item, i) => (
                <div key={i} style={{ padding: '12px 16px', borderRight: i % 2 === 0 ? `1px solid ${colors.border}` : 'none' }}>
                  <div style={{ fontSize: '10px', fontWeight: 800, color: colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.k}</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: colors.textDark, marginTop: '3px' }}>{item.v}</div>
                </div>
              ))}
            </div>

            {/* Bag Table */}
            <div style={{ padding: '12px 16px 6px', fontSize: '11px', fontWeight: 800, color: colors.textMuted, textTransform: 'uppercase' }}>Bag-wise Details</div>
            <div style={{ padding: '0 14px', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '280px', fontSize: '12px' }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '8px', color: colors.textMuted, fontWeight: 800 }}>Bag</th>
                    <th style={{ textAlign: 'right', padding: '8px', color: colors.textMuted, fontWeight: 800 }}>Gross</th>
                    <th style={{ textAlign: 'right', padding: '8px', color: colors.textMuted, fontWeight: 800 }}>Deduction</th>
                    <th style={{ textAlign: 'right', padding: '8px', color: colors.textMuted, fontWeight: 800 }}>Net</th>
                  </tr>
                </thead>
                <tbody>
                  {purchase.bags.map((bag, i) => (
                    <tr key={i}>
                      <td style={{ padding: '8px', textAlign: 'left', color: colors.textMuted, fontWeight: 600 }}>Bag {bag.bag_number}</td>
                      <td style={{ padding: '8px', textAlign: 'right' }}>{bag.gross_weight}</td>
                      <td style={{ padding: '8px', textAlign: 'right', color: colors.primary, fontWeight: 700 }}>−{bag.deduction}</td>
                      <td style={{ padding: '8px', textAlign: 'right', color: colors.success, fontWeight: 800 }}>{bag.net_weight}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td style={{ padding: '10px 8px', fontWeight: 800, borderTop: `1.5px solid ${colors.border}` }}>Total</td>
                    <td style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 800, borderTop: `1.5px solid ${colors.border}` }}>{purchase.totals.gross_weight}</td>
                    <td style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 800, borderTop: `1.5px solid ${colors.border}`, color: colors.primary }}>−{purchase.totals.total_deduction}</td>
                    <td style={{ padding: '10px 8px', textAlign: 'right', fontWeight: 800, borderTop: `1.5px solid ${colors.border}`, color: colors.success }}>{purchase.totals.net_weight}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Total Amount */}
            <div style={{ margin: '12px 14px', background: colors.primary, borderRadius: '16px', padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Total Amount</span>
              <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', fontWeight: 800, color: '#fff' }}>₹{purchase.totals.total_amount.toLocaleString('en-IN')}</span>
            </div>

            {/* Paid / Pending */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '0 14px 16px' }}>
              <div style={{ background: colors.successLight, borderRadius: '14px', padding: '14px 16px' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: '#2D6A4F' }}>Paid</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: colors.success }}>₹{purchase.payment.paid.toLocaleString('en-IN')}</div>
              </div>
              <div style={{ background: colors.warningLight, borderRadius: '14px', padding: '14px 16px' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', color: '#B45309' }}>Pending</div>
                <div style={{ fontSize: '20px', fontWeight: 800, color: colors.warning }}>₹{purchase.payment.pending.toLocaleString('en-IN')}</div>
              </div>
            </div>

            {/* Payment History */}
            {purchase.payment.history && purchase.payment.history.length > 0 && (
              <div style={{ margin: '0 14px 16px', borderRadius: '14px', overflow: 'hidden', border: `1px solid ${colors.border}` }}>
                <div style={{ padding: '8px 14px', background: colors.creamBg, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', fontSize: '10px', fontWeight: 800, color: colors.textMuted, textTransform: 'uppercase' }}>
                  <span>Date</span><span>Mode</span><span style={{ textAlign: 'right' }}>Amount</span>
                </div>
                {purchase.payment.history.map((payment, i) => (
                  <div key={i} style={{ padding: '10px 14px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', fontSize: '13px', borderTop: `1px solid ${colors.border}` }}>
                    <span>{new Date(payment.date).toLocaleDateString('en-IN')}</span>
                    <span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, color: colors.success, background: colors.successLight, borderRadius: '6px', padding: '3px 9px' }}>
                        {modeIcon[payment.mode] || '💵'} {payment.mode?.toUpperCase()}
                      </span>
                    </span>
                    <span style={{ textAlign: 'right', fontWeight: 800 }}>₹{payment.amount.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Footer */}
            <div style={{ padding: '12px 16px 16px', textAlign: 'center', fontSize: '12px', color: colors.textMuted, borderTop: `1px dotted ${colors.border}` }}>
              <strong style={{ color: colors.primary }}>Thank you for your business!</strong> 🌶️
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#fff', borderRadius: '20px', width: '90%', maxWidth: '320px', overflow: 'hidden' }}>
            <div style={{ padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>⚠️</div>
              <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 700, color: colors.textDark }}>Delete Purchase?</h3>
              <p style={{ margin: 0, fontSize: '13px', color: colors.textMuted }}>This action cannot be undone.</p>
            </div>
            <div style={{ display: 'flex', borderTop: `1px solid ${colors.border}` }}>
              <button onClick={() => setShowDeleteModal(false)} style={{ flex: 1, padding: '14px', border: 'none', background: '#f5f5f5', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleDelete} style={{ flex: 1, padding: '14px', border: 'none', background: colors.primary, fontSize: '14px', fontWeight: 600, cursor: 'pointer', color: '#fff' }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}