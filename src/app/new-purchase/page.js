'use client';

import { useNewPurchase } from "@/hook/useCreatePurchase";

export default function New() {
    const {
  loading,
  name, setName,
  mobile, setMobile,
  crop, setCrop,
  price, setPrice,
  date, setDate,

  range1, setRange1,
  range2, setRange2,
  range3, setRange3,

  bags,
  handleWeightChange,
  addBag,

  amountPaid, setAmountPaid,
  paymentMode, setPaymentMode,
  notes, setNotes,

  handleSave,

  // ✅ ADD THESE
  showSuccess, setShowSuccess

} = useNewPurchase();

    return (
        <>
            <div className="min-h-screen bg-[#f3f4f6] p-3">
                <div className="max-w-md mx-auto">

                    <h1 className="text-lg font-semibold">New Purchase Entry</h1>
                    <p className="text-xs text-gray-500 mb-3">
                        Record a new purchase — bag by bag
                    </p>

                    {/* FORM */}
                    <div className="bg-white rounded-lg p-3 border border-gray-200 mb-3">
                        <div className="grid grid-cols-2 gap-3">

                            <input placeholder="Name" value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="bg-gray-100 p-2 rounded text-sm" />

                            <input placeholder="Mobile" value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                className="bg-gray-100 p-2 rounded text-sm" />

                            <select value={crop}
                                onChange={(e) => setCrop(e.target.value)}
                                className="bg-gray-100 p-2 rounded text-sm">
                                <option value="">Crop</option>
                                <option value="mirchi">Mirchi</option>
                                <option value="cotton">Cotton</option>
                            </select>

                            <input type="date" value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="bg-gray-100 p-2 rounded text-sm" />

                            <input placeholder="Price/kg" value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="bg-gray-100 p-2 rounded text-sm" />

                        </div>
                    </div>

                    {/* BAG SECTION */}
                    <div className="bg-white rounded-lg p-3 border border-red-200 mb-3">

                        <p className="text-sm text-red-500 font-semibold mb-2">
                            Bag-wise Weight Entry
                        </p>

                        {/* DEDUCTION */}
                        <div className="grid grid-cols-3 gap-2 mb-3">
                            <input placeholder="1-49" value={range1}
                                onChange={(e) => setRange1(e.target.value)}
                                className="bg-gray-100 p-2 rounded text-sm" />

                            <input placeholder="50-99" value={range2}
                                onChange={(e) => setRange2(e.target.value)}
                                className="bg-gray-100 p-2 rounded text-sm" />

                            <input placeholder="100-200" value={range3}
                                onChange={(e) => setRange3(e.target.value)}
                                className="bg-gray-100 p-2 rounded text-sm" />
                        </div>

                        {/* BAGS */}
                        {bags.map((bag, i) => (
                            <div key={i} className="flex gap-2 mb-2">
                                <input value={bag.bag} disabled
                                    className="w-1/4 bg-gray-100 p-2 rounded text-sm" />

                                <input placeholder="Weight"
                                    value={bag.weight}
                                    onChange={(e) => handleWeightChange(e.target.value, i)}
                                    className="w-2/4 bg-gray-100 p-2 rounded text-sm" />

                                <div className="w-1/4 text-green-600 text-xs flex items-center">
                                    {bag.netWeight}kg
                                </div>
                            </div>
                        ))}

                        <button onClick={addBag}
                            className="w-full border border-dashed border-red-300 py-2 text-red-400 text-sm rounded">
                            + Add Bag
                        </button>
                    </div>

                    {/* PAYMENT */}
                    <div className="bg-white rounded-lg p-3 border border-green-200 mb-3">
                        <input placeholder="Amount Paid"
                            value={amountPaid}
                            onChange={(e) => setAmountPaid(e.target.value)}
                            className="bg-gray-100 p-2 rounded text-sm w-full mb-2" />

                        <select value={paymentMode}
                            onChange={(e) => setPaymentMode(e.target.value)}
                            className="bg-gray-100 p-2 rounded text-sm w-full">
                            <option value="cash">Cash</option>
                            <option value="upi">UPI</option>
                        </select>
                    </div>

                    {/* NOTES */}
                    <div className="bg-white rounded-lg p-3 border mb-3">
                        <textarea placeholder="Notes"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="bg-gray-100 p-2 rounded text-sm w-full" />
                    </div>

                    {/* BUTTON */}
                    <button onClick={handleSave}
                        className="bg-red-500 text-white w-full py-3 rounded-lg">
                        {loading ? 'Saving...' : 'Save'}
                    </button>

                </div>
            </div>
            {/* SUCCESS POPUP */}
            {showSuccess && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">

                    <div className="bg-white w-[85%] max-w-sm rounded-xl p-5 text-center shadow-lg animate-popup">

                        {/* ICON */}
                        <div className="text-green-500 text-3xl mb-2">✔</div>

                        <h2 className="text-base font-semibold mb-1">
                            Success
                        </h2>

                        <p className="text-xs text-gray-500 mb-4">
                            Purchase created successfully
                        </p>

                        <button
                            onClick={() => setShowSuccess(false)}
                            className="bg-green-500 text-white px-5 py-2 rounded-lg text-sm"
                        >
                            OK
                        </button>

                    </div>
                </div>
            )}
            );
        </>)
}