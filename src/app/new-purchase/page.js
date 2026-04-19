'use client';

import { useState } from 'react';
import { useNewPurchase } from "@/hook/useCreatePurchase";

export default function New() {
  const {
    name, setName,
    mobile, setMobile,
    crop, setCrop,
    type, setType,
    price, setPrice,
    range1, setRange1,
    range2, setRange2,
    range3, setRange3,
    bags,
    handleWeightChange,
    addBag,
    amountPaid, setAmountPaid,
    paymentMode, setPaymentMode,
    preview,
    handlePreview,
    handleSave,
  } = useNewPurchase();

  const [previewLoading, setPreviewLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [showBill, setShowBill] = useState(false);

  const totalGross     = bags.reduce((s, b) => s + (parseFloat(b.weight) || 0), 0);
  const totalNet       = bags.reduce((s, b) => s + (parseFloat(b.netWeight) || 0), 0);
  const totalDeduction = totalGross - totalNet;
  const totalAmt       = totalNet * (parseFloat(price) || 0);
  const hasBagData     = bags.some(b => parseFloat(b.weight) > 0);

  const onPreview = async () => {
    setPreviewLoading(true);
    setShowBill(false);
    try {
      await handlePreview();
      setShowBill(true);
      setTimeout(() => {
        document.getElementById('bill-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 120);
    } finally {
      setPreviewLoading(false);
    }
  };

  const onSave = async () => {
    setSaveLoading(true);
    try {
      await handleSave();
    } finally {
      setSaveLoading(false);
    }
  };

  const fmt = (n) =>
    Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });

  const today = new Date().toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });

  const modeIcon = { cash: '💵', upi: '📱', bank: '🏦' };

  // Refined color palette
  const colors = {
    primary: '#9E1B18',      // Deep Crimson
    primaryDark: '#7A1412',  // Darker Crimson
    primaryLight: '#FFF0EF', // Light red background
    accent: '#C5A059',       // Gold accent
    creamBg: '#F9F7F2',      // Warm cream background
    cardBg: '#FFFFFF',
    textDark: '#2D2D2D',
    textMuted: '#6B5C4A',
    border: '#E8E0D4',
    success: '#2D6A4F',
    successLight: '#E7F7EE',
    warning: '#B45309',
    warningLight: '#FFF4E5',
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500&family=DM+Sans:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

        .np {
          min-height: 100vh;
          background: ${colors.creamBg};
          font-family: 'DM Sans', sans-serif;
          padding-bottom: 150px;
        }

        /* ── TOP BAR (CREAM COLOR WITH GOLD ACCENT) ── */
        .np-top {
          position: sticky; top: 0; z-index: 40;
          background: ${colors.creamBg};
          padding: 14px 16px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px;
          border-bottom: 2px solid ${colors.accent};
        }
        .np-top-title h1 {
          font-family: 'Playfair Display', serif;
          font-size: 18px; font-weight: 700; color: ${colors.primary}; margin: 0;
        }
        .np-top-title p { 
          font-size: 11px; color: ${colors.textMuted}; margin: 2px 0 0; 
          display: none;
        }
        .np-pill {
          background: ${colors.primary};
          border-radius: 40px;
          padding: 8px 18px;
          text-align: right;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(158, 27, 24, 0.2);
        }
        .np-pill .pl { 
          font-size: 10px; 
          color: rgba(255,255,255,0.7); 
          letter-spacing: 0.06em; 
          text-transform: uppercase; 
        }
        .np-pill .pv {
          font-family: 'Playfair Display', serif;
          font-size: 18px; font-weight: 700; color: #fff; line-height: 1.2;
        }

        /* ── CARD ── */
        .np-card {
          background: ${colors.cardBg};
          border-radius: 16px;
          margin: 12px 12px 0;
          border: 1px solid ${colors.border};
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.02);
          transition: box-shadow 0.2s ease;
        }
        .np-card:hover {
          box-shadow: 0 4px 12px rgba(158, 27, 24, 0.06);
        }
        .np-card-head {
          padding: 12px 16px;
          border-bottom: 1px solid ${colors.border};
          display: flex; align-items: center; gap: 10px;
          background: #FDFCF9;
        }
        .np-dot { 
          width: 8px; 
          height: 8px; 
          border-radius: 50%; 
          flex-shrink: 0; 
          background: ${colors.accent};
        }
        .np-card-head h2 {
          font-size: 11px; font-weight: 700; color: ${colors.textMuted};
          text-transform: uppercase; letter-spacing: 0.07em; margin: 0;
        }
        .np-card-head .cnt {
          margin-left: auto;
          background: ${colors.creamBg};
          border-radius: 20px;
          padding: 3px 10px; font-size: 11px; color: ${colors.textMuted}; font-weight: 600;
        }
        .np-body { padding: 16px; }

        /* ── FIELDS ── */
        .np-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .np-field { display: flex; flex-direction: column; gap: 5px; }
        .np-field label {
          font-size: 10px; font-weight: 700; color: ${colors.textMuted};
          text-transform: uppercase; letter-spacing: 0.06em;
        }
        .np-field label em { color: ${colors.primary}; font-style: normal; }
        .np-inp, .np-sel {
          width: 100%; padding: 11px 14px;
          border: 1.5px solid ${colors.border}; border-radius: 12px;
          font-family: 'DM Sans'; font-size: 14px; color: ${colors.textDark};
          background: #fff; outline: none;
          transition: all 0.2s ease;
        }
        .np-inp::placeholder { color: #C4B8A8; }
        .np-inp:focus, .np-sel:focus {
          border-color: ${colors.accent};
          box-shadow: 0 0 0 3px rgba(197, 160, 89, 0.15);
          background: #fff;
        }
        .np-sel {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M0 0l6 8 6-8z' fill='%239E1B18'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 36px; cursor: pointer;
        }
        .np-grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }

        /* ── BAG TABLE LAYOUT ── */
        .np-bag-cols {
          display: grid;
          grid-template-columns: 36px 1fr 56px 66px;
          gap: 10px;
          padding: 0 12px 8px;
          font-size: 10px; font-weight: 700; color: ${colors.textMuted};
          text-transform: uppercase; letter-spacing: 0.05em;
        }
        .np-bag-cols span:nth-child(3) { text-align: center; }
        .np-bag-cols span:last-child { text-align: right; }

        .np-bag-row {
          display: grid;
          grid-template-columns: 36px 1fr 56px 66px;
          align-items: center; gap: 10px;
          padding: 10px 12px;
          background: #FDFCF9;
          border: 1.5px solid ${colors.border};
          border-radius: 12px;
          margin-bottom: 8px;
          transition: all 0.2s ease;
        }
        .np-bag-row:focus-within { border-color: ${colors.accent}; background: #fff; }

        .np-bnum {
          width: 36px; height: 36px; border-radius: 10px;
          background: ${colors.primary}; color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700; flex-shrink: 0;
        }
        .np-bwt {
          width: 100%; padding: 10px 10px;
          border: 1.5px solid ${colors.border}; border-radius: 10px;
          font-family: 'DM Sans'; font-size: 14px; color: ${colors.textDark};
          background: #fff; outline: none;
          transition: all 0.2s ease;
        }
        .np-bwt:focus { border-color: ${colors.accent}; }
        .np-bwt::placeholder { color: #C4B8A8; font-size: 12px; }
        .np-bded {
          text-align: center; font-size: 13px; font-weight: 700; color: ${colors.primary};
          background: ${colors.primaryLight}; border-radius: 8px; padding: 8px 4px;
        }
        .np-bnet { text-align: right; }
        .np-bnet .nv { font-size: 14px; font-weight: 800; color: ${colors.success}; }
        .np-bnet .nu { font-size: 10px; color: #7A9E8A; }

        .np-add-btn {
          width: 100%; margin-top: 4px;
          padding: 12px;
          border: 1.5px dashed ${colors.border}; border-radius: 12px;
          background: transparent; cursor: pointer;
          font-family: 'DM Sans'; font-size: 13px; font-weight: 600; color: ${colors.textMuted};
          transition: all 0.2s ease;
        }
        .np-add-btn:hover { 
          border-color: ${colors.accent}; 
          color: ${colors.primary}; 
          background: ${colors.primaryLight};
        }

        /* bag summary */
        .np-bag-sum {
          display: grid; grid-template-columns: 1fr 1fr 1fr;
          gap: 8px; margin-top: 14px; padding-top: 14px;
          border-top: 1px solid ${colors.border};
        }
        .np-bsi { text-align: center; }
        .np-bsi .bsv { font-size: 16px; font-weight: 800; color: ${colors.textDark}; }
        .np-bsi .bsv.r { color: ${colors.primary}; }
        .np-bsi .bsv.g { color: ${colors.success}; }
        .np-bsi .bsk { font-size: 10px; color: ${colors.textMuted}; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2px; }

        /* ── PAYMENT MODE ── */
        .np-mode-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin-top: 14px; }
        .np-mbtn {
          padding: 12px 6px;
          border: 1.5px solid ${colors.border}; border-radius: 12px;
          background: #FDFCF9; cursor: pointer;
          font-family: 'DM Sans'; font-size: 13px; font-weight: 600; color: ${colors.textMuted};
          text-align: center; transition: all 0.2s ease;
        }
        .np-mbtn .mico { font-size: 20px; display: block; margin-bottom: 4px; }
        .np-mbtn.active { 
          border-color: ${colors.primary}; 
          background: ${colors.primaryLight}; 
          color: ${colors.primary}; 
        }

        /* ── BOTTOM BAR ── */
        .np-bar {
          position: fixed;
          bottom: calc(70px + env(safe-area-inset-bottom));
          border-top: 1px solid ${colors.border};
          padding: 10px 16px;
          padding-bottom: max(14px, env(safe-area-inset-bottom));
          display: flex;
          gap: 14px;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 430px;
          z-index: 40;
          background: ${colors.creamBg};
        }
        .np-bprev {
          flex: 1;
          padding: 10px 12px;
          border: 1.5px solid ${colors.primary};
          border-radius: 40px;
          background: #fff;
          color: ${colors.primary};
          font-family: 'DM Sans';
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .np-bprev:hover { 
          background: ${colors.primaryLight}; 
          transform: scale(0.97);
          border-color: ${colors.primaryDark};
        }
        .np-bsave {
          flex: 1;
          padding: 10px 12px;
          background: ${colors.primary};
          color: #fff;
          border: none;
          border-radius: 40px;
          font-family: 'DM Sans';
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 3px 8px rgba(158, 27, 24, 0.3);
        }
        .np-bsave:hover { 
          background: ${colors.primaryDark}; 
          transform: scale(0.97);
          box-shadow: 0 2px 6px rgba(158, 27, 24, 0.4);
        }
        .np-bprev:active, .np-bsave:active { transform: scale(0.96); }
        .np-bprev:disabled, .np-bsave:disabled { opacity: 0.5; pointer-events: none; }

        /* spinner */
        .spin {
          width: 16px; height: 16px; border-radius: 50%; flex-shrink: 0;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          animation: rotating 0.6s linear infinite;
        }
        .spin-r { border-color: rgba(158,27,24,0.25); border-top-color: ${colors.primary}; }
        @keyframes rotating { to { transform: rotate(360deg); } }

        /* ═══════════════════════════════════
           BILL PREVIEW (refined colors)
        ═══════════════════════════════════ */
        .np-bill {
          margin: 14px 12px 0;
          background: #fff;
          border-radius: 20px;
          border: 1px solid ${colors.border};
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0,0,0,0.04);
        }

        .jsr {
          background: ${colors.primary};
          padding: 10px 16px;
          display: flex; align-items: center; justify-content: center; gap: 12px;
        }
        .jsr-line { flex: 1; height: 1px; background: rgba(255,255,255,0.25); }
        .jsr span {
          font-family: 'Playfair Display', serif;
          font-size: 14px; font-style: italic; font-weight: 600;
          color: #fff; letter-spacing: 0.1em; white-space: nowrap;
        }

        .bill-head {
          padding: 16px 18px 14px;
          border-bottom: 1px solid ${colors.border};
          display: flex; justify-content: space-between; align-items: center; gap: 12px;
        }
        .bill-brand { display: flex; align-items: center; gap: 12px; }
        .bill-logo {
          width: 44px; height: 44px; border-radius: 12px;
          background: ${colors.primary};
          display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0;
        }
        .bill-bname {
          font-family: 'Playfair Display', serif;
          font-size: 16px; font-weight: 800; color: ${colors.primary};
        }
        .bill-bsub { font-size: 11px; color: ${colors.textMuted}; }
        .bill-inv { text-align: right; }
        .bill-inv .ino { 
          font-size: 12px; font-weight: 800; color: ${colors.primary};
          background: ${colors.primaryLight}; padding: 3px 10px; border-radius: 20px;
          display: inline-block;
        }
        .bill-inv .idt { font-size: 11px; color: ${colors.textMuted}; margin-top: 4px; }

        .bill-cust {
          padding: 12px 16px;
          background: ${colors.creamBg};
          border-bottom: 1px solid ${colors.border};
          display: flex; justify-content: space-between; align-items: center; gap: 12px;
        }
        .bill-cname { font-size: 16px; font-weight: 800; color: ${colors.textDark}; }
        .bill-cmob { font-size: 12px; color: ${colors.textMuted}; margin-top: 2px; }
        .bill-status {
          padding: 5px 14px; border-radius: 30px;
          font-size: 11px; font-weight: 800; white-space: nowrap; flex-shrink: 0;
        }
        .st-part { background: ${colors.warningLight}; color: ${colors.warning}; }
        .st-paid { background: ${colors.successLight}; color: ${colors.success}; }

        .bill-meta {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 0; border-bottom: 1px solid ${colors.border};
        }
        .bill-meta-item {
          padding: 12px 16px;
          border-right: 1px solid ${colors.border};
        }
        .bill-meta-item:nth-child(even) { border-right: none; }
        .bill-meta-item .mk { 
          font-size: 10px; font-weight: 800; color: ${colors.textMuted}; 
          text-transform: uppercase; letter-spacing: 0.06em; 
        }
        .bill-meta-item .mv { font-size: 13px; font-weight: 700; color: ${colors.textDark}; margin-top: 3px; }

        .bill-tbl-label {
          padding: 12px 16px 6px;
          font-size: 11px; font-weight: 800; color: ${colors.textMuted};
          text-transform: uppercase; letter-spacing: 0.08em;
        }
        .bill-tbl-wrap { padding: 0 14px; overflow-x: auto; }
        .bill-tbl {
          width: 100%; border-collapse: collapse;
          min-width: 280px; font-size: 12px;
        }
        .bill-tbl thead th {
          padding: 10px 8px 8px;
          color: ${colors.textMuted}; font-weight: 800; font-size: 10px;
          text-transform: uppercase; letter-spacing: 0.06em;
          text-align: right; border-bottom: 1px solid ${colors.border};
        }
        .bill-tbl thead th:first-child { text-align: left; }
        .bill-tbl tbody td { padding: 10px 8px; text-align: right; color: ${colors.textDark}; }
        .bill-tbl tbody td:first-child { text-align: left; color: ${colors.textMuted}; font-weight: 600; }
        .bill-tbl tbody tr:not(:last-child) td { border-bottom: 1px dotted #F0E8DE; }
        .tc-ded { color: ${colors.primary} !important; font-weight: 700; }
        .tc-net { color: ${colors.success} !important; font-weight: 800; }
        .bill-tbl tfoot td {
          padding: 12px 8px 10px; font-weight: 800;
          border-top: 1.5px solid ${colors.border}; color: ${colors.textDark};
        }
        .bill-tbl tfoot td:first-child { color: ${colors.textMuted}; }

        .bill-total {
          margin: 12px 14px;
          background: ${colors.primary};
          border-radius: 16px;
          padding: 14px 20px;
          display: flex; justify-content: space-between; align-items: center;
        }
        .bill-total .btl { 
          font-size: 11px; 
          color: rgba(255,255,255,0.7); 
          text-transform: uppercase; 
          letter-spacing: 0.08em;
          font-weight: 600;
        }
        .bill-total .btv {
          font-family: 'Playfair Display', serif;
          font-size: 26px; font-weight: 800; color: #fff;
        }

        .bill-pp { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 0 14px 16px; }
        .bill-pp-box { border-radius: 14px; padding: 14px 16px; }
        .bill-pp-box .ppk { 
          font-size: 10px; font-weight: 800; text-transform: uppercase; 
          letter-spacing: 0.08em; margin-bottom: 6px; 
        }
        .bill-pp-box .ppv { font-size: 20px; font-weight: 800; }
        .pp-paid { background: ${colors.successLight}; }
        .pp-paid .ppk { color: #2D6A4F; }
        .pp-paid .ppv { color: ${colors.success}; }
        .pp-pend { background: ${colors.warningLight}; }
        .pp-pend .ppk { color: #B45309; }
        .pp-pend .ppv { color: ${colors.warning}; }

        .bill-hist {
          margin: 0 14px 16px;
          border-radius: 14px; overflow: hidden;
          border: 1px solid ${colors.border};
        }
        .bill-hist-hd {
          padding: 8px 14px;
          background: ${colors.creamBg};
          display: grid; grid-template-columns: 1fr 1fr 1fr;
          font-size: 10px; font-weight: 800; color: ${colors.textMuted};
          text-transform: uppercase; letter-spacing: 0.06em;
        }
        .bill-hist-hd span:last-child { text-align: right; }
        .bill-hist-row {
          padding: 10px 14px;
          display: grid; grid-template-columns: 1fr 1fr 1fr;
          font-size: 13px; color: ${colors.textDark};
          border-top: 1px solid ${colors.border};
        }
        .mbadge {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 11px; font-weight: 700; color: ${colors.success};
          background: ${colors.successLight}; border-radius: 6px; padding: 3px 9px;
        }
        .bill-hist-row .ha { text-align: right; font-weight: 800; color: ${colors.textDark}; }

        .bill-foot {
          padding: 12px 16px 16px;
          text-align: center; font-size: 12px; color: ${colors.textMuted};
          border-top: 1px dotted ${colors.border};
        }
        .bill-foot strong { color: ${colors.primary}; font-weight: 700; }
      `}</style>

      <div className="np">

        {/* ── STICKY TOP BAR WITH CREAM COLOR & GOLD BORDER ── */}
        <div className="np-top">
          <div className="np-top-title">
            <h1>Mirchi Mart</h1>
            <p>New Purchase</p>
          </div>
          <div className="np-pill">
            <div className="pl">Total Bill</div>
            <div className="pv">₹{fmt(totalAmt)}</div>
          </div>
        </div>

        {/* ── 1. FARMER / SUPPLIER ── */}
        <div className="np-card">
          <div className="np-card-head">
            <div className="np-dot" />
            <h2>Farmer / Supplier</h2>
          </div>
          <div className="np-body">
            <div className="np-grid2" style={{marginBottom:12}}>
              <div className="np-field">
                <label>Name <em>*</em></label>
                <input className="np-inp" placeholder="Enter farmer name" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div className="np-field">
                <label>Mobile</label>
                <input className="np-inp" placeholder="9XXXXXXXXX" value={mobile} onChange={e => setMobile(e.target.value)} />
              </div>
            </div>
            <div className="np-grid2">
              <div className="np-field">
                <label>Crop <em>*</em></label>
                <select className="np-sel" value={crop} onChange={e => setCrop(e.target.value)}>
                  <option value="">Select crop</option>
                  <option value="mirchi">🌶️ Mirchi</option>
                  <option value="cotton">🌾 Cotton</option>
                </select>
              </div>
              <div className="np-field">
                <label>Grade / Type <em>*</em></label>
                <input className="np-inp" placeholder="Guntur, Dry Red..." value={type} onChange={e => setType(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* ── 2. PRICING & DEDUCTIONS ── */}
        <div className="np-card">
          <div className="np-card-head">
            <div className="np-dot" />
            <h2>Pricing & Deductions</h2>
          </div>
          <div className="np-body">
            <div className="np-field" style={{marginBottom:14, maxWidth:180}}>
              <label>Price per kg (₹) <em>*</em></label>
              <input className="np-inp" placeholder="0" value={price} onChange={e => setPrice(e.target.value)} />
            </div>
            <div style={{fontSize:'10px', fontWeight:'800', color:colors.primary, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'10px'}}>
              Deduction — kg removed per bag
            </div>
            <div className="np-grid3">
              {[
                {label:'1 – 49 kg',  val:range1, set:setRange1},
                {label:'50 – 99 kg', val:range2, set:setRange2},
                {label:'100+ kg',    val:range3, set:setRange3},
              ].map((d,i) => (
                <div className="np-field" key={i}>
                  <label style={{color:colors.primary}}>{d.label}</label>
                  <input className="np-inp" placeholder="0" value={d.val} onChange={e => d.set(e.target.value)} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 3. BAG ENTRY ── */}
        <div className="np-card">
          <div className="np-card-head">
            <div className="np-dot" />
            <h2>Bag-wise Weight Entry</h2>
            <span className="cnt">{bags.length} bag{bags.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="np-body">
            <div className="np-bag-cols">
              <span>#</span>
              <span>Gross (kg)</span>
              <span>Deduct</span>
              <span>Net</span>
            </div>

            {bags.map((b, i) => (
              <div className="np-bag-row" key={i}>
                <div className="np-bnum">{i + 1}</div>
                <input
                  className="np-bwt"
                  placeholder="Enter weight"
                  value={b.weight}
                  onChange={e => handleWeightChange(e.target.value, i)}
                />
                <div className="np-bded">
                  {b.deduction > 0 ? `−${b.deduction}` : '–'}
                </div>
                <div className="np-bnet">
                  <div className="nv">{b.netWeight > 0 ? b.netWeight : '—'}</div>
                  <div className="nu">kg</div>
                </div>
              </div>
            ))}

            <button className="np-add-btn" onClick={addBag}>+ Add Another Bag</button>

            {hasBagData && (
              <div className="np-bag-sum">
                <div className="np-bsi">
                  <div className="bsv">{totalGross.toFixed(1)}</div>
                  <div className="bsk">Gross kg</div>
                </div>
                <div className="np-bsi">
                  <div className="bsv r">−{totalDeduction.toFixed(1)}</div>
                  <div className="bsk">Deducted</div>
                </div>
                <div className="np-bsi">
                  <div className="bsv g">{totalNet.toFixed(1)}</div>
                  <div className="bsk">Net kg</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── 4. PAYMENT ── */}
        <div className="np-card">
          <div className="np-card-head">
            <div className="np-dot" />
            <h2>Payment Entry</h2>
          </div>
          <div className="np-body">
            <div className="np-field">
              <label>Amount Paid Now (₹)</label>
              <input className="np-inp" placeholder="0" value={amountPaid} onChange={e => setAmountPaid(e.target.value)} />
            </div>
            <div style={{fontSize:'10px', fontWeight:'800', color:colors.textMuted, textTransform:'uppercase', letterSpacing:'0.08em', marginTop:'12px'}}>
              Payment Mode
            </div>
            <div className="np-mode-grid">
              {[
                {val:'cash', label:'Cash',  ico:'💵'},
                {val:'upi',  label:'UPI',   ico:'📱'},
                {val:'bank', label:'Bank',  ico:'🏦'},
              ].map(m => (
                <button
                  key={m.val}
                  className={`np-mbtn${paymentMode === m.val ? ' active' : ''}`}
                  onClick={() => setPaymentMode(m.val)}
                >
                  <span className="mico">{m.ico}</span>
                  {m.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── BILL PREVIEW ── */}
        {showBill && preview && (
          <div id="bill-section" className="np-bill">

            <div className="jsr">
              <div className="jsr-line" />
              <span>🙏  Jai Shree Ram  🙏</span>
              <div className="jsr-line" />
            </div>

            <div className="bill-head">
              <div className="bill-brand">
                <div className="bill-logo">🌶️</div>
                <div>
                  <div className="bill-bname">Mirchi Mart</div>
                  <div className="bill-bsub">Wholesale Traders</div>
                </div>
              </div>
              <div className="bill-inv">
                <div className="ino">INV-PREVIEW</div>
                <div className="idt">{today}</div>
              </div>
            </div>

            <div className="bill-cust">
              <div>
                <div className="bill-cname">{name || '—'}</div>
                <div className="bill-cmob">📞 {mobile || '—'}</div>
              </div>
              <div className={`bill-status ${(preview.pending || 0) > 0 ? 'st-part' : 'st-paid'}`}>
                {(preview.pending || 0) > 0 ? 'Partial' : 'Paid'}
              </div>
            </div>

            <div className="bill-meta">
              {[
                {k:'Crop',           v:`${preview.crop}`},
                {k:'Grade / Type',   v:`${preview.type}`},
                {k:'Price / kg',     v:`₹${preview.totals?.price_per_kg}`},
                {k:'Total Bags',     v:`${preview.totals?.total_bags}`},
                {k:'Gross Weight',   v:`${preview.totals?.gross} kg`},
                {k:'Total Deduction',v:`−${preview.totals?.deduction} kg`},
                {k:'Net Weight',     v:`${preview.totals?.net} kg`},
                {k:'Date',           v:today},
              ].map((item, i) => (
                <div className="bill-meta-item" key={i}>
                  <div className="mk">{item.k}</div>
                  <div className="mv">{item.v}</div>
                </div>
              ))}
            </div>

            <div className="bill-tbl-label">Bag-wise Details</div>
            <div className="bill-tbl-wrap">
              <table className="bill-tbl">
                <thead>
                  <tr>
                    <th>Bag</th>
                    <th>Gross (kg)</th>
                    <th>Deduction</th>
                    <th>Net (kg)</th>
                  </tr>
                </thead>
                <tbody>
                  {(preview.bags || []).map((b, i) => (
                    <tr key={i}>
                      <td>Bag {b.bag_number}</td>
                      <td>{b.gross_weight}</td>
                      <td className="tc-ded">−{b.deduction}</td>
                      <td className="tc-net">{b.net_weight}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td>Total</td>
                    <td>{preview.totals?.gross}</td>
                    <td className="tc-ded">−{preview.totals?.deduction}</td>
                    <td className="tc-net">{preview.totals?.net}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="bill-total">
              <span className="btl">Total Amount</span>
              <span className="btv">₹{fmt(preview.totals?.amount)}</span>
            </div>

            <div className="bill-pp">
              <div className="bill-pp-box pp-paid">
                <div className="ppk">Paid</div>
                <div className="ppv">₹{fmt(preview.paid)}</div>
              </div>
              <div className="bill-pp-box pp-pend">
                <div className="ppk">Pending</div>
                <div className="ppv">₹{fmt(preview.pending)}</div>
              </div>
            </div>

            {(preview.paid || 0) > 0 && (
              <div className="bill-hist">
                <div className="bill-hist-hd">
                  <span>Date</span>
                  <span>Mode</span>
                  <span>Amount</span>
                </div>
                <div className="bill-hist-row">
                  <span>{today}</span>
                  <span>
                    <span className="mbadge">
                      {modeIcon[paymentMode] || '💵'} {paymentMode.toUpperCase()}
                    </span>
                  </span>
                  <span className="ha">₹{fmt(preview.paid)}</span>
                </div>
              </div>
            )}

            <div className="bill-foot">
              <strong>Thank you for your business!</strong> 🌶️
            </div>
          </div>
        )}

        {/* ── BOTTOM ACTION BAR ── */}
        <div className="np-bar">
          <button className="np-bprev" onClick={onPreview} disabled={previewLoading || saveLoading}>
            {previewLoading
              ? <><div className="spin spin-r" />Generating…</>
              : <>👁 Preview Bill</>
            }
          </button>
          <button className="np-bsave" onClick={onSave} disabled={saveLoading || previewLoading}>
            {saveLoading
              ? <><div className="spin" />Saving…</>
              : <>✓ Save Purchase</>
            }
          </button>
        </div>

      </div>
    </>
  );
}