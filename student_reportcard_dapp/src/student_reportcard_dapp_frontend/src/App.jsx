import React, { useState } from "react";
import jsPDF from "jspdf";
import {
  createActor,
  canisterId,
} from "../../declarations/student_reportcard_dapp_backend";

const backend = createActor(canisterId);

export default function StudentForm() {
  const [name, setName] = useState("");
  const [marks, setMarks] = useState("");
  const [subjects, setSubjects] = useState("");
  const [updateName, setUpdateName] = useState("");
  const [updateStudent, setUpdateStudent] = useState(null);
  const [fetchName, setFetchName] = useState("");
  const [deleteName, setDeleteName] = useState("");
  const [student, setStudent] = useState(null);
  const [average, setAverage] = useState(null);
  const [grade, setGrade] = useState("");
  const [message, setMessage] = useState("");
  const [studentList, setStudentList] = useState([]);

  const clearDisplay = () => {
    setStudent(null);
    setUpdateStudent(null);
    setStudentList([]);
    setAverage(null);
    setGrade("");
    setMessage("");
  };

  const addStudent = async () => {
    clearDisplay();
    if (!name || !marks || !subjects) {
      setMessage("Please fill all fields");
      return;
    }
    const marksVal = Number(marks);
    const subjVal = Number(subjects);

    if (isNaN(marksVal) || isNaN(subjVal)) {
      setMessage("Marks and subjects must be valid numbers");
      return;
    }

    try {
      await backend.add_student(name, marksVal, subjVal);
      setMessage("Student added successfully!");
      setName("");
      setMarks("");
      setSubjects("");
    } catch (err) {
      console.error("Add failed:", err);
      setMessage("Error adding student");
    }
  };

  const fetchStudent = async () => {
    clearDisplay();
    if (!fetchName) {
      setMessage("Please enter a name to fetch");
      return;
    }
    try {
      const result = await backend.get_student(fetchName);
      if (result && Object.keys(result).length > 0) {
        const s = result[0];
        setStudent(s);
        const avg = await backend.calculate_average(fetchName);
        const grd = await backend.assign_grade(fetchName);
        setAverage(avg);
        setGrade(grd);
      } else {
        setMessage("Student not found");
      }
    } catch (err) {
      console.error("Fetch failed:", err);
      setMessage("Error fetching student");
    } finally {
      setFetchName("");
    }
  };

  const downloadPDF = () => {
    if (!student) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("ABC High School", 20, 20);
    doc.setFontSize(12);
    doc.text("Student Report Card", 20, 30);
    doc.line(20, 32, 190, 32);
    doc.text(`Name           : ${student.name}`, 20, 45);
    doc.text(`Total Marks    : ${student.total_marks}`, 20, 55);
    doc.text(`Subjects       : ${student.num_subjects}`, 20, 65);
    doc.text(`Average        : ${average}`, 20, 75);
    doc.text(`Grade          : ${grade}`, 20, 85);
    doc.line(20, 90, 190, 90);
    doc.text("Signature", 150, 100);
    doc.save(`${student.name}_report_card.pdf`);
  };

  const handleUpdateSearch = async () => {
    clearDisplay();
    try {
      const result = await backend.get_student(updateName);
      if (result && Object.keys(result).length > 0) {
        setUpdateStudent(result[0]);
        setMarks(result[0].total_marks.toString());
        setSubjects(result[0].num_subjects.toString());
      } else {
        setMessage("Student not found");
      }
    } catch (err) {
      console.error("Update fetch failed:", err);
      setMessage("Error finding student to update");
    }
  };

  const updateStudentData = async () => {
    clearDisplay();
    const marksVal = Number(marks);
    const subjVal = Number(subjects);

    try {
      const updated = await backend.update_student(updateName, marksVal, subjVal);
      if (updated) {
        setMessage("Student updated successfully!");
      } else {
        setMessage("Student not found to update");
      }
    } catch (err) {
      console.error("Update failed:", err);
      setMessage("Error updating student");
    }
  };

  const deleteStudent = async () => {
    clearDisplay();
    if (!deleteName) {
      setMessage("Please enter a name to delete");
      return;
    }
    try {
      await backend.delete_student(deleteName);
      setMessage("Student deleted successfully!");
      setDeleteName("");
    } catch (err) {
      console.error("Delete failed:", err);
      setMessage("Error deleting student");
    }
  };

  const listStudents = async () => {
    clearDisplay();
    try {
      const list = await backend.list_all_students();
      setStudentList(list);
    } catch (err) {
      console.error("List failed:", err);
      setMessage("Error listing students");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-blue-800">🎓 Student DApp</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Add Student Box */}
        <section className="bg-white border rounded-xl p-6 shadow space-y-4">
          <h2 className="text-xl font-semibold">➕ Add Student</h2>
          <input className="border p-2 w-full rounded" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="border p-2 w-full rounded" placeholder="Total Marks" value={marks} onChange={(e) => setMarks(e.target.value)} type="number" />
            <input className="border p-2 w-full rounded" placeholder="Number of Subjects" value={subjects} onChange={(e) => setSubjects(e.target.value)} type="number" />
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full" onClick={addStudent}>Add</button>
        </section>

        {/* Update Student Box */}
        <section className="bg-white border rounded-xl p-6 shadow space-y-4">
          <h2 className="text-xl font-semibold">✏️ Update Student</h2>
          <input className="border p-2 w-full rounded" placeholder="Enter Name" value={updateName} onChange={(e) => setUpdateName(e.target.value)} />
          <button className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 w-full" onClick={handleUpdateSearch}>Search</button>
          {updateStudent && (
            <>
              <input className="border p-2 w-full rounded" placeholder="Total Marks" value={marks} onChange={(e) => setMarks(e.target.value)} type="number" />
              <input className="border p-2 w-full rounded" placeholder="Number of Subjects" value={subjects} onChange={(e) => setSubjects(e.target.value)} type="number" />
              <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 w-full" onClick={updateStudentData}>Update</button>
            </>
          )}
        </section>

        {/* Fetch Student Box */}
        <section className="bg-white border rounded-xl p-6 shadow space-y-4">
          <h2 className="text-xl font-semibold">🔍 Fetch Student</h2>
          <input className="border p-2 w-full rounded" placeholder="Enter student name" value={fetchName} onChange={(e) => setFetchName(e.target.value)} />
          <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full" onClick={fetchStudent}>Fetch</button>
          {student && (
            <div className="mt-4 p-4 border rounded shadow bg-gray-100 space-y-2">
              <p><strong>Name:</strong> {student.name}</p>
              <p><strong>Total Marks:</strong> {student.total_marks.toString()}</p>
              <p><strong>Subjects:</strong> {student.num_subjects.toString()}</p>
              <p><strong>Average:</strong> {average}</p>
              <p><strong>Grade:</strong> {grade}</p>
              <button className="bg-indigo-600 text-white px-4 py-1 mt-3 rounded hover:bg-indigo-700" onClick={downloadPDF}>📄 Download PDF</button>
            </div>
          )}
        </section>

        {/* Delete Student Box */}
        <section className="bg-white border rounded-xl p-6 shadow space-y-4">
          <h2 className="text-xl font-semibold">🗑️ Delete Student</h2>
          <input className="border p-2 w-full rounded" placeholder="Enter student name" value={deleteName} onChange={(e) => setDeleteName(e.target.value)} />
          <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 w-full" onClick={deleteStudent}>Delete</button>
        </section>
      </div>

      <section className="bg-white border rounded-xl p-6 shadow space-y-4">
        <h2 className="text-xl font-semibold">📋 All Students</h2>
        <button className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800" onClick={listStudents}>List All</button>
        {studentList.length > 0 && (
          <div className="mt-4 space-y-2">
            {studentList.map((s, i) => (
              <div key={i} className="border p-3 rounded bg-gray-50">
                <p><strong>Name:</strong> {s.name}</p>
                <p><strong>Total Marks:</strong> {s.total_marks.toString()}</p>
                <p><strong>Subjects:</strong> {s.num_subjects.toString()}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {message && <p className="text-center text-red-500 font-medium">{message}</p>}
    </div>
  );
}
