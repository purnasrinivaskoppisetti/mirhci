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
    handleSave
  } = useNewPurchase();

  return (
    <div className="p-4 space-y-4">

      {/* FORM */}
      <div className="bg-white p-4 rounded-xl shadow space-y-2">
        <input placeholder="Customer Name" value={name} onChange={e => setName(e.target.value)} className="input"/>
        <input placeholder="Mobile" value={mobile} onChange={e => setMobile(e.target.value)} className="input"/>

        <select value={crop} onChange={e => setCrop(e.target.value)} className="input">
          <option value="">Select Crop</option>
          <option value="mirchi">Mirchi</option>
          <option value="cotton">Cotton</option>
        </select>

        <input placeholder="Type (Guntur etc)" value={type} onChange={e => setType(e.target.value)} className="input"/>
        <input placeholder="Price/kg" value={price} onChange={e => setPrice(e.target.value)} className="input"/>
      </div>

      {/* DEDUCTION */}
      <div className="bg-white p-4 rounded-xl shadow">
        <p className="font-semibold text-red-500 mb-2">Deduction</p>
        <div className="grid grid-cols-3 gap-2">
          <input placeholder="1-49" value={range1} onChange={e => setRange1(e.target.value)} className="input"/>
          <input placeholder="50-99" value={range2} onChange={e => setRange2(e.target.value)} className="input"/>
          <input placeholder="100-200" value={range3} onChange={e => setRange3(e.target.value)} className="input"/>
        </div>
      </div>

      {/* BAGS */}
      <div className="bg-white p-4 rounded-xl shadow">
        <p className="font-semibold mb-2">Bag Entry</p>

        {bags.map((b, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input value={b.bag} disabled className="input w-1/3"/>
            <input placeholder="Weight" value={b.weight}
              onChange={e => handleWeightChange(e.target.value, i)}
              className="input w-2/3"/>
            <span className="text-green-600">{b.netWeight}kg</span>
          </div>
        ))}

        <button onClick={addBag} className="btn-outline mt-2">+ Add Bag</button>
      </div>

      {/* PAYMENT */}
      <div className="bg-green-50 p-4 rounded-xl border border-green-200">
        <p className="font-semibold text-green-700 mb-2">Payment Entry</p>

        <input
          placeholder="Amount Paid"
          value={amountPaid}
          onChange={e => setAmountPaid(e.target.value)}
          className="input"
        />

        <select
          value={paymentMode}
          onChange={e => setPaymentMode(e.target.value)}
          className="input mt-2"
        >
          <option value="cash">Cash</option>
          <option value="upi">UPI</option>
        </select>
      </div>

      {/* BUTTONS */}
      <div className="flex gap-2">
        <button onClick={handlePreview} className="btn-gray w-full">Preview</button>
        <button onClick={handleSave} className="btn-red w-full">Save</button>
      </div>

      {/* ✅ BILL PREVIEW */}
      {preview && (
        <div className="bg-white p-4 rounded-xl shadow mt-4">
          <h2 className="font-bold mb-2">Invoice Preview</h2>

          <p>{preview.crop} - {preview.type}</p>

          <div className="mt-2 text-sm">
            <p>Total Bags: {preview.totals.total_bags}</p>
            <p>Total Net: {preview.totals.net} kg</p>
          </div>

          <div className="mt-4">
            <p className="text-lg font-bold text-red-500">
              ₹{preview.totals.amount}
            </p>
          </div>

          {/* ✅ PAYMENT SUMMARY */}
          <div className="flex gap-2 mt-3">
            <div className="bg-green-100 p-2 rounded w-full text-center">
              Paid ₹{preview.paid}
            </div>
            <div className="bg-orange-100 p-2 rounded w-full text-center">
              Pending ₹{preview.pending}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}