import { useEffect, useState } from "react";
import api from "../../api";

const AddPrice = () => {
  const [customers, setCustomers] = useState([]);
  const [proposalBig, setProposalBig] = useState("");
  const [proposalSmall, setProposalSmall] = useState("");
  const [saving, setSaving] = useState(false);
  const [loadingCustomers, setLoadingCustomers] = useState(false);

  // 🔹 DATE HANDLING
  const isoDate = new Date().toISOString().split("T")[0]; // 2025-12-28 (DB)
  const displayDate = new Date()
    .toLocaleDateString("en-GB")
    .replace(/\//g, "-"); // 28-12-2025 (UI)

  // 🔹 FETCH CUSTOMERS FROM DB
  const fetchCustomers = async () => {
    try {
      setLoadingCustomers(true);
      const res = await api.get("/customers");
      setCustomers(res.data || []);
    } catch (err) {
      console.error(err);
      alert("কাস্টমার লোড করা যায়নি");
    } finally {
      setLoadingCustomers(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // 🔥 SAVE SAME RATE FOR ALL CUSTOMERS
  const handleSave = async () => {
    if (!proposalBig || !proposalSmall) {
      alert("আজকের বয়লার বড় ও ছোট রেট দিন");
      return;
    }

    if (customers.length === 0) {
      alert("কোনো কাস্টমার পাওয়া যায়নি");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        date: isoDate, // ✅ DB friendly date
        createdAt: new Date(),
        rates: customers.map((c) => ({
          customerName: c.name,
          proposalPrice: {
            sorifVai: {
              boilerBig: Number(proposalBig),
              boilerSmall: Number(proposalSmall),
            },
          },
          actualSellingPrice: {
            ronyVai: {
              boilerBig: 0,
              boilerSmall: 0,
            },
          },
        })),
      };

      await api.post("/sellingRate", payload);

      alert("আজকের রেট সব কাস্টমারের জন্য সংরক্ষণ হয়েছে ✅");
      setProposalBig("");
      setProposalSmall("");
    } catch (err) {
      console.error(err);
      alert("সংরক্ষণ ব্যর্থ হয়েছে ❌");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6 p-4 border rounded-lg shadow-sm">

      {/* 📅 TODAY DATE */}
      <div className="mb-2 text-center">
        <p className="text-sm text-gray-500">
          📅 আজকের তারিখ:{" "}
          <span className="font-semibold">{displayDate}</span>
        </p>
      </div>

      <h2 className="text-lg font-semibold mb-4 text-purple-700 text-center">
        আজকের প্রস্তাবিত মূল্য (শরীফ ভাই)
      </h2>

      {/* 👥 CUSTOMER STATUS */}
      <div className="mb-4 text-center text-sm">
        {loadingCustomers && (
          <span className="text-gray-500">কাস্টমার লোড হচ্ছে...</span>
        )}
        {!loadingCustomers && customers.length > 0 && (
          <span className="text-green-600">
            মোট কাস্টমার: {customers.length} জন
          </span>
        )}
        {!loadingCustomers && customers.length === 0 && (
          <span className="text-red-600">
            কোনো কাস্টমার পাওয়া যায়নি
          </span>
        )}
      </div>

      {/* 💰 RATE INPUTS */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            বয়লার বড়
          </label>
          <input
            type="number"
            value={proposalBig}
            onChange={(e) => setProposalBig(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="৳"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            বয়লার ছোট
          </label>
          <input
            type="number"
            value={proposalSmall}
            onChange={(e) => setProposalSmall(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="৳"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving || loadingCustomers || customers.length === 0}
          className={`w-full py-2 rounded text-white ${
            saving || loadingCustomers || customers.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {saving ? "সংরক্ষণ হচ্ছে..." : "আজকের রেট সংরক্ষণ করুন"}
        </button>
      </div>
    </div>
  );
};

export default AddPrice;
