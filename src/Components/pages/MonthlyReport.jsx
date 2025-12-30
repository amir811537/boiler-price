import { useEffect, useState } from "react";
import api from "../../api";

const MonthlyReport = () => {
  const [employees, setEmployees] = useState([]);
  const [reports, setReports] = useState({});

  // Month picker (YYYY-MM)
  const [month, setMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [advanceList, setAdvanceList] = useState([]);
  const [loadingAdvance, setLoadingAdvance] = useState(false);

  /* ================= LOAD EMPLOYEES ================= */
  useEffect(() => {
    api.get("/employees").then((res) => {
      setEmployees(res.data);
    });
  }, []);

  /* ================= LOAD SALARY REPORT ================= */
  useEffect(() => {
    if (!employees.length) return;

    setReports({});

    employees.forEach(async (emp) => {
      const res = await api.get(`/salary/${emp._id}/${month}`);
      setReports((prev) => ({
        ...prev,
        [emp._id]: res.data,
      }));
    });
  }, [month, employees]);

  /* ================= OPEN ADVANCE MODAL ================= */
  const openAdvanceModal = async (emp) => {
    setSelectedEmp(emp);
    setShowModal(true);
    setLoadingAdvance(true);
    setAdvanceList([]);

    try {
      // 🔥 backend returns date-wise total
      const res = await api.get(`/advance/${emp._id}/${month}`);
      setAdvanceList(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAdvance(false);
    }
  };

  // 🔥 MONTH TOTAL
  const monthTotalAdvance = advanceList.reduce(
    (sum, a) => sum + Number(a.amount),
    0
  );

  return (
    <div className="bg-white shadow rounded p-5 mt-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          Monthly Salary Report
        </h2>

        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border px-3 py-2 rounded"
        />
      </div>

      {/* TABLE */}
      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Employee</th>
            <th className="border p-2">Present</th>
            <th className="border p-2">Daily Salary</th>
            <th className="border p-2">Total Salary</th>
            <th className="border p-2">Advance</th>
            <th className="border p-2">Payable</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((emp) => {
            const r = reports[emp._id];

            if (!r) {
              return (
                <tr key={emp._id}>
                  <td className="border p-2">{emp.name}</td>
                  <td colSpan="5" className="border p-2 text-center text-gray-400">
                    Loading...
                  </td>
                </tr>
              );
            }

            return (
              <tr key={emp._id}>
                <td className="border p-2">{emp.name}</td>
                <td className="border p-2 text-center">{r.presentDays}</td>
                <td className="border p-2 text-center">৳{r.dailySalary}</td>
                <td className="border p-2 text-center">৳{r.totalSalary}</td>

                {/* CLICKABLE ADVANCE */}
                <td
                  className="border p-2 text-center text-blue-600 cursor-pointer underline"
                  onClick={() => openAdvanceModal(emp)}
                >
                  ৳{r.totalAdvance}
                </td>

                <td className="border p-2 font-bold text-green-700 text-center">
                  ৳{r.payable}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* ================= ADVANCE MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-96 rounded shadow p-5">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">
                Date-wise Advance – {selectedEmp?.name}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-red-500 font-bold"
              >
                ✕
              </button>
            </div>

            {/* BODY */}
            {loadingAdvance ? (
              <p className="text-center text-gray-400">Loading...</p>
            ) : advanceList.length === 0 ? (
              <p className="text-center text-gray-400">
                No advance given this month
              </p>
            ) : (
              <>
                <table className="w-full text-sm border mb-3">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="border p-2">Date</th>
                      <th className="border p-2 text-right">
                        Total Advance
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {advanceList.map((a, i) => (
                      <tr key={i}>
                        <td className="border p-2">
                          {new Date(a.date).toLocaleDateString()}
                        </td>
                        <td className="border p-2 text-right">
                          ৳{a.amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* MONTH TOTAL */}
                <div className="text-right font-bold text-lg text-blue-700">
                  Month Total: ৳{monthTotalAdvance}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyReport;
