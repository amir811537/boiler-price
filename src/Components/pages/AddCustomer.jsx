import { useEffect, useState } from "react";
import api from "../../api";

const AddCustomer = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [fetching, setFetching] = useState(false);

  // 🔄 fetch all customers
  const fetchCustomers = async () => {
    try {
      setFetching(true);
      const res = await api.get("/customers");
      setCustomers(res.data || []);
    } catch (err) {
      console.error(err);
      alert("কাস্টমার লিস্ট লোড করা যায়নি");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // ➕ add customer
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("কাস্টমারের নাম দিন");
      return;
    }

    try {
      setLoading(true);
      await api.post("/customers", { name });
      alert("✅ কাস্টমার সফলভাবে যোগ হয়েছে");
      setName("");
      fetchCustomers();
    } catch (err) {
      console.error(err);
      if (err.response?.status === 409) {
        alert("⚠️ এই নামের কাস্টমার আগে থেকেই আছে");
      } else {
        alert("❌ কাস্টমার যোগ করা যায়নি");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ delete customer
  const handleDelete = async (id, customerName) => {
    const confirmDelete = window.confirm(
      `আপনি কি নিশ্চিত?\n"${customerName}" কাস্টমারটি ডিলিট হয়ে যাবে`
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/customers/${id}`);
      alert("🗑️ কাস্টমার ডিলিট করা হয়েছে");
      fetchCustomers();
    } catch (err) {
      console.error(err);
      alert("❌ কাস্টমার ডিলিট করা যায়নি");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white border rounded-lg shadow-sm">

      {/* ADD CUSTOMER */}
      <h2 className="text-lg font-semibold text-purple-700 mb-4 text-center">
        ➕ নতুন কাস্টমার যোগ করুন
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">
            কাস্টমারের নাম
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="যেমন: রহিম উদ্দিন"
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded text-white font-medium ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
          }`}
        >
          {loading ? "সংরক্ষণ হচ্ছে..." : "কাস্টমার যোগ করুন"}
        </button>
      </form>

      {/* CUSTOMER LIST */}
      <h3 className="text-md font-semibold mb-2 text-gray-700">
        📋 কাস্টমার লিস্ট
      </h3>

      {fetching && (
        <p className="text-sm text-gray-500">লোড হচ্ছে...</p>
      )}

      {!fetching && customers.length === 0 && (
        <p className="text-sm text-gray-500">
          এখনো কোনো কাস্টমার যোগ করা হয়নি
        </p>
      )}

      <ul className="space-y-2 max-h-64 overflow-y-auto">
        {customers.map((customer) => (
          <li
            key={customer._id}
            className="flex items-center justify-between border px-3 py-2 rounded bg-gray-50"
          >
            <span className="text-sm font-medium">
              {customer.name}
            </span>

            <button
              onClick={() =>
                handleDelete(customer._id, customer.name)
              }
              className="text-red-600 hover:text-red-800 text-sm font-semibold"
            >
              🗑️ ডিলিট
            </button>
          </li>
        ))}
      </ul>

      <p className="text-xs text-gray-500 mt-4 text-center">
        ℹ️ কাস্টমার ডিলিট করলে সংশ্লিষ্ট সব দিনের রেট থেকেও সে বাদ যাবে
      </p>
    </div>
  );
};

export default AddCustomer;
