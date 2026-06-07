import { useEffect, useState } from "react";
import axios from "axios";
import "../../index.css";

type DashboardData = {
  totalCourses: number;
  totalClasses: number;
};

export default function InstructorDashboard() {
  const [data, setData] = useState<DashboardData>({
    totalCourses: 0,
    totalClasses: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/instructor/total-count",
          { withCredentials: true }
        );

        setData({
          totalCourses: res.data.totalCourses,
          totalClasses: res.data.totalClasses,
        });
      } catch (error) {
        console.error("Dashboard API Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading)
    return <p style={{ textAlign: "center" }}>Loading dashboard...</p>;

  return (
    <div className="dashboard-wrapper">
      <h2 className="dashboard-title">Instructor Dashboard</h2>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h3>Total Courses</h3>
          <p className="count">{data.totalCourses}</p>
        </div>

        <div className="dashboard-card">
          <h3>Total Classes</h3>
          <p className="count">{data.totalClasses}</p>
        </div>
      </div>
    </div>
  );
}
