'use client';

const colors = {
  primary: '#9E1B18',
  primaryLight: '#FFF0EF',
  textDark: '#2D2D2D',
  textMuted: '#6B5C4A',
  border: '#E8E0D4',
};

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, purchaseName }) {
  if (!isOpen) return null;

  return (
    <>
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={onClose}
      >
        <div
          style={{
            background: '#fff',
            borderRadius: '20px',
            width: '90%',
            maxWidth: '320px',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>⚠️</div>
            <h3 style={{ margin: '0 0 8px', fontSize: '18px', fontWeight: 700, color: colors.textDark }}>
              Delete Purchase?
            </h3>
            <p style={{ margin: 0, fontSize: '13px', color: colors.textMuted }}>
              Are you sure you want to delete purchase from <strong>{purchaseName}</strong>? This action cannot be undone.
            </p>
          </div>
          <div style={{ display: 'flex', borderTop: `1px solid ${colors.border}` }}>
            <button
              onClick={onClose}
              style={{
                flex: 1,
                padding: '14px',
                border: 'none',
                background: '#f5f5f5',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                color: colors.textMuted,
              }}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              style={{
                flex: 1,
                padding: '14px',
                border: 'none',
                background: colors.primary,
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                color: '#fff',
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}