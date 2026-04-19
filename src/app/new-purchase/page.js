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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,500&family=DM+Sans:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

        .np {
          min-height: 100vh;
          background: #f4f0ea;
          font-family: 'DM Sans', sans-serif;
          padding-bottom: 150px;
        }

        /* ── TOP BAR (CREAM COLOR) ── */
        .np-top {
          position: sticky; top: 0; z-index: 40;
          background: #F9F3E6;  /* cream color */
          padding: 11px 16px;
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px;
          border-bottom: 1px solid #e8ddd0;
        }
        .np-top-title h1 {
          font-family: 'Playfair Display', serif;
          font-size: 15px; font-weight: 700; color: #2c1a0c; margin: 0;
        }
        .np-top-title p { 
          font-size: 11px; color: #b28b6f; margin: 1px 0 0; 
          display: none; /* hide bag-by-bag text */
        }
        .np-pill {
          background: #c0392b; border-radius: 22px;
          padding: 7px 14px; text-align: right; flex-shrink: 0;
        }
        .np-pill .pl { font-size: 10px; color: rgba(255,255,255,0.6); letter-spacing: 0.06em; text-transform: uppercase; }
        .np-pill .pv {
          font-family: 'Playfair Display', serif;
          font-size: 17px; font-weight: 700; color: #fff; line-height: 1.1;
        }

        /* ── CARD ── */
        .np-card {
          background: #fff;
          border-radius: 14px;
          margin: 12px 12px 0;
          border: 1px solid #e2d9ce;
          overflow: hidden;
        }
        .np-card-head {
          padding: 11px 16px;
          border-bottom: 1px solid #f0e8de;
          display: flex; align-items: center; gap: 8px;
        }
        .np-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .np-card-head h2 {
          font-size: 11px; font-weight: 600; color: #6b5c4a;
          text-transform: uppercase; letter-spacing: 0.07em; margin: 0;
        }
        .np-card-head .cnt {
          margin-left: auto;
          background: #f4f0ea; border-radius: 20px;
          padding: 2px 9px; font-size: 11px; color: #998870; font-weight: 500;
        }
        .np-body { padding: 14px 14px 16px; }

        /* ── FIELDS ── */
        .np-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .np-field { display: flex; flex-direction: column; gap: 4px; }
        .np-field label {
          font-size: 10px; font-weight: 600; color: #998870;
          text-transform: uppercase; letter-spacing: 0.05em;
        }
        .np-field label em { color: #c0392b; font-style: normal; }
        .np-inp, .np-sel {
          width: 100%; padding: 10px 12px;
          border: 1.5px solid #e0d5c8; border-radius: 9px;
          font-family: 'DM Sans'; font-size: 14px; color: #1c1108;
          background: #fdfaf7; outline: none;
          transition: border-color .14s, box-shadow .14s;
          -webkit-appearance: none;
        }
        .np-inp::placeholder { color: #c4b8a8; }
        .np-inp:focus, .np-sel:focus {
          border-color: #c0392b;
          box-shadow: 0 0 0 3px rgba(192,57,43,0.11);
          background: #fff;
        }
        .np-sel {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23998870'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 11px center;
          padding-right: 30px; cursor: pointer;
        }
        .np-grid3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; }

        /* ── BAG TABLE LAYOUT ── */
        .np-bag-cols {
          display: grid;
          grid-template-columns: 30px 1fr 52px 62px;
          gap: 8px;
          padding: 0 12px 6px;
          font-size: 10px; font-weight: 600; color: #b8a898;
          text-transform: uppercase; letter-spacing: 0.04em;
        }
        .np-bag-cols span:nth-child(3) { text-align: center; }
        .np-bag-cols span:last-child { text-align: right; }

        .np-bag-row {
          display: grid;
          grid-template-columns: 30px 1fr 52px 62px;
          align-items: center; gap: 8px;
          padding: 9px 12px;
          background: #fdfaf7;
          border: 1.5px solid #e2d9ce;
          border-radius: 10px;
          margin-bottom: 7px;
          transition: border-color .14s, background .14s;
        }
        .np-bag-row:focus-within { border-color: #c0392b; background: #fff; }

        .np-bnum {
          width: 30px; height: 30px; border-radius: 7px;
          background: #c0392b; color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px; font-weight: 700; flex-shrink: 0;
        }
        .np-bwt {
          width: 100%; padding: 8px 9px;
          border: 1.5px solid #e0d5c8; border-radius: 8px;
          font-family: 'DM Sans'; font-size: 14px; color: #1c1108;
          background: #fff; outline: none;
          transition: border-color .14s;
        }
        .np-bwt:focus { border-color: #c0392b; }
        .np-bwt::placeholder { color: #c4b8a8; font-size: 12px; }
        .np-bded {
          text-align: center; font-size: 12px; font-weight: 600; color: #c0392b;
          background: #fff3f2; border-radius: 6px; padding: 6px 4px;
        }
        .np-bnet { text-align: right; }
        .np-bnet .nv { font-size: 13px; font-weight: 700; color: #2d6a4f; }
        .np-bnet .nu { font-size: 10px; color: #7a9e8a; }

        .np-add-btn {
          width: 100%; margin-top: 2px;
          padding: 10px;
          border: 1.5px dashed #d4c8ba; border-radius: 10px;
          background: transparent; cursor: pointer;
          font-family: 'DM Sans'; font-size: 13px; font-weight: 500; color: #a89888;
          transition: all .14s;
        }
        .np-add-btn:hover { border-color: #c0392b; color: #c0392b; background: #fff8f7; }

        /* bag summary */
        .np-bag-sum {
          display: grid; grid-template-columns: 1fr 1fr 1fr;
          gap: 6px; margin-top: 12px; padding-top: 12px;
          border-top: 1px solid #f0e8de;
        }
        .np-bsi { text-align: center; }
        .np-bsi .bsv { font-size: 15px; font-weight: 700; color: #1c1108; }
        .np-bsi .bsv.r { color: #c0392b; }
        .np-bsi .bsv.g { color: #2d6a4f; }
        .np-bsi .bsk { font-size: 10px; color: #998870; text-transform: uppercase; letter-spacing: 0.04em; margin-top: 1px; }

        /* ── PAYMENT MODE ── */
        .np-mode-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 8px; margin-top: 12px; }
        .np-mbtn {
          padding: 10px 4px;
          border: 1.5px solid #e0d5c8; border-radius: 10px;
          background: #fdfaf7; cursor: pointer;
          font-family: 'DM Sans'; font-size: 12px; font-weight: 500; color: #7a6e60;
          text-align: center; transition: all .14s;
        }
        .np-mbtn .mico { font-size: 18px; display: block; margin-bottom: 2px; }
        .np-mbtn.active { border-color: #c0392b; background: #fff0ef; color: #c0392b; font-weight: 600; }

        /* ── UPDATED BOTTOM BAR (smaller buttons) ── */
        .np-bar {
          position: fixed;
          bottom: calc(70px + env(safe-area-inset-bottom));
          border-top: 1px solid #e2d9ce;
          padding: 8px 14px;
          padding-bottom: max(11px, env(safe-area-inset-bottom));
          display: flex;
          gap: 12px;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          max-width: 430px;
          z-index: 40;
          background: #f4f0ea;
        }
        .np-bprev {
          flex: 1;
          padding: 8px 8px;
          border: 1.5px solid #c0392b;
          border-radius: 40px;
          background: #fff;
          color: #c0392b;
          font-family: 'DM Sans';
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all .2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          box-shadow: 0 1px 2px rgba(0,0,0,0.03);
        }
        .np-bprev:hover { background: #fff8f7; transform: scale(0.97); }
        .np-bsave {
          flex: 1;
          padding: 8px 8px;
          background: #c0392b;
          color: #fff;
          border: none;
          border-radius: 40px;
          font-family: 'DM Sans';
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all .2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          box-shadow: 0 2px 6px rgba(192,57,43,0.25);
        }
        .np-bsave:hover { background: #a93226; transform: scale(0.97); }
        .np-bprev:active, .np-bsave:active { transform: scale(0.96); }
        .np-bprev:disabled, .np-bsave:disabled { opacity: 0.5; pointer-events: none; }

        /* spinner */
        .spin {
          width: 14px; height: 14px; border-radius: 50%; flex-shrink: 0;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          animation: rotating .6s linear infinite;
        }
        .spin-r { border-color: rgba(192,57,43,0.25); border-top-color: #c0392b; }
        @keyframes rotating { to { transform: rotate(360deg); } }

        /* ═══════════════════════════════════
           BILL PREVIEW (unchanged)
        ═══════════════════════════════════ */
        .np-bill {
          margin: 14px 12px 0;
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e2d9ce;
          overflow: hidden;
        }

        .jsr {
          background: #c0392b;
          padding: 9px 16px;
          display: flex; align-items: center; justify-content: center; gap: 10px;
        }
        .jsr-line { flex: 1; height: 1px; background: rgba(255,255,255,0.22); }
        .jsr span {
          font-family: 'Playfair Display', serif;
          font-size: 14px; font-style: italic; font-weight: 500;
          color: #fff; letter-spacing: 0.1em; white-space: nowrap;
        }

        .bill-head {
          padding: 14px 16px 12px;
          border-bottom: 1px solid #f0e8de;
          display: flex; justify-content: space-between; align-items: center; gap: 10px;
        }
        .bill-brand { display: flex; align-items: center; gap: 10px; }
        .bill-logo {
          width: 38px; height: 38px; border-radius: 9px;
          background: #1c1108;
          display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0;
        }
        .bill-bname {
          font-family: 'Playfair Display', serif;
          font-size: 15px; font-weight: 700; color: #1c1108;
        }
        .bill-bsub { font-size: 11px; color: #998870; }
        .bill-inv { text-align: right; }
        .bill-inv .ino { font-size: 12px; font-weight: 700; color: #c0392b; }
        .bill-inv .idt { font-size: 11px; color: #b8a898; margin-top: 2px; }

        .bill-cust {
          padding: 11px 16px;
          background: #fdfaf7;
          border-bottom: 1px solid #f0e8de;
          display: flex; justify-content: space-between; align-items: center; gap: 10px;
        }
        .bill-cname { font-size: 15px; font-weight: 700; color: #1c1108; }
        .bill-cmob { font-size: 12px; color: #998870; margin-top: 2px; }
        .bill-status {
          padding: 4px 11px; border-radius: 20px;
          font-size: 11px; font-weight: 700; white-space: nowrap; flex-shrink: 0;
        }
        .st-part { background: #fff4e5; color: #b45309; }
        .st-paid { background: #e7f7ee; color: #15803d; }

        .bill-meta {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 0; border-bottom: 1px solid #f0e8de;
        }
        .bill-meta-item {
          padding: 10px 16px;
          border-right: 1px solid #f0e8de;
        }
        .bill-meta-item:nth-child(even) { border-right: none; }
        .bill-meta-item .mk { font-size: 10px; font-weight: 600; color: #998870; text-transform: uppercase; letter-spacing: 0.04em; }
        .bill-meta-item .mv { font-size: 13px; font-weight: 600; color: #1c1108; margin-top: 2px; }

        .bill-tbl-label {
          padding: 10px 14px 4px;
          font-size: 10px; font-weight: 700; color: #998870;
          text-transform: uppercase; letter-spacing: 0.06em;
        }
        .bill-tbl-wrap { padding: 0 12px; overflow-x: auto; }
        .bill-tbl {
          width: 100%; border-collapse: collapse;
          min-width: 260px; font-size: 12px;
        }
        .bill-tbl thead th {
          padding: 8px 8px 7px;
          color: #b8a898; font-weight: 600; font-size: 10px;
          text-transform: uppercase; letter-spacing: 0.04em;
          text-align: right; border-bottom: 1px solid #f0e8de;
        }
        .bill-tbl thead th:first-child { text-align: left; }
        .bill-tbl tbody td { padding: 8px 8px; text-align: right; color: #3d3226; }
        .bill-tbl tbody td:first-child { text-align: left; color: #7a6e60; }
        .bill-tbl tbody tr:not(:last-child) td { border-bottom: 1px dotted #f5ede4; }
        .tc-ded { color: #c0392b !important; font-weight: 600; }
        .tc-net { color: #2d6a4f !important; font-weight: 700; }
        .bill-tbl tfoot td {
          padding: 9px 8px 8px; font-weight: 700;
          border-top: 1.5px solid #e2d9ce; color: #1c1108;
        }
        .bill-tbl tfoot td:first-child { color: #5a4e3e; }

        .bill-total {
          margin: 10px 12px;
          background: #1c1108; border-radius: 12px;
          padding: 13px 18px;
          display: flex; justify-content: space-between; align-items: center;
        }
        .bill-total .btl { font-size: 11px; color: #7a6e60; text-transform: uppercase; letter-spacing: 0.05em; }
        .bill-total .btv {
          font-family: 'Playfair Display', serif;
          font-size: 24px; font-weight: 700; color: #fff;
        }

        .bill-pp { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 0 12px 14px; }
        .bill-pp-box { border-radius: 10px; padding: 12px 14px; }
        .bill-pp-box .ppk { font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
        .bill-pp-box .ppv { font-size: 18px; font-weight: 700; }
        .pp-paid { background: #e7f7ee; }
        .pp-paid .ppk { color: #4d9e6a; }
        .pp-paid .ppv { color: #15803d; }
        .pp-pend { background: #fff4e5; }
        .pp-pend .ppk { color: #c28a3a; }
        .pp-pend .ppv { color: #b45309; }

        .bill-hist {
          margin: 0 12px 14px;
          border-radius: 10px; overflow: hidden;
          border: 1px solid #e2d9ce;
        }
        .bill-hist-hd {
          padding: 7px 12px;
          background: #f4f0ea;
          display: grid; grid-template-columns: 1fr 1fr 1fr;
          font-size: 10px; font-weight: 700; color: #998870;
          text-transform: uppercase; letter-spacing: 0.04em;
        }
        .bill-hist-hd span:last-child { text-align: right; }
        .bill-hist-row {
          padding: 9px 12px;
          display: grid; grid-template-columns: 1fr 1fr 1fr;
          font-size: 13px; color: #3d3226;
          border-top: 1px solid #f0e8de;
        }
        .mbadge {
          display: inline-flex; align-items: center; gap: 3px;
          font-size: 11px; font-weight: 600; color: #2d6a4f;
          background: #e7f7ee; border-radius: 5px; padding: 2px 7px;
        }
        .bill-hist-row .ha { text-align: right; font-weight: 700; color: #1c1108; }

        .bill-foot {
          padding: 11px 16px 14px;
          text-align: center; font-size: 12px; color: #c4b8a8;
          border-top: 1px dotted #f0e8de;
        }
        .bill-foot strong { color: #998870; }
      `}</style>

      <div className="np">

        {/* ── STICKY TOP BAR WITH CREAM COLOR & HIDDEN SUBTEXT ── */}
        <div className="np-top">
          <div className="np-top-title">
            <h1>New Purchase</h1>
            <p>Bag-by-bag entry</p> {/* This text is hidden via CSS display:none */}
          </div>
          <div className="np-pill">
            <div className="pl">Total Bill</div>
            <div className="pv">₹{fmt(totalAmt)}</div>
          </div>
        </div>

        {/* ── 1. FARMER / SUPPLIER ── */}
        <div className="np-card">
          <div className="np-card-head">
            <div className="np-dot" style={{background:'#c0392b'}} />
            <h2>Farmer / Supplier</h2>
          </div>
          <div className="np-body">
            <div className="np-grid2" style={{marginBottom:10}}>
              <div className="np-field">
                <label>Name <em>*</em></label>
                <input className="np-inp" placeholder="Suresh Reddy" value={name} onChange={e => setName(e.target.value)} />
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
                  <option value="mirchi">Mirchi</option>
                  <option value="cotton">Cotton</option>
                </select>
              </div>
              <div className="np-field">
                <label>Grade / Type <em>*</em></label>
                <input className="np-inp" placeholder="Guntur, Dry Red…" value={type} onChange={e => setType(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* ── 2. PRICING & DEDUCTIONS ── */}
        <div className="np-card">
          <div className="np-card-head">
            <div className="np-dot" style={{background:'#d97706'}} />
            <h2>Pricing & Deductions</h2>
          </div>
          <div className="np-body">
            <div className="np-field" style={{marginBottom:12, maxWidth:170}}>
              <label>Price per kg (₹) <em>*</em></label>
              <input className="np-inp" placeholder="0" value={price} onChange={e => setPrice(e.target.value)} />
            </div>
            <div style={{fontSize:'10px', fontWeight:'700', color:'#c0392b', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'8px'}}>
              Deduction — kg removed per bag
            </div>
            <div className="np-grid3">
              {[
                {label:'1 – 49 kg',  val:range1, set:setRange1},
                {label:'50 – 99 kg', val:range2, set:setRange2},
                {label:'100+ kg',    val:range3, set:setRange3},
              ].map((d,i) => (
                <div className="np-field" key={i}>
                  <label style={{color:'#c0392b'}}>{d.label}</label>
                  <input className="np-inp" placeholder="0" value={d.val} onChange={e => d.set(e.target.value)} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── 3. BAG ENTRY ── */}
        <div className="np-card">
          <div className="np-card-head">
            <div className="np-dot" style={{background:'#2d6a4f'}} />
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
                  placeholder="kg"
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

            <button className="np-add-btn" onClick={addBag}>＋ Add Another Bag</button>

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
            <div className="np-dot" style={{background:'#4f7d5e'}} />
            <h2>Payment Entry</h2>
          </div>
          <div className="np-body">
            <div className="np-field">
              <label>Amount Paid Now (₹)</label>
              <input className="np-inp" placeholder="0" value={amountPaid} onChange={e => setAmountPaid(e.target.value)} />
            </div>
            <div style={{fontSize:'10px', fontWeight:'700', color:'#998870', textTransform:'uppercase', letterSpacing:'0.05em', marginTop:'10px'}}>
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

        {/* ── BOTTOM ACTION BAR (UPDATED: smaller, rounded, smoother) ── */}
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