import React, { useState } from "react";
import {
  createActor,
  canisterId,
} from "../../declarations/student_reportcard_dapp_backend";

const backend = createActor(canisterId);
console.log("backend: ", backend);


export default function StudentForm() {
  const [name, setName] = useState("");
  const [marks, setMarks] = useState("");
  const [subjects, setSubjects] = useState("");
  const [student, setStudent] = useState(null);
  const [message, setMessage] = useState("");

  const addStudent = async () => {
    try {

      if (!name || !marks || !subjects) {
        setMessage("Please fill all fields");
        return;
      }
      const marksVal = Number(marks);
      const subjVal = Number(subjects);

      console.log(name, marksVal, subjVal);
      
      if (isNaN(marksVal) || isNaN(subjVal)) {
        setMessage("Marks and subjects must be valid numbers");
        return;
      }

      const result = await backend.add_student(name, marksVal, subjVal);
      console.log("backend reply: ", result);
      
      setMessage("Student added successfully!");
    } catch (err) {
      setMessage("Error adding student");
    }
  };

  const fetchStudent = async () => {
    try {
      const result = await backend.get_student(name);
      if (result && result.length > 0) {
        setStudent(result[0]);
        setMessage("");
      } else {
        setMessage("Student not found");
        setStudent(null);
      }
    } catch (err) {
      setMessage("Error fetching student");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-2">Student Record</h1>
      <input
        className="border p-2 w-full mb-2"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="border p-2 w-full mb-2"
        placeholder="Total Marks"
        value={marks}
        onChange={(e) => setMarks(e.target.value)}
        type="number"
      />
      <input
        className="border p-2 w-full mb-2"
        placeholder="Number of Subjects"
        value={subjects}
        onChange={(e) => setSubjects(e.target.value)}
        type="number"
      />
      <div className="flex gap-2">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={addStudent}
        >
          Add Student
        </button>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={fetchStudent}
        >
          Fetch Student
        </button>
      </div>
      {message && <p className="mt-4 text-red-500">{message}</p>}
      {student && (
        <div className="mt-4 p-4 border rounded shadow">
          <h2 className="font-bold">Student Found:</h2>
          <p>Name: {student.name}</p>
          <p>Total Marks: {student.total_marks.toString()}</p>
          <p>Subjects: {student.num_subjects.toString()}</p>
        </div>
      )}
    </div>
  );
}
