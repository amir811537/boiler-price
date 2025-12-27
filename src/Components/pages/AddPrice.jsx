import { useState } from "react";
import api from "../../api";

// Demo customers (Bangla names)
const customers = [
  { name: "আব্দুল করিম" },
  { name: "রহিম উদ্দিন" },
  { name: "মিজানুর রহমান" },
  { name: "কামরুল হাসান" },
  { name: "রফিকুল ইসলাম" },
  { name: "সোহেল রানা" },
  { name: "ইমরান হোসেন" },
  { name: "নাঈম উদ্দিন" },
  { name: "সাব্বির আহমেদ" },
  { name: "ফারুক হোসেন" },
];

// Bangla number display (frontend only)
const toBanglaNumber = (num) => {
  const bn = ["০","১","২","৩","৪","৫","৬","৭","৮","৯"];
  return num.toString().split("").map(d => bn[d] ?? d).join("");
};

const AddPrice = () => {
  const [rows, setRows] = useState([
    {
      customerName: "",
      proposalBig: "",
      proposalSmall: "",
    },
  ]);

  // select customer
  const handleCustomerChange = (index, value) => {
    const updated = [...rows];
    updated[index].customerName = value;
    setRows(updated);
  };

  // input change
  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  // add row
  const addRow = () => {
    setRows([
      ...rows,
      { customerName: "", proposalBig: "", proposalSmall: "" },
    ]);
  };

  // save proposal price (Sorif)
  const handleSave = async () => {
  try {
    const filteredRows = rows.filter(r => r.customerName);

    if (filteredRows.length === 0) {
      alert("কমপক্ষে একজন কাস্টমার নির্বাচন করুন");
      return;
    }

    const payload = {
      date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
      rates: filteredRows.map(row => ({
        customerName: row.customerName,
        proposalPrice: {
          sorifVai: {
            boilerBig: Number(row.proposalBig),
            boilerSmall: Number(row.proposalSmall),
          },
        },
        actualSellingPrice: {
          ronyVai: {
            boilerBig: 0,
            boilerSmall: 0,
          },
        },
      })),
      createdAt: new Date(),
    };

    await api.post("/sellingRate", payload);

    alert("আজকের প্রাইস সফলভাবে সংরক্ষণ হয়েছে ✅");
  } catch (err) {
    console.error(err);
    alert("Failed to save ❌");
  }
};


  return (
    <div className="max-w-5xl mx-auto mt-6 p-4">
      <table className="w-full border text-sm">
        <thead className="bg-purple-100 text-purple-800">
          <tr>
            <th className="border px-3 py-2">কাস্টমার নাম</th>
            <th colSpan="2" className="border px-3 py-2 text-center">
              প্রস্তাবিত মূল্য (শরীফ)
            </th>
          </tr>
          <tr className="bg-purple-50">
            <th></th>
            <th className="border px-3 py-2">বয়লার বড়</th>
            <th className="border px-3 py-2">বয়লার ছোট</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td className="border px-2 py-2">
                <select
                  value={row.customerName}
                  onChange={(e) =>
                    handleCustomerChange(index, e.target.value)
                  }
                  className="w-full border px-2 py-1 rounded"
                >
                  <option value="">নির্বাচন করুন</option>
                  {customers.map((c, i) => (
                    <option key={i} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </td>

              <td className="border px-2 py-1">
                <input
                  type="number"
                  value={row.proposalBig}
                  onChange={(e) =>
                    handleChange(index, "proposalBig", e.target.value)
                  }
                  className="w-full border px-2 py-1 text-right"
                  placeholder="৳"
                />
                <small className="text-gray-500">
                  {row.proposalBig && `৳ ${toBanglaNumber(row.proposalBig)}`}
                </small>
              </td>

              <td className="border px-2 py-1">
                <input
                  type="number"
                  value={row.proposalSmall}
                  onChange={(e) =>
                    handleChange(index, "proposalSmall", e.target.value)
                  }
                  className="w-full border px-2 py-1 text-right"
                  placeholder="৳"
                />
                <small className="text-gray-500">
                  {row.proposalSmall && `৳ ${toBanglaNumber(row.proposalSmall)}`}
                </small>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex gap-3 mt-4">
        <button
          onClick={addRow}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          + নতুন কাস্টমার
        </button>

        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-6 py-2 rounded"
        >
          সংরক্ষণ করুন
        </button>
      </div>
    </div>
  );
};

export default AddPrice;
