import { useEffect, useState } from "react";
import api from "../../api";

const EmployeeManager = () => {
  const [employees, setEmployees] = useState([]);

  // add form
  const [name, setName] = useState("");
  const [salary, setSalary] = useState("");

  // edit state
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editSalary, setEditSalary] = useState("");

  /* ================= LOAD EMPLOYEES ================= */
  const loadEmployees = async () => {
    const res = await api.get("/employees");
    setEmployees(res.data);
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  /* ================= ADD EMPLOYEE ================= */
  const addEmployee = async () => {
    if (!name || !salary) return alert("Fill all fields");

    await api.post("/employees", {
      name,
      dailySalary: Number(salary),
    });

    setName("");
    setSalary("");
    loadEmployees();
  };

  /* ================= START EDIT ================= */
  const startEdit = (emp) => {
    setEditingId(emp._id);
    setEditName(emp.name);
    setEditSalary(emp.dailySalary);
  };

  /* ================= UPDATE EMPLOYEE ================= */
  const updateEmployee = async () => {
    await api.patch(`/employees/${editingId}`, {
      name: editName,
      dailySalary: Number(editSalary),
    });

    setEditingId(null);
    setEditName("");
    setEditSalary("");
    loadEmployees();
  };

  /* ================= DELETE EMPLOYEE ================= */
  const deleteEmployee = async (id) => {
    const ok = window.confirm("Delete this employee?");
    if (!ok) return;

    await api.delete(`/employees/${id}`);
    loadEmployees();
  };

  return (
    <div className="mx-2">
      <div className="bg-white shadow rounded p-4 sm:p-5 max-w-7xl mx-auto mt-4 sm:mt-6">
        <h2 className="text-lg sm:text-xl font-bold mb-4">
          Employee Management
        </h2>

        {/* ================= ADD FORM ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <input
            placeholder="Employee Name"
            className="border p-2 rounded text-sm sm:text-base"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="number"
            placeholder="Daily Salary"
            className="border p-2 rounded text-sm sm:text-base"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          />

          <button
            onClick={addEmployee}
            className="bg-blue-600 text-white rounded py-2 sm:py-0"
          >
            Add
          </button>
        </div>

        {/* ================= TABLE ================= */}
        <div className="overflow-x-auto">
          <table className="min-w-[600px] w-full border text-xs sm:text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border p-2 text-left">Name</th>
                <th className="border p-2 text-center">Daily Salary</th>
                <th className="border p-2 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {employees.map((emp) => (
                <tr key={emp._id} className="hover:bg-gray-50">
                  <td className="border p-2">
                    {editingId === emp._id ? (
                      <input
                        className="border p-1 w-full text-sm"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                    ) : (
                      emp.name
                    )}
                  </td>

                  <td className="border p-2 text-center">
                    {editingId === emp._id ? (
                      <input
                        type="number"
                        className="border p-1 w-24 text-center text-sm"
                        value={editSalary}
                        onChange={(e) => setEditSalary(e.target.value)}
                      />
                    ) : (
                      `৳${emp.dailySalary}`
                    )}
                  </td>

                  <td className="border p-2 text-center space-x-1 sm:space-x-2 whitespace-nowrap">
                    {editingId === emp._id ? (
                      <>
                        <button
                          onClick={updateEmployee}
                          className="bg-green-600 text-white px-3 py-1 rounded text-xs sm:text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-gray-400 text-white px-3 py-1 rounded text-xs sm:text-sm"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(emp)}
                          className="bg-yellow-600 text-white px-3 py-1 rounded text-xs sm:text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteEmployee(emp._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded text-xs sm:text-sm"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}

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

      </div>
    </div>
  );
};

export default EmployeeManager;
