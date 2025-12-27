import { useEffect, useState } from "react";
import api from "../../api";
import Swal from "sweetalert2";

const getToday = () => new Date().toISOString().split("T")[0];


const UpdateSellingRate = () => {
  const [rates, setRates] = useState([]);
  const [date, setDate] = useState(getToday());
  const [loading, setLoading] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [editMode, setEditMode] = useState(null); // proposal | actual

  const fetchData = async (selectedDate) => {
    try {
      setLoading(true);
      const res = await api.get(`/sellingRate?date=${selectedDate}`);
      setRates(res.data?.rates || []);
    } catch (err) {
      console.error(err);
      setRates([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(date);
  }, [date]);

  const handleSave = async () => {
    try {
      await api.patch("/sellingRate", {
        date,
        customerName: selectedItem.customerName,
        ...(editMode === "proposal"
          ? { proposalPrice: selectedItem.proposalPrice }
          : { actualSellingPrice: selectedItem.actualSellingPrice })
      });


Swal.fire({
  title: "✅ সফলভাবে আপডেট হয়েছে",
  icon: "success",
  timer: 1000,
  draggable: true
});
      setSelectedItem(null);
      setEditMode(null);
      fetchData(date);
    } catch (err) {
      console.error(err);

Swal.fire({
  title: "❌ আপডেট করা যায়নি",
  icon: "error",
  draggable: true,
  timer: 1000
});


    }
  };

  // 🔥 DELETE FUNCTION
  const handleDelete = async (customerName) => {
    
    
    const confirmDelete = window.confirm(
      `আপনি কি নিশ্চিত?\n${customerName} এর রেট ডিলিট হয়ে যাবে`
    );


    
    if (!confirmDelete) return;

    try {
      await api.delete("/sellingRate/customer", {
        data: { date, customerName }
      });

      alert("🗑️ সফলভাবে ডিলিট হয়েছে");
      fetchData(date);
    } catch (err) {
      console.error(err);
      alert("❌ ডিলিট করা যায়নি");
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-6 p-4">

      {/* DATE SELECT */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <label className="text-[15px] font-semibold text-gray-800">
          📅 তারিখ নির্বাচন করুন
        </label>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border px-4 py-2 rounded-lg shadow-sm"
        />
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border text-sm">

          {/* TABLE HEAD */}
          <thead className="bg-gradient-to-r from-purple-600 to-purple-500 text-white sticky top-0">
            <tr>
              <th rowSpan="2" className="border px-4 py-3 text-left">
                কাস্টমার নাম
              </th>
              <th colSpan="2" className="border px-4 py-3 text-center">
                প্রস্তাবিত মূল্য (শরীফ ভাই)
              </th>
              <th colSpan="2" className="border px-4 py-3 text-center">
                বিক্রয় মূল্য (রনি / সিদ্দিক)
              </th>
              <th rowSpan="2" className="border px-4 py-3 text-center">
                একশন
              </th>
            </tr>

            <tr className="bg-purple-100 text-purple-900">
              <th className="border px-3 py-2 text-right">বয়লার বড়</th>
              <th className="border px-3 py-2 text-right">বয়লার ছোট</th>
              <th className="border px-3 py-2 text-right">বয়লার বড়</th>
              <th className="border px-3 py-2 text-right">বয়লার ছোট</th>
            </tr>
          </thead>

          {/* TABLE BODY */}
          <tbody>
            {loading && (
              <tr>
                <td colSpan="6" className="text-center py-6">
                  লোড হচ্ছে...
                </td>
              </tr>
            )}

            {!loading && rates.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  কোনো তথ্য পাওয়া যায়নি
                </td>
              </tr>
            )}

            {rates.map((item) => (
              <tr key={item.customerName} className="hover:bg-gray-50">

                <td className="border px-3 py-2 font-medium">
                  {item.customerName}
                </td>

                {/* PROPOSAL */}
                <td
                  className="border px-3 py-2 text-right cursor-pointer text-blue-700"
                  onClick={() => {
                    setSelectedItem(item);
                    setEditMode("proposal");
                  }}
                >
                  {item.proposalPrice?.sorifVai?.boilerBig ?? "-"}
                </td>

                <td
                  className="border px-3 py-2 text-right cursor-pointer text-blue-700"
                  onClick={() => {
                    setSelectedItem(item);
                    setEditMode("proposal");
                  }}
                >
                  {item.proposalPrice?.sorifVai?.boilerSmall ?? "-"}
                </td>

                {/* ACTUAL */}
                <td
                  className="border px-3 py-2 text-right cursor-pointer text-green-700"
                  onClick={() => {
                    setSelectedItem(item);
                    setEditMode("actual");
                  }}
                >
                  {item.actualSellingPrice?.ronyVai?.boilerBig ?? "-"}
                </td>

                <td
                  className="border px-3 py-2 text-right cursor-pointer text-green-700"
                  onClick={() => {
                    setSelectedItem(item);
                    setEditMode("actual");
                  }}
                >
                  {item.actualSellingPrice?.ronyVai?.boilerSmall ?? "-"}
                </td>

                {/* DELETE */}
                <td className="border px-3 py-2 text-center">
                  <button
                    onClick={() => handleDelete(item.customerName)}
                    className="text-red-600 hover:text-red-800 font-semibold"
                  >
                    🗑️ ডিলিট
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

    

    {selectedItem && editMode && (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg w-96 p-5 shadow-lg">

      <h2 className="text-lg font-semibold mb-4">
        {editMode === "proposal"
          ? "প্রস্তাবিত মূল্য আপডেট"
          : "বিক্রয় মূল্য আপডেট"} – {selectedItem.customerName}
      </h2>

      {/* বয়লার বড় */}
      <div className="mb-3">
        <label className="block text-sm mb-1 font-medium">
          বয়লার বড়
        </label>

        <input
          type="number"
          value={
            editMode === "proposal"
              ? selectedItem.proposalPrice?.sorifVai?.boilerBig || ""
              : selectedItem.actualSellingPrice?.ronyVai?.boilerBig || ""
          }
          onChange={(e) =>
            setSelectedItem((prev) => ({
              ...prev,
              ...(editMode === "proposal"
                ? {
                    proposalPrice: {
                      sorifVai: {
                        ...prev.proposalPrice?.sorifVai,
                        boilerBig: e.target.value
                      }
                    }
                  }
                : {
                    actualSellingPrice: {
                      ronyVai: {
                        ...prev.actualSellingPrice?.ronyVai,
                        boilerBig: e.target.value
                      }
                    }
                  })
            }))
          }
          className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* বয়লার ছোট */}
      <div className="mb-4">
        <label className="block text-sm mb-1 font-medium">
          বয়লার ছোট
        </label>

        <input
          type="number"
          value={
            editMode === "proposal"
              ? selectedItem.proposalPrice?.sorifVai?.boilerSmall || ""
              : selectedItem.actualSellingPrice?.ronyVai?.boilerSmall || ""
          }
          onChange={(e) =>
            setSelectedItem((prev) => ({
              ...prev,
              ...(editMode === "proposal"
                ? {
                    proposalPrice: {
                      sorifVai: {
                        ...prev.proposalPrice?.sorifVai,
                        boilerSmall: e.target.value
                      }
                    }
                  }
                : {
                    actualSellingPrice: {
                      ronyVai: {
                        ...prev.actualSellingPrice?.ronyVai,
                        boilerSmall: e.target.value
                      }
                    }
                  })
            }))
          }
          className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-purple-500"
        />
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex justify-end gap-2">
        <button
          onClick={() => {
            setSelectedItem(null);
            setEditMode(null);
          }}
          className="px-4 py-1 border rounded hover:bg-gray-100"
        >
          বাতিল
        </button>

        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
        >
          আপডেট করুন
        </button>
      </div>

    </div>
  </div>
)}

      







      
    </div>
  );
};

export default UpdateSellingRate;
