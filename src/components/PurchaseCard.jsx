'use client';

import { useState } from 'react';
import Link from 'next/link';
import DeleteConfirmModal from './DeleteConfirmModal';

const colors = {
  primary: '#9E1B18',
  primaryLight: '#FFF0EF',
  accent: '#C5A059',
  textDark: '#2D2D2D',
  textMuted: '#6B5C4A',
  border: '#E8E0D4',
  success: '#2D6A4F',
  successLight: '#E7F7EE',
  warning: '#B45309',
  warningLight: '#FFF4E5',
  creamBg: '#F9F7F2',
};

export default function PurchaseCard({ purchase, onDelete }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const getStatusBadge = (status) => {
    if (status === 'paid') {
      return { bg: colors.successLight, color: colors.success, text: 'Paid' };
    } else if (status === 'partial') {
      return { bg: colors.warningLight, color: colors.warning, text: 'Partial' };
    }
    return { bg: '#F0E8DE', color: colors.textMuted, text: 'Pending' };
  };

  const statusBadge = getStatusBadge(purchase.status);

  return (
    <>
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          border: `1px solid ${colors.border}`,
          overflow: 'hidden',
          transition: 'all 0.2s ease',
          cursor: 'pointer',
        }}
        className="purchase-card"
      >
        <Link href={`/purchase/${purchase.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
          <div style={{ padding: '16px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: colors.textDark }}>
                  {purchase.customer}
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '12px', color: colors.textMuted }}>
                  📞 {purchase.mobile || '—'}
                </p>
              </div>
              <div
                style={{
                  background: statusBadge.bg,
                  color: statusBadge.color,
                  padding: '4px 12px',
                  borderRadius: '30px',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}
              >
                {statusBadge.text}
              </div>
            </div>

            {/* Amount */}
            <div style={{ marginBottom: '12px' }}>
              <span style={{ fontSize: '24px', fontWeight: 800, color: colors.primary }}>
                ₹{purchase.total.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Details */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '12px', color: colors.textMuted, borderTop: `1px solid ${colors.border}`, paddingTop: '12px' }}>
              <span>🌾 {purchase.crop}</span>
              <span>📦 {purchase.bags} bag{purchase.bags !== 1 ? 's' : ''}</span>
              <span>⚖️ {purchase.net_weight} kg</span>
              <span>📅 {new Date(purchase.date).toLocaleDateString('en-IN')}</span>
            </div>

            {/* Payment split */}
            <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '12px' }}>
              <div>
                <span style={{ color: colors.textMuted }}>Paid: </span>
                <span style={{ fontWeight: 600, color: colors.success }}>₹{purchase.paid.toLocaleString('en-IN')}</span>
              </div>
              <div>
                <span style={{ color: colors.textMuted }}>Pending: </span>
                <span style={{ fontWeight: 600, color: colors.warning }}>₹{purchase.pending.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </Link>

        {/* Delete Button */}
        <div
          style={{
            padding: '12px 16px',
            borderTop: `1px solid ${colors.border}`,
            background: colors.creamBg,
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowDeleteModal(true);
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: colors.primary,
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = colors.primaryLight}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            🗑️ Delete
          </button>
        </div>
      </div>

      <style jsx>{`
        .purchase-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(158, 27, 24, 0.08);
        }
      `}</style>

      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          onDelete(purchase.id);
          setShowDeleteModal(false);
        }}
        purchaseName={purchase.customer}
      />
    </>
  );
}