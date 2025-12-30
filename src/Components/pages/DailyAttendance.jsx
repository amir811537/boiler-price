/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import api from "../../api";

/* ================= MODAL ================= */
const Modal = ({ show, title, message, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-96 rounded shadow p-5">
        <h3 className="text-lg font-bold mb-3">{title}</h3>
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

/* ================= DAILY ATTENDANCE (ADMIN ONLY) ================= */
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

  /* ================= LOAD ADVANCE BY DATE ================= */
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
    <div className="p-5 bg-white shadow rounded max-w-3xl mx-auto mt-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-xl">
          Daily Attendance (Admin)
        </h2>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />
      </div>

      {/* TABLE */}
      <table className="w-full border text-sm">
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
              <tr key={id}>
                {/* EMPLOYEE */}
                <td className="border p-2 font-medium">
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
                  {status !== "present" && (
                    <button
                      onClick={() => markAttendance(id, "present")}
                      className="bg-green-600 text-white px-3 py-1 mr-2 rounded"
                    >
                      Present
                    </button>
                  )}
                  {status !== "absent" && (
                    <button
                      onClick={() => markAttendance(id, "absent")}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Absent
                    </button>
                  )}
                </td>

                {/* ADVANCE */}
                <td className="border p-2 text-center">
                  <input
                    type="number"
                    className="border p-1 w-20 mr-2"
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
                    className={`text-white px-3 py-1 rounded ${
                      hasAdvance
                        ? "bg-blue-600"
                        : "bg-yellow-600"
                    }`}
                  >
                    {hasAdvance ? "Update" : "Save"}
                  </button>
                </td>
              </tr>
            );
          })}

          {employees.length === 0 && (
            <tr>
              <td colSpan="3" className="border p-4 text-center text-gray-400">
                No employees found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* MODAL */}
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
