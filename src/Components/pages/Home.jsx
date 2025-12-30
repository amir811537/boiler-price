import { useEffect, useState } from "react";
import api from "../../api";
import MonthlyReport from "./MonthlyReport";

/* 🔢 Bangla number converter */
const toBanglaNumber = (num) => {
  if (num === undefined || num === null) return "০";
  const bn = ["০","১","২","৩","৪","৫","৬","৭","৮","৯"];
  return num
    .toString()
    .split("")
    .map((d) => (bn[d] !== undefined ? bn[d] : d))
    .join("");
};

/* 📅 get today YYYY-MM-DD */
const getToday = () => new Date().toISOString().split("T")[0];

const Home = () => {
  const [selectedDate, setSelectedDate] = useState(getToday());
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  /* 🔄 Fetch data */
  const fetchData = async (date) => {
    try {
      setLoading(true);
      const res = await api.get("/sellingRate", {
        params: { date },
      });
      setData(res.data?.rates || []);
    } catch (err) {
      console.error("Fetch error", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedDate);
  }, [selectedDate]);

  return (
    <div className="max-w-7xl mx-auto mt-4 sm:mt-6 p-3 sm:p-4">

      {/* 📅 DATE SELECTOR */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <label className="text-sm sm:text-[15px] font-semibold text-gray-800">
          📅 তারিখ নির্বাচন করুন
        </label>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="
            w-full sm:w-56
            border border-gray-300
            px-3 sm:px-4 py-2
            rounded-lg
            text-sm sm:text-base
            focus:outline-none
            focus:ring-2
            focus:ring-purple-500
          "
        />
      </div>

      {/* 📊 TABLE (Mobile Responsive) */}
      <div className="overflow-x-auto -mx-3 sm:mx-0">
        <div className="min-w-[900px] rounded-lg shadow-md border border-gray-200">
          <table className="w-full text-xs sm:text-sm text-gray-800">

            {/* TABLE HEAD */}
            <thead className="bg-gradient-to-r from-purple-600 to-purple-500 text-white sticky top-0 z-10">
              <tr>
                <th rowSpan="2" className="border px-3 sm:px-4 py-3 text-left font-bold">
                  কাস্টমার নাম
                </th>

                <th colSpan="2" className="border px-3 sm:px-4 py-3 text-center font-bold">
                  প্রস্তাবিত মূল্য (শরীফ ভাই)
                </th>

                <th colSpan="2" className="border px-3 sm:px-4 py-3 text-center font-bold">
                  বিক্রয় মূল্য (রনি / সিদ্দিক)
                </th>

                <th colSpan="2" className="border px-3 sm:px-4 py-3 text-center font-bold">
                  পিছ
                </th>
              </tr>

              <tr className="bg-purple-100 text-purple-900 text-[11px] sm:text-sm">
                <th className="border px-2 sm:px-3 py-2 text-right font-semibold">
                  বয়লার বড়
                </th>
                <th className="border px-2 sm:px-3 py-2 text-right font-semibold">
                  বয়লার ছোট
                </th>
                <th className="border px-2 sm:px-3 py-2 text-right font-semibold">
                  বয়লার বড়
                </th>
                <th className="border px-2 sm:px-3 py-2 text-right font-semibold">
                  বয়লার ছোট
                </th>
                <th className="border px-2 sm:px-3 py-2 text-right font-semibold">
                  বয়লার বড়
                </th>
                <th className="border px-2 sm:px-3 py-2 text-right font-semibold">
                  বয়লার ছোট
                </th>
              </tr>
            </thead>

            {/* TABLE BODY */}
            <tbody className="bg-white">

              {loading && (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-gray-500">
                    ডাটা লোড হচ্ছে...
                  </td>
                </tr>
              )}

              {!loading && data.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-gray-400">
                    এই তারিখে কোনো তথ্য পাওয়া যায়নি
                  </td>
                </tr>
              )}

              {!loading &&
                data.map((item, index) => {
                  const proposal = item?.proposalPrice?.sorifVai || {};
                  const actual = item?.actualSellingPrice?.ronyVai || {};
                  const piece = item?.piece || {};

                  return (
                    <tr
                      key={index}
                      className={`transition ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } hover:bg-purple-50`}
                    >
                      <td className="border px-2 sm:px-4 py-2 sm:py-3 font-semibold whitespace-nowrap">
                        {item.customerName}
                      </td>

                      <td className="border px-2 sm:px-3 py-2 sm:py-3 text-right font-semibold text-blue-700">
                        ৳ {toBanglaNumber(proposal.boilerBig ?? 0)}
                      </td>
                      <td className="border px-2 sm:px-3 py-2 sm:py-3 text-right font-semibold text-blue-700">
                        ৳ {toBanglaNumber(proposal.boilerSmall ?? 0)}
                      </td>

                      <td className="border px-2 sm:px-3 py-2 sm:py-3 text-right font-semibold text-green-700">
                        ৳ {toBanglaNumber(actual.boilerBig ?? 0)}
                      </td>
                      <td className="border px-2 sm:px-3 py-2 sm:py-3 text-right font-semibold text-green-700">
                        ৳ {toBanglaNumber(actual.boilerSmall ?? 0)}
                      </td>

                      <td className="border px-2 sm:px-3 py-2 sm:py-3 text-right font-semibold text-orange-700">
                        {toBanglaNumber(piece.boilerBig ?? 0)} পিছ
                      </td>
                      <td className="border px-2 sm:px-3 py-2 sm:py-3 text-right font-semibold text-orange-700">
                        {toBanglaNumber(piece.boilerSmall ?? 0)} পিছ
                      </td>
                    </tr>
                  );
                })}
            </tbody>

          </table>
        </div>
      </div>

      {/* 📑 MONTHLY REPORT */}
      <div className="mt-8">
        <MonthlyReport />
      </div>

    </div>
  );
};

export default Home;
