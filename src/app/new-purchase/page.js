'use client';

import { useNewPurchase } from "@/hook/useCreatePurchase";

export default function New() {
  const {
    name, setName,
    mobile, setMobile,
    crop, setCrop,
    type, setType,
    price, setPrice,
    date, setDate,
    range1, setRange1,
    range2, setRange2,
    range3, setRange3,
    bags,
    handleWeightChange,
    addBag,
    handlePreview,
    preview,
    handleSave,
    loading
  } = useNewPurchase();

  return (
    <div className="p-3 max-w-md mx-auto">

      <h1 className="text-xl font-bold mb-2">New Purchase</h1>

      {/* FORM */}
      <div className="bg-white p-3 rounded-xl mb-3 space-y-2">

        <input placeholder="Name" value={name}
          onChange={(e) => setName(e.target.value)}
          className="input" />

        <input placeholder="Mobile" value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className="input" />

        <select value={crop}
          onChange={(e) => setCrop(e.target.value)}
          className="input">
          <option value="">Select Crop</option>
          <option value="mirchi">Mirchi</option>
          <option value="cotton">Cotton</option>
        </select>

        {/* ✅ TYPE */}
        <input placeholder="Type (Guntur, Byadgi...)"
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="input" />

        <input placeholder="Price/kg"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="input" />

      </div>

      {/* DEDUCTION */}
      <div className="bg-white p-3 rounded-xl mb-3">
        <h2 className="font-semibold text-red-500 mb-2">Deduction</h2>

        <div className="grid grid-cols-3 gap-2">
          <input placeholder="1-49" value={range1} onChange={(e) => setRange1(e.target.value)} className="input" />
          <input placeholder="50-99" value={range2} onChange={(e) => setRange2(e.target.value)} className="input" />
          <input placeholder="100-200" value={range3} onChange={(e) => setRange3(e.target.value)} className="input" />
        </div>
      </div>

      {/* BAGS */}
      <div className="bg-white p-3 rounded-xl mb-3">
        <h2 className="font-semibold mb-2">Enter Bag Weights</h2>

        {bags.map((bag, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input value={bag.bag} disabled className="input w-1/3" />
            <input placeholder="Weight"
              value={bag.weight}
              onChange={(e) => handleWeightChange(e.target.value, i)}
              className="input w-2/3" />
            <span className="text-green-600">{bag.netWeight}kg</span>
          </div>
        ))}

        <button onClick={addBag} className="btn-outline">+ Add Bag</button>
      </div>

      {/* BUTTONS */}
      <div className="flex gap-2">
        <button onClick={handlePreview} className="btn-gray w-full">
          Preview
        </button>

        <button onClick={handleSave} className="btn-red w-full">
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* PREVIEW */}
      {preview && (
        <div className="bg-white p-3 rounded-xl mt-4">
          <h2 className="font-bold mb-2">Preview</h2>

          <p>{crop} - {type}</p>
          <p>Total Bags: {preview.totals.total_bags}</p>
          <p>Total Net: {preview.totals.net} kg</p>

          <p className="text-red-500 font-bold">
            ₹{preview.totals.amount}
          </p>
        </div>
      )}

    </div>
  );
}