'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePurchases } from '@/hook/usePurchases';
import PurchaseCard from '@/components/PurchaseCard';

const colors = {
  primary: '#9E1B18',
  primaryDark: '#7A1412',
  accent: '#C5A059',
  creamBg: '#F9F7F2',
  textDark: '#2D2D2D',
  textMuted: '#6B5C4A',
  border: '#E8E0D4',
};

export default function PurchasesPage() {
  const { purchases, loading, deletePurchase } = usePurchases();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCrop, setFilterCrop] = useState('all');

  const filteredPurchases = purchases.filter(purchase => {
    const matchesSearch = purchase.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (purchase.mobile && purchase.mobile.includes(searchTerm));
    const matchesCrop = filterCrop === 'all' || purchase.crop === filterCrop;
    return matchesSearch && matchesCrop;
  });

  const totalAmount = filteredPurchases.reduce((sum, p) => sum + p.total, 0);
  const totalPaid = filteredPurchases.reduce((sum, p) => sum + p.paid, 0);
  const totalPending = filteredPurchases.reduce((sum, p) => sum + p.pending, 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500&family=DM+Sans:wght@400;500;600;700;800&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        .purchases-page {
          min-height: 100vh;
          background: ${colors.creamBg};
          font-family: 'DM Sans', sans-serif;
          padding-bottom: 40px;
        }
        
        .container {
          max-width: 500px;
          margin: 0 auto;
          padding: 0 16px;
        }
      `}</style>

      <div className="purchases-page">
        {/* Header */}
        <div style={{
          background: colors.creamBg,
          padding: '16px 16px 12px',
          borderBottom: `2px solid ${colors.accent}`,
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '20px',
                fontWeight: 700,
                color: colors.primary,
                margin: 0,
              }}>
                Mirchi Mart
              </h1>
            </Link>
            <Link href="/new-purchase">
              <button style={{
                background: colors.primary,
                color: '#fff',
                border: 'none',
                borderRadius: '40px',
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                + New Purchase
              </button>
            </Link>
          </div>

          <h2 style={{
            fontSize: '24px',
            fontWeight: 800,
            color: colors.textDark,
            marginBottom: '4px',
          }}>
            Purchase History
          </h2>
          <p style={{ fontSize: '13px', color: colors.textMuted, marginBottom: '16px' }}>
            All purchase records
          </p>

          {/* Search */}
          <div style={{ marginBottom: '12px' }}>
            <input
              type="text"
              placeholder="🔍 Search by name, mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: `1.5px solid ${colors.border}`,
                borderRadius: '40px',
                fontSize: '14px',
                fontFamily: 'DM Sans',
                outline: 'none',
                background: '#fff',
              }}
            />
          </div>

          {/* Filter chips */}
          <div style={{ display: 'flex', gap: '8px' }}>
            {['all', 'mirchi', 'cotton'].map(crop => (
              <button
                key={crop}
                onClick={() => setFilterCrop(crop)}
                style={{
                  padding: '6px 16px',
                  borderRadius: '30px',
                  border: `1.5px solid ${filterCrop === crop ? colors.primary : colors.border}`,
                  background: filterCrop === crop ? colors.primaryLight : '#fff',
                  color: filterCrop === crop ? colors.primary : colors.textMuted,
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                }}
              >
                {crop === 'all' ? 'All' : `🌾 ${crop}`}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="container" style={{ marginTop: '16px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '12px',
            marginBottom: '20px',
          }}>
            <div style={{
              background: '#fff',
              borderRadius: '14px',
              padding: '12px',
              textAlign: 'center',
              border: `1px solid ${colors.border}`,
            }}>
              <div style={{ fontSize: '11px', color: colors.textMuted, textTransform: 'uppercase', fontWeight: 600 }}>Total</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: colors.textDark }}>₹{totalAmount.toLocaleString('en-IN')}</div>
            </div>
            <div style={{
              background: '#fff',
              borderRadius: '14px',
              padding: '12px',
              textAlign: 'center',
              border: `1px solid ${colors.border}`,
            }}>
              <div style={{ fontSize: '11px', color: colors.textMuted, textTransform: 'uppercase', fontWeight: 600 }}>Paid</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#2D6A4F' }}>₹{totalPaid.toLocaleString('en-IN')}</div>
            </div>
            <div style={{
              background: '#fff',
              borderRadius: '14px',
              padding: '12px',
              textAlign: 'center',
              border: `1px solid ${colors.border}`,
            }}>
              <div style={{ fontSize: '11px', color: colors.textMuted, textTransform: 'uppercase', fontWeight: 600 }}>Pending</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#B45309' }}>₹{totalPending.toLocaleString('en-IN')}</div>
            </div>
          </div>
        </div>

        {/* Purchase List */}
        <div className="container">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 20px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                border: `3px solid ${colors.border}`,
                borderTopColor: colors.primary,
                borderRadius: '50%',
                margin: '0 auto 16px',
                animation: 'spin 0.8s linear infinite',
              }} />
              <p style={{ color: colors.textMuted }}>Loading purchases...</p>
            </div>
          ) : filteredPurchases.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              background: '#fff',
              borderRadius: '20px',
              border: `1px solid ${colors.border}`,
            }}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>📭</div>
              <p style={{ color: colors.textMuted, marginBottom: '16px' }}>No purchases found</p>
              <Link href="/new-purchase">
                <button style={{
                  background: colors.primary,
                  color: '#fff',
                  border: 'none',
                  borderRadius: '40px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}>
                  Create First Purchase
                </button>
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {filteredPurchases.map(purchase => (
                <PurchaseCard
                  key={purchase.id}
                  purchase={purchase}
                  onDelete={deletePurchase}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}