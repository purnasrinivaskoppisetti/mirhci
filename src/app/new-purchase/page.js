'use client';

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
    loading
  } = useNewPurchase();

  const totalGross = bags.reduce((s, b) => s + (parseFloat(b.weight) || 0), 0);
  const totalNet   = bags.reduce((s, b) => s + (parseFloat(b.netWeight) || 0), 0);
  const totalDeduction = totalGross - totalNet;
  const totalAmount = totalNet * (parseFloat(price) || 0);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=DM+Sans:wght@300;400;500;600&display=swap');

        .np-root {
          min-height: 100vh;
          background: #f7f3ee;
          font-family: 'DM Sans', sans-serif;
          padding: 0 0 80px;
        }

        /* ── HEADER ── */
        .np-header {
          background: #fff;
          border-bottom: 1px solid #e8e0d4;
          padding: 18px 24px 16px;
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .np-header-icon {
          width: 40px; height: 40px;
          background: #c0392b;
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
        }
        .np-header-icon svg { fill: #fff; width: 20px; height: 20px; }
        .np-header h1 {
          font-family: 'Playfair Display', serif;
          font-size: 19px; font-weight: 600;
          color: #1a1510; margin: 0;
        }
        .np-header p { font-size: 12px; color: #888; margin: 2px 0 0; }

        /* ── LAYOUT ── */
        .np-body {
          max-width: 980px;
          margin: 0 auto;
          padding: 24px 16px 0;
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 20px;
          align-items: start;
        }
        @media (max-width: 720px) {
          .np-body { grid-template-columns: 1fr; }
        }

        /* ── CARD ── */
        .np-card {
          background: #fff;
          border-radius: 14px;
          border: 1px solid #e8e0d4;
          overflow: hidden;
          margin-bottom: 16px;
        }
        .np-card-header {
          padding: 14px 20px 12px;
          border-bottom: 1px solid #f0e9e0;
          display: flex; align-items: center; gap: 10px;
        }
        .np-card-header-dot {
          width: 8px; height: 8px; border-radius: 50%;
        }
        .np-card-header h2 {
          font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 600;
          letter-spacing: 0.04em; text-transform: uppercase;
          color: #5a4e3e; margin: 0;
        }
        .np-card-body { padding: 20px; }

        /* ── INPUTS ── */
        .np-field { margin-bottom: 14px; }
        .np-field label {
          display: block; font-size: 12px; font-weight: 500;
          color: #7a6e60; margin-bottom: 5px; letter-spacing: 0.03em;
        }
        .np-field label span { color: #c0392b; margin-left: 2px; }
        .np-input, .np-select {
          width: 100%; box-sizing: border-box;
          padding: 10px 13px;
          border: 1px solid #ddd5c8;
          border-radius: 9px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px; color: #1a1510;
          background: #fdfaf7;
          transition: border-color 0.18s, box-shadow 0.18s;
          outline: none;
          appearance: none;
        }
        .np-input::placeholder { color: #bbb0a2; }
        .np-input:focus, .np-select:focus {
          border-color: #c0392b;
          box-shadow: 0 0 0 3px rgba(192,57,43,0.1);
          background: #fff;
        }
        .np-select {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%23aaa'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          padding-right: 32px;
          cursor: pointer;
        }
        .np-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .np-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }

        /* ── DEDUCTION BADGE ── */
        .np-ded-badge {
          display: inline-flex; align-items: center; gap: 5px;
          background: #fff3f2; border: 1px solid #f8c9c5;
          border-radius: 6px; padding: 3px 8px;
          font-size: 11px; font-weight: 500; color: #c0392b;
        }

        /* ── BAG ROW ── */
        .np-bag-row {
          display: flex; align-items: center; gap: 10px;
          padding: 10px 14px;
          background: #fdfaf7;
          border: 1px solid #e8e0d4;
          border-radius: 10px;
          margin-bottom: 8px;
          transition: border-color 0.15s;
        }
        .np-bag-row:focus-within { border-color: #c0392b; }
        .np-bag-num {
          min-width: 28px; height: 28px;
          background: #c0392b; color: #fff;
          border-radius: 7px;
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 600; flex-shrink: 0;
        }
        .np-bag-label {
          font-size: 12px; font-weight: 500; color: #7a6e60;
          white-space: nowrap; min-width: 38px;
        }
        .np-bag-input {
          flex: 1; padding: 7px 10px;
          border: 1px solid #ddd5c8; border-radius: 7px;
          font-family: 'DM Sans'; font-size: 14px; color: #1a1510;
          background: #fff; outline: none;
          transition: border-color 0.15s;
        }
        .np-bag-input:focus { border-color: #c0392b; }
        .np-bag-input::placeholder { color: #bbb0a2; font-size: 13px; }
        .np-bag-net {
          min-width: 64px; text-align: right;
          font-size: 13px; font-weight: 600;
          color: #2d6a4f;
        }
        .np-bag-deduction {
          min-width: 44px; text-align: center;
          font-size: 12px; color: #c0392b;
          background: #fff3f2; border-radius: 5px;
          padding: 2px 6px;
        }
        .np-add-bag {
          width: 100%; padding: 10px;
          border: 1.5px dashed #d4c9bc;
          border-radius: 10px; background: transparent;
          font-family: 'DM Sans'; font-size: 13px; font-weight: 500;
          color: #9a8e82; cursor: pointer;
          transition: border-color 0.15s, color 0.15s, background 0.15s;
          margin-top: 4px;
        }
        .np-add-bag:hover {
          border-color: #c0392b; color: #c0392b; background: #fff8f7;
        }

        /* ── PAYMENT ── */
        .np-payment-mode {
          display: flex; gap: 8px; margin-top: 14px;
        }
        .np-mode-btn {
          flex: 1; padding: 10px 6px;
          border-radius: 9px; border: 1.5px solid #ddd5c8;
          background: #fdfaf7; cursor: pointer;
          font-family: 'DM Sans'; font-size: 13px; font-weight: 500; color: #7a6e60;
          transition: all 0.15s; text-align: center;
        }
        .np-mode-btn:hover { border-color: #c0392b; color: #c0392b; }
        .np-mode-btn.active {
          border-color: #c0392b; background: #c0392b; color: #fff;
        }
        .np-mode-icon { font-size: 15px; display: block; margin-bottom: 2px; }

        /* ── LIVE CALC (STICKY SIDE) ── */
        .np-calc {
          position: sticky; top: 20px;
          background: #fff;
          border-radius: 14px;
          border: 1px solid #e8e0d4;
          overflow: hidden;
        }
        .np-calc-header {
          padding: 16px 20px;
          background: #1a1510;
          display: flex; align-items: center; gap: 8px;
        }
        .np-calc-header h3 {
          font-family: 'Playfair Display', serif;
          font-size: 15px; font-weight: 500; color: #fff; margin: 0;
        }
        .np-calc-pulse {
          width: 7px; height: 7px; border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 0 0 rgba(74,222,128,0.5);
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(74,222,128,0.4); }
          50% { box-shadow: 0 0 0 5px rgba(74,222,128,0); }
        }
        .np-calc-body { padding: 18px 20px; }
        .np-calc-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 8px 0; border-bottom: 1px solid #f0e9e0; font-size: 13px;
        }
        .np-calc-row:last-of-type { border-bottom: none; }
        .np-calc-row .label { color: #8a7e72; }
        .np-calc-row .value { font-weight: 500; color: #1a1510; }
        .np-calc-row .value.red { color: #c0392b; }
        .np-calc-row .value.green { color: #2d6a4f; }
        .np-calc-total {
          margin: 14px 0 0;
          padding: 14px 16px;
          background: #1a1510;
          border-radius: 10px;
        }
        .np-calc-total .tot-label {
          font-size: 11px; font-weight: 500;
          letter-spacing: 0.06em; color: #888; text-transform: uppercase;
        }
        .np-calc-total .tot-amount {
          font-family: 'Playfair Display', serif;
          font-size: 26px; font-weight: 600; color: #fff;
          margin: 2px 0 0; letter-spacing: -0.5px;
        }

        /* ── ACTION BUTTONS ── */
        .np-actions { padding: 16px 20px 20px; display: flex; flex-direction: column; gap: 8px; }
        .np-btn-save {
          width: 100%; padding: 13px;
          background: #c0392b; color: #fff;
          border: none; border-radius: 10px;
          font-family: 'DM Sans'; font-size: 14px; font-weight: 600;
          cursor: pointer; transition: background 0.15s, transform 0.1s;
          display: flex; align-items: center; justify-content: center; gap: 6px;
        }
        .np-btn-save:hover { background: #a93226; }
        .np-btn-save:active { transform: scale(0.98); }
        .np-btn-preview {
          width: 100%; padding: 11px;
          background: transparent; color: #5a4e3e;
          border: 1.5px solid #ddd5c8; border-radius: 10px;
          font-family: 'DM Sans'; font-size: 13px; font-weight: 500;
          cursor: pointer; transition: all 0.15s;
        }
        .np-btn-preview:hover { border-color: #5a4e3e; background: #fdfaf7; }

        /* ── INVOICE PREVIEW ── */
        .np-invoice {
          background: #fff; border-radius: 14px;
          border: 1px solid #e8e0d4;
          overflow: hidden; margin-top: 0;
        }
        .np-inv-header {
          padding: 20px 22px 18px;
          border-bottom: 1px solid #e8e0d4;
          display: flex; justify-content: space-between; align-items: flex-start;
        }
        .np-inv-brand {
          display: flex; align-items: center; gap: 10px;
        }
        .np-inv-logo {
          width: 38px; height: 38px; background: #c0392b;
          border-radius: 9px; display: flex; align-items: center;
          justify-content: center; font-size: 18px;
        }
        .np-inv-brand-name {
          font-family: 'Playfair Display', serif;
          font-size: 16px; font-weight: 600; color: #1a1510;
        }
        .np-inv-brand-sub { font-size: 11px; color: #aaa; }
        .np-inv-meta { text-align: right; }
        .np-inv-meta .inv-num { font-size: 13px; font-weight: 600; color: #c0392b; }
        .np-inv-meta .inv-date { font-size: 11px; color: #aaa; margin-top: 2px; }

        .np-inv-customer {
          padding: 16px 22px;
          border-bottom: 1px solid #f0e9e0;
          display: flex; justify-content: space-between; align-items: center;
        }
        .np-inv-cust-name { font-size: 15px; font-weight: 600; color: #1a1510; }
        .np-inv-cust-mob { font-size: 12px; color: #888; margin-top: 2px; }
        .np-inv-status {
          padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600;
        }
        .np-inv-status.partial { background: #fff4e5; color: #b45309; }
        .np-inv-status.paid { background: #e8f8ed; color: #15803d; }

        .np-inv-crop {
          padding: 14px 22px;
          background: #fdfaf7;
          border-bottom: 1px solid #f0e9e0;
          display: flex; justify-content: space-between; font-size: 13px;
        }
        .np-inv-crop .key { color: #888; }
        .np-inv-crop .val { font-weight: 600; color: #1a1510; }

        .np-inv-table { width: 100%; padding: 0 22px 8px; }
        .np-inv-table table { width: 100%; border-collapse: collapse; font-size: 12px; }
        .np-inv-table th {
          padding: 10px 6px 8px; text-align: right;
          color: #aaa; font-weight: 500; font-size: 11px; text-transform: uppercase;
          border-bottom: 1px solid #f0e9e0;
        }
        .np-inv-table th:first-child { text-align: left; }
        .np-inv-table td { padding: 8px 6px; text-align: right; color: #3d3226; font-size: 13px; }
        .np-inv-table td:first-child { text-align: left; color: #7a6e60; }
        .np-inv-table tr:not(:last-child) td { border-bottom: 1px solid #f8f2eb; }
        .np-inv-table .td-ded { color: #c0392b; }
        .np-inv-table .td-net { color: #2d6a4f; font-weight: 600; }
        .np-inv-table tfoot td {
          font-weight: 700; color: #1a1510; border-top: 1px solid #e8e0d4; padding-top: 10px;
        }
        .np-inv-table tfoot .td-ded { color: #c0392b; }
        .np-inv-table tfoot .td-net { color: #2d6a4f; }

        .np-inv-total {
          margin: 8px 22px 16px;
          padding: 14px 18px;
          background: #1a1510; border-radius: 10px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .np-inv-total .tl { font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.05em; }
        .np-inv-total .ta {
          font-family: 'Playfair Display', serif;
          font-size: 22px; font-weight: 600; color: #fff;
        }

        .np-inv-payment {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 10px; padding: 0 22px 20px;
        }
        .np-inv-pay-box {
          padding: 12px 16px; border-radius: 10px; text-align: center;
        }
        .np-inv-pay-box .pb-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
        .np-inv-pay-box .pb-amount { font-size: 18px; font-weight: 600; }
        .np-inv-pay-box.paid-box { background: #e8f8ed; }
        .np-inv-pay-box.paid-box .pb-label { color: #4d9e6a; }
        .np-inv-pay-box.paid-box .pb-amount { color: #15803d; }
        .np-inv-pay-box.pend-box { background: #fff4e5; }
        .np-inv-pay-box.pend-box .pb-label { color: #b88a4a; }
        .np-inv-pay-box.pend-box .pb-amount { color: #b45309; }

        .np-inv-footer {
          padding: 12px 22px 16px;
          border-top: 1px solid #f0e9e0;
          text-align: center;
          font-size: 12px; color: #bbb;
        }
      `}</style>

      <div className="np-root">
        {/* HEADER */}
        <div className="np-header">
          <div className="np-header-icon">
            <svg viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H7v-2h5v2zm5-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
          </div>
          <div>
            <h1>New Purchase Entry</h1>
            <p>Record a purchase — bag by bag</p>
          </div>
        </div>

        <div className="np-body">

          {/* ── LEFT COLUMN ── */}
          <div>

            {/* FARMER DETAILS */}
            <div className="np-card">
              <div className="np-card-header">
                <div className="np-card-header-dot" style={{background:'#c0392b'}} />
                <h2>Farmer / Supplier</h2>
              </div>
              <div className="np-card-body">
                <div className="np-grid-2">
                  <div className="np-field">
                    <label>Name <span>*</span></label>
                    <input className="np-input" placeholder="e.g. Suresh Reddy" value={name} onChange={e => setName(e.target.value)} />
                  </div>
                  <div className="np-field">
                    <label>Mobile</label>
                    <input className="np-input" placeholder="10-digit number" value={mobile} onChange={e => setMobile(e.target.value)} />
                  </div>
                </div>
                <div className="np-grid-2">
                  <div className="np-field" style={{marginBottom:0}}>
                    <label>Crop <span>*</span></label>
                    <select className="np-select" value={crop} onChange={e => setCrop(e.target.value)}>
                      <option value="">Select crop</option>
                      <option value="mirchi">Mirchi (Chilli)</option>
                      <option value="cotton">Cotton</option>
                    </select>
                  </div>
                  <div className="np-field" style={{marginBottom:0}}>
                    <label>Grade / Type <span>*</span></label>
                    <input className="np-input" placeholder="e.g. Guntur, Kashmir" value={type} onChange={e => setType(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            {/* PRICING + DEDUCTIONS */}
            <div className="np-card">
              <div className="np-card-header">
                <div className="np-card-header-dot" style={{background:'#d97706'}} />
                <h2>Pricing & Deductions</h2>
              </div>
              <div className="np-card-body">
                <div className="np-field">
                  <label>Price per kg (₹) <span>*</span></label>
                  <input className="np-input" placeholder="0" value={price} onChange={e => setPrice(e.target.value)} style={{maxWidth:'180px'}} />
                </div>
                <div style={{marginBottom:'10px'}}>
                  <div style={{display:'flex', alignItems:'center', gap:'8px', marginBottom:'10px'}}>
                    <span style={{fontSize:'12px', fontWeight:'600', color:'#7a6e60', textTransform:'uppercase', letterSpacing:'0.04em'}}>Deduction Rules</span>
                    <div className="np-ded-badge">kg subtracted per bag</div>
                  </div>
                  <div className="np-grid-3">
                    <div className="np-field" style={{marginBottom:0}}>
                      <label>Gross 1–49 kg</label>
                      <input className="np-input" placeholder="e.g. 1" value={range1} onChange={e => setRange1(e.target.value)} />
                    </div>
                    <div className="np-field" style={{marginBottom:0}}>
                      <label>Gross 50–99 kg</label>
                      <input className="np-input" placeholder="e.g. 2" value={range2} onChange={e => setRange2(e.target.value)} />
                    </div>
                    <div className="np-field" style={{marginBottom:0}}>
                      <label>Gross 100–200 kg</label>
                      <input className="np-input" placeholder="e.g. 3" value={range3} onChange={e => setRange3(e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* BAG ENTRY */}
            <div className="np-card">
              <div className="np-card-header" style={{justifyContent:'space-between'}}>
                <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                  <div className="np-card-header-dot" style={{background:'#2d6a4f'}} />
                  <h2>Bag-wise Weight Entry</h2>
                </div>
                <span style={{fontSize:'12px', color:'#aaa', fontWeight:'500'}}>{bags.length} bag{bags.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="np-card-body">

                {/* Column labels */}
                <div style={{display:'flex', gap:'10px', padding:'0 0 6px', fontSize:'11px', color:'#bbb', fontWeight:'500', textTransform:'uppercase', letterSpacing:'0.04em'}}>
                  <span style={{minWidth:'28px'}} />
                  <span style={{minWidth:'38px'}}>Bag</span>
                  <span style={{flex:1}}>Gross (kg)</span>
                  <span style={{minWidth:'44px', textAlign:'center'}}>Deduct</span>
                  <span style={{minWidth:'64px', textAlign:'right'}}>Net (kg)</span>
                </div>

                {bags.map((b, i) => (
                  <div className="np-bag-row" key={i}>
                    <div className="np-bag-num">{i + 1}</div>
                    <span className="np-bag-label">Bag {i + 1}</span>
                    <input
                      className="np-bag-input"
                      placeholder="Weight kg"
                      value={b.weight}
                      onChange={e => handleWeightChange(e.target.value, i)}
                    />
                    <span className="np-bag-deduction">
                      {b.deduction > 0 ? `-${b.deduction}` : '–'}
                    </span>
                    <span className="np-bag-net">
                      {b.netWeight > 0 ? `${b.netWeight} kg` : '—'}
                    </span>
                  </div>
                ))}

                <button className="np-add-bag" onClick={addBag}>
                  + Add Another Bag
                </button>
              </div>
            </div>

            {/* PAYMENT */}
            <div className="np-card">
              <div className="np-card-header">
                <div className="np-card-header-dot" style={{background:'#4f7d5e'}} />
                <h2>Payment Entry</h2>
              </div>
              <div className="np-card-body">
                <div className="np-field" style={{marginBottom:8}}>
                  <label>Amount Paid Now (₹)</label>
                  <input className="np-input" placeholder="0" value={amountPaid} onChange={e => setAmountPaid(e.target.value)} />
                </div>
                <div>
                  <label style={{display:'block', fontSize:'12px', fontWeight:'500', color:'#7a6e60', marginBottom:'8px', letterSpacing:'0.03em'}}>Payment Mode</label>
                  <div className="np-payment-mode">
                    {[
                      { val: 'cash', label: 'Cash', icon: '💵' },
                      { val: 'upi',  label: 'UPI',  icon: '📱' },
                      { val: 'bank', label: 'Bank', icon: '🏦' },
                    ].map(m => (
                      <button
                        key={m.val}
                        className={`np-mode-btn ${paymentMode === m.val ? 'active' : ''}`}
                        onClick={() => setPaymentMode(m.val)}
                      >
                        <span className="np-mode-icon">{m.icon}</span>
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ── RIGHT COLUMN ── */}
          <div>
            <div className="np-calc">
              <div className="np-calc-header">
                <div className="np-calc-pulse" />
                <h3>Live Calculation</h3>
              </div>
              <div className="np-calc-body">
                <div className="np-calc-row">
                  <span className="label">Total Bags</span>
                  <span className="value">{bags.length}</span>
                </div>
                <div className="np-calc-row">
                  <span className="label">Gross Weight</span>
                  <span className="value">{totalGross.toFixed(1)} kg</span>
                </div>
                <div className="np-calc-row">
                  <span className="label">Total Deduction</span>
                  <span className="value red">−{totalDeduction.toFixed(1)} kg</span>
                </div>
                <div className="np-calc-row">
                  <span className="label">Net Weight</span>
                  <span className="value green">{totalNet.toFixed(1)} kg</span>
                </div>
                <div className="np-calc-row">
                  <span className="label">Price / kg</span>
                  <span className="value">₹{parseFloat(price) || 0}</span>
                </div>
                <div className="np-calc-total">
                  <div className="tot-label">Total Amount</div>
                  <div className="tot-amount">₹{totalAmount.toLocaleString('en-IN', {maximumFractionDigits:0})}</div>
                </div>
              </div>
              <div className="np-actions">
                <button className="np-btn-save" onClick={handleSave} disabled={loading}>
                  {loading ? 'Saving…' : '✓ Save Purchase'}
                </button>
                <button className="np-btn-preview" onClick={handlePreview}>
                  Preview Bill
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* ── INVOICE PREVIEW ── */}
        {preview && (
          <div style={{maxWidth:'980px', margin:'20px auto', padding:'0 16px'}}>
            <div className="np-invoice">

              <div className="np-inv-header">
                <div className="np-inv-brand">
                  <div className="np-inv-logo">🌶️</div>
                  <div>
                    <div className="np-inv-brand-name">Mirchi Mart</div>
                    <div className="np-inv-brand-sub">Wholesale Traders</div>
                  </div>
                </div>
                <div className="np-inv-meta">
                  <div className="inv-num">INV-PREVIEW</div>
                  <div className="inv-date">{new Date().toLocaleDateString('en-IN')}</div>
                </div>
              </div>

              <div className="np-inv-customer">
                <div>
                  <div className="np-inv-cust-name">{name || '—'}</div>
                  <div className="np-inv-cust-mob">📞 {mobile || '—'}</div>
                </div>
                <div className={`np-inv-status ${preview.pending > 0 ? 'partial' : 'paid'}`}>
                  {preview.pending > 0 ? 'Partial' : 'Paid'}
                </div>
              </div>

              <div className="np-inv-crop">
                <div>
                  <span className="key">Crop / Grade  </span>
                  <span className="val">{preview.crop} · {preview.type}</span>
                </div>
                <div>
                  <span className="key">Price / kg  </span>
                  <span className="val">₹{preview.totals.price_per_kg}</span>
                </div>
              </div>

              <div style={{padding:'14px 22px 4px'}}>
                <div style={{fontSize:'12px', fontWeight:'600', color:'#7a6e60', textTransform:'uppercase', letterSpacing:'0.04em', marginBottom:'4px'}}>
                  Bag-wise Details ({preview.totals.total_bags} bags)
                </div>
              </div>
              <div className="np-inv-table">
                <table>
                  <thead>
                    <tr>
                      <th>Bag</th>
                      <th>Gross (kg)</th>
                      <th>Deduction</th>
                      <th>Net (kg)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.bags.map((b, i) => (
                      <tr key={i}>
                        <td>Bag {b.bag_number}</td>
                        <td>{b.gross_weight}</td>
                        <td className="td-ded">−{b.deduction}</td>
                        <td className="td-net">{b.net_weight}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td>Total</td>
                      <td>{preview.totals.gross}</td>
                      <td className="td-ded">−{preview.totals.deduction}</td>
                      <td className="td-net">{preview.totals.net}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="np-inv-total">
                <span className="tl">Total Amount</span>
                <span className="ta">₹{(preview.totals.amount).toLocaleString('en-IN')}</span>
              </div>

              <div className="np-inv-payment">
                <div className="np-inv-pay-box paid-box">
                  <div className="pb-label">Paid</div>
                  <div className="pb-amount">₹{(preview.paid).toLocaleString('en-IN')}</div>
                </div>
                <div className="np-inv-pay-box pend-box">
                  <div className="pb-label">Pending</div>
                  <div className="pb-amount">₹{(preview.pending).toLocaleString('en-IN')}</div>
                </div>
              </div>

              <div className="np-inv-footer">Thank you for your business! 🌶️</div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}