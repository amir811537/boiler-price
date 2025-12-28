import { useEffect, useState } from "react";
import api from "../../api";
import Swal from "sweetalert2";
import { MdDelete } from "react-icons/md";

const getToday = () => new Date().toISOString().split("T")[0];

const UpdateSellingRate = () => {
  const [rates, setRates] = useState([]);
  const [date, setDate] = useState(getToday());
  const [loading, setLoading] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);
  const [editMode, setEditMode] = useState(null); 
  // proposal | actual | piece

  // 🔹 FETCH DATA
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

  // 🔹 SAVE (PATCH)
  const handleSave = async () => {
    try {
      await api.patch("/sellingRate", {
        date,
        customerName: selectedItem.customerName,
        ...(editMode === "proposal" && {
          proposalPrice: selectedItem.proposalPrice,
        }),
        ...(editMode === "actual" && {
          actualSellingPrice: selectedItem.actualSellingPrice,
        }),
        ...(editMode === "piece" && {
          piece: selectedItem.piece,
        }),
      });

      Swal.fire({
        title: "✅ সফলভাবে আপডেট হয়েছে",
        icon: "success",
        timer: 1000,
        showConfirmButton: false,
      });

      setSelectedItem(null);
      setEditMode(null);
      fetchData(date);
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "❌ আপডেট করা যায়নি",
        icon: "error",
        timer: 1000,
        showConfirmButton: false,
      });
    }
  };

  // 🔹 DELETE
  const handleDelete = async (customerName) => {
    const confirmDelete = window.confirm(
      `${customerName} এর রেট ডিলিট হবে। নিশ্চিত?`
    );
    if (!confirmDelete) return;

    try {
      await api.delete("/sellingRate/customer", {
        data: { date, customerName },
      });

      Swal.fire("🗑️ ডিলিট হয়েছে", "", "success");
      fetchData(date);
    } catch (err) {
      console.error(err);
      Swal.fire("❌ ডিলিট করা যায়নি", "", "error");
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-6 p-4">

      {/* DATE */}
      <div className="flex items-center gap-3 mb-6">
        <label className="font-semibold">📅 তারিখ</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full border text-sm">

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
              <th colSpan="2" className="border px-4 py-3 text-center">
                পিছ
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
              <th className="border px-3 py-2 text-right">বয়লার বড়</th>
              <th className="border px-3 py-2 text-right">বয়লার ছোট</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="8" className="text-center py-6">লোড হচ্ছে...</td>
              </tr>
            )}

            {!loading && rates.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-6">কোনো ডাটা নেই</td>
              </tr>
            )}

            {rates.map((item) => (
              <tr key={item.customerName} className="hover:bg-gray-50">

                <td className="border  px-2 py-1 font-medium">
                  {item.customerName}
                </td>

                {/* PROPOSAL */}
                <td className="border px-2 py-1 text-right text-red-600 font-bold cursor-pointer"
                  onClick={() => { setSelectedItem(item); setEditMode("proposal"); }}>
                  {item.proposalPrice?.sorifVai?.boilerBig ?? "-"}
                </td>

                <td className="border px-2 py-1 text-right text-red-600 font-bold cursor-pointer"
                  onClick={() => { setSelectedItem(item); setEditMode("proposal"); }}>
                  {item.proposalPrice?.sorifVai?.boilerSmall ?? "-"}
                </td>

                {/* ACTUAL */}
                <td className="border px-2 py-1 text-right text-green-600 font-bold cursor-pointer"
                  onClick={() => { setSelectedItem(item); setEditMode("actual"); }}>
                  {item.actualSellingPrice?.ronyVai?.boilerBig ?? "-"}
                </td>

                <td className="border px-2 py-1 text-right text-green-600 font-bold cursor-pointer"
                  onClick={() => { setSelectedItem(item); setEditMode("actual"); }}>
                  {item.actualSellingPrice?.ronyVai?.boilerSmall ?? "-"}
                </td>

                {/* PIECE */}
                <td className="border px-2 py-1 text-right text-green-600 cursor-pointer font-bold"
                  onClick={() => { setSelectedItem(item); setEditMode("piece"); }}>
                  {item.piece?.boilerBig ?? "-"} পিছ
                </td>

                <td className="border px-2 py-1 text-right text-green-600 cursor-pointer font-bold"
                  onClick={() => { setSelectedItem(item); setEditMode("piece"); }}>
                  {item.piece?.boilerSmall ?? "-"} পিছ
                </td>

                {/* DELETE */}
                <td className="border px-2 py-1 text-center">
                  <button
                    onClick={() => handleDelete(item.customerName)}
                
                  >
                    
<MdDelete className="text-red-600 text-2xl font-extrabold hover:text-red-800" />


                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {selectedItem && editMode && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-96 p-5 rounded shadow">

       <h2 className="font-semibold mb-4 text-[16px]">
  <span className="block text-gray-500 text-sm mb-1">
  <span className="font-semibold text-gray-800">
      {selectedItem.customerName} এর
    </span>
  </span>

  {editMode === "proposal" && "প্রস্তাবিত মূল্য"}
  {editMode === "actual" && "বিক্রয় মূল্য"}
  {editMode === "piece" && "পিছ সংখ্যা"} আপডেট
</h2>


            {/* BIG */}
            <input
              type="number"
              className="w-full border px-3 py-2 mb-3"
              placeholder="বয়লার বড়"
              value={
                editMode === "proposal"
                  ? selectedItem.proposalPrice?.sorifVai?.boilerBig || ""
                  : editMode === "actual"
                  ? selectedItem.actualSellingPrice?.ronyVai?.boilerBig || ""
                  : selectedItem.piece?.boilerBig || ""
              }
              onChange={(e) =>
                setSelectedItem((prev) => ({
                  ...prev,
                  ...(editMode === "proposal"
                    ? { proposalPrice: { sorifVai: { ...prev.proposalPrice?.sorifVai, boilerBig: e.target.value } } }
                    : editMode === "actual"
                    ? { actualSellingPrice: { ronyVai: { ...prev.actualSellingPrice?.ronyVai, boilerBig: e.target.value } } }
                    : { piece: { ...prev.piece, boilerBig: e.target.value } })
                }))
              }
            />

            {/* SMALL */}
            <input
              type="number"
              className="w-full border px-3 py-2 mb-4"
              placeholder="বয়লার ছোট"
              value={
                editMode === "proposal"
                  ? selectedItem.proposalPrice?.sorifVai?.boilerSmall || ""
                  : editMode === "actual"
                  ? selectedItem.actualSellingPrice?.ronyVai?.boilerSmall || ""
                  : selectedItem.piece?.boilerSmall || ""
              }
              onChange={(e) =>
                setSelectedItem((prev) => ({
                  ...prev,
                  ...(editMode === "proposal"
                    ? { proposalPrice: { sorifVai: { ...prev.proposalPrice?.sorifVai, boilerSmall: e.target.value } } }
                    : editMode === "actual"
                    ? { actualSellingPrice: { ronyVai: { ...prev.actualSellingPrice?.ronyVai, boilerSmall: e.target.value } } }
                    : { piece: { ...prev.piece, boilerSmall: e.target.value } })
                }))
              }
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => { setSelectedItem(null); setEditMode(null); }}
                className="border px-3 py-1 rounded">
                বাতিল
              </button>
              <button onClick={handleSave}
                className="bg-green-600 text-white px-4 py-1 rounded">
                সেভ
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default UpdateSellingRate;
