/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import api from "../../api";

/* ================= MODAL ================= */
const Modal = ({ show, title, message, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-3">
      <div className="bg-white w-full max-w-md rounded shadow p-4 sm:p-5">
        <h3 className="text-base sm:text-lg font-bold mb-3">
          {title}
        </h3>
        <p className="text-sm mb-4">{message}</p>
        <button
          onClick={onClose}
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          OK
        </button>
      </div>
    </div>
  );
};

/* ================= DAILY ATTENDANCE ================= */
export default function DailyAttendance() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [advance, setAdvance] = useState({});
  const [existingAdvance, setExistingAdvance] = useState({});
  const [date, setDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  const [modal, setModal] = useState({
    show: false,
    title: "",
    message: "",
  });

  /* ================= LOAD EMPLOYEES ================= */
  useEffect(() => {
    api.get("/employees").then((res) => setEmployees(res.data));
  }, []);

  /* ================= LOAD ATTENDANCE ================= */
  useEffect(() => {
    api.get(`/attendance/date/${date}`).then((res) => {
      const map = {};
      res.data.forEach((a) => {
        map[a.employeeId.toString()] = a.status;
      });
      setAttendance(map);
    });
  }, [date]);

  /* ================= LOAD ADVANCE ================= */
  useEffect(() => {
    const isoDate = new Date(date).toISOString().slice(0, 10);

    api.get(`/advance/date/${isoDate}`).then((res) => {
      const valueMap = {};
      const existMap = {};

      res.data.forEach((a) => {
        const id = a.employeeId.toString();
        valueMap[id] = a.amount;
        existMap[id] = true;
      });

      setAdvance(valueMap);
      setExistingAdvance(existMap);
    });
  }, [date]);

  /* ================= MARK ATTENDANCE ================= */
  const markAttendance = async (employeeId, status) => {
    await api.post("/attendance", { employeeId, date, status });

    setAttendance((prev) => ({
      ...prev,
      [employeeId]: status,
    }));

    const emp = employees.find((e) => e._id === employeeId);

    setModal({
      show: true,
      title: "Attendance Updated",
      message: `${emp.name} marked as ${status.toUpperCase()} on ${date}`,
    });
  };

  /* ================= SAVE / UPDATE ADVANCE ================= */
  const handleAdvance = async (employeeId) => {
    if (advance[employeeId] === "" || advance[employeeId] == null) return;

    const payload = {
      employeeId,
      date,
      amount: Number(advance[employeeId]),
    };

    if (existingAdvance[employeeId]) {
      await api.patch("/advance", payload);
    } else {
      await api.post("/advance", payload);
      setExistingAdvance((prev) => ({
        ...prev,
        [employeeId]: true,
      }));
    }

    const emp = employees.find((e) => e._id === employeeId);

    setModal({
      show: true,
      title: existingAdvance[employeeId]
        ? "Advance Updated"
        : "Advance Saved",
      message: `${emp.name} advance is ৳${advance[employeeId]} on ${date}`,
    });
  };

  return (
    <div className="p-3 sm:p-5 bg-white shadow rounded max-w-3xl mx-auto mt-4 sm:mt-6">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
        <h2 className="font-bold text-lg sm:text-xl">
          Daily Attendance (Admin)
        </h2>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border px-3 py-2 rounded w-full sm:w-auto text-sm"
        />
      </div>

      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto">
        <table className="min-w-[600px] w-full border text-xs sm:text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-left">Employee</th>
              <th className="border p-2 text-center">Status</th>
              <th className="border p-2 text-center">Advance</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp) => {
              const id = emp._id;
              const status = attendance[id];
              const hasAdvance = existingAdvance[id];

              return (
                <tr key={id} className="hover:bg-gray-50">
                  {/* EMPLOYEE */}
                  <td className="border p-2 font-medium whitespace-nowrap">
                    {emp.name}
                    {status && (
                      <span
                        className={`ml-2 font-semibold ${
                          status === "present"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        ({status})
                      </span>
                    )}
                  </td>

                  {/* ATTENDANCE */}
                  <td className="border p-2 text-center">
                    <div className="flex flex-col sm:flex-row justify-center gap-2">
                      {status !== "present" && (
                        <button
                          onClick={() => markAttendance(id, "present")}
                          className="bg-green-600 text-white px-3 py-1 rounded text-xs sm:text-sm"
                        >
                          Present
                        </button>
                      )}
                      {status !== "absent" && (
                        <button
                          onClick={() => markAttendance(id, "absent")}
                          className="bg-red-600 text-white px-3 py-1 rounded text-xs sm:text-sm"
                        >
                          Absent
                        </button>
                      )}
                    </div>
                  </td>

                  {/* ADVANCE */}
                  <td className="border p-2 text-center">
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-2">
                      <input
                        type="number"
                        className="border p-1 w-24 text-center text-sm"
                        value={advance[id] ?? ""}
                        onChange={(e) =>
                          setAdvance({
                            ...advance,
                            [id]: e.target.value,
                          })
                        }
                      />

                      <button
                        onClick={() => handleAdvance(id)}
                        className={`text-white px-3 py-1 rounded text-xs sm:text-sm ${
                          hasAdvance
                            ? "bg-blue-600"
                            : "bg-yellow-600"
                        }`}
                      >
                        {hasAdvance ? "Update" : "Save"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {employees.length === 0 && (
              <tr>
                <td
                  colSpan="3"
                  className="border p-4 text-center text-gray-400"
                >
                  No employees found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL ================= */}
      <Modal
        show={modal.show}
        title={modal.title}
        message={modal.message}
        onClose={() =>
          setModal({ show: false, title: "", message: "" })
        }
      />
    </div>
  );
}
