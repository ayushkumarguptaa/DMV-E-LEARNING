import React, { useEffect, useState } from "react";
import axios from "axios";

const students = [
  {
    id: "STU101",
    name: "Rahul Sharma",
    phone: "9876543210",
    email: "rahul@example.com",
    course: "Full Stack Development",
    enrolled: true,
    feePaid: 12000,
  },
  {
    id: "STU102",
    name: "Anjali Gupta",
    phone: "9123456789",
    email: "anjali@example.com",
    course: "MERN Stack",
    enrolled: true,
    feePaid: 15000,
  },
  {
    id: "STU103",
    name: "Aman Verma",
    phone: "9988776655",
    email: "aman@example.com",
    course: "Data Structures",
    enrolled: false,
    feePaid: 0,
  },
];

const StudentDashboard = () => {
  const [totalStudents, setTotalStudents] = useState(0);
  const [studen, setStuden] = useState([]);
  const [revenue, setTotalRevenue] = useState(0)


  useEffect(() => {
  const fetchTotalRevenue = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/admin/total-enrollment-amount"
      );

      setTotalRevenue(res.data.totalAmount);
    } catch (error) {
      console.error("Failed to fetch total revenue", error);
    }
  };

  fetchTotalRevenue();
}, []);


  useEffect(() => {
  const fetchEnrollments = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/admin/enrollments/details"
      );
      console.log(res.data.data)
      setStuden(res.data.data); // 👈 API DATA
    } catch (error) {
      console.error("Failed to fetch enrollments", error);
    }
  };

  fetchEnrollments();
}, []);


  /*FETCH TOTAL STUDENTS*/
  useEffect(() => {
    const fetchTotalStudents = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/admin/total-students"
        );
        setTotalStudents(res.data.totalClients);
      } catch (error) {
        console.error("Failed to fetch total students", error);
      }
    };

    fetchTotalStudents();
  }, []);

  /* KEEP LOGIC SAME */
  const totalSignups = totalStudents;
  const totalEnrolled = students.filter((s) => s.enrolled).length;
  const totalRevenue = students.reduce((sum, s) => sum + s.feePaid, 0);

  return (
    <div className="p-6 bg-gray-100 min-h-screen p-5">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow p-4">
          <h3 className="text-gray-500">Total Students</h3>
          <p className="text-3xl font-bold">{totalSignups}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow p-4">
          <h3 className="text-gray-500">Total Enrolled</h3>
          <p className="text-3xl font-bold">{totalEnrolled}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow p-4">
          <h3 className="text-gray-500">Total Revenue</h3>
          <p className="text-3xl font-bold">₹{revenue}</p>
        </div>
      </div>

      {/* Student Table */}
      {/* Student Table */}
<div className="bg-white rounded-xl shadow overflow-x-auto mt-4">
  <table className="min-w-full border-collapse">
    <thead className="bg-gray-200">
      <tr>
        <th className="px-4 py-3 text-left">ID</th>
        <th className="px-4 py-3 text-left">Name</th>
        {/* <th className="px-4 py-3 text-left">Phone</th> */}
        <th className="px-4 py-3 text-left">Email</th>
        <th className="px-4 py-3 text-left">Course</th>
        <th className="px-4 py-3 text-left">Payment_id</th>
        <th className="px-4 py-3 text-left">Order_id</th>
        <th className="px-4 py-3 text-left">Payment Status</th>
      </tr>
    </thead>

    <tbody>
      {studen.length > 0 ? (
        studen.map((student, index) => (
          <tr
            key={index}
            className="border-b hover:bg-gray-50"
          >
            {/* ID */}
            <td className="px-4 py-3">
  STU{student.client_id}
</td>


            {/* Name */}
            <td className="px-4 py-3 font-medium">
              {student.client_name}
            </td>

            {/* Phone (not in API) */}
            {/* <td className="px-4 py-3">
              —
            </td> */}

            {/* Email */}
            <td className="px-4 py-3">
              {student.client_email}
            </td>

            {/* Course */}
            <td className="px-4 py-3">
              {student.course_name}
            </td>

            {/* payment_id */}
            <td className="px-4 py-3">
              {student.payment_id ? student.payment_id : "N/A"}
            </td>

            {/* Order_id */}
             <td className="px-4 py-3">
              {student.order_id ? student.order_id : "N/A"}
            </td>

            {/* Payment status */}
            <td className="px-4 py-3">
              {student.payment_status ? student.payment_status : "N/A"}
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td
            colSpan="5"
            className="text-center py-6 text-gray-500"
          >
            No enrollment data found
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

    </div>
  );
};

export default StudentDashboard;
