import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const AdminLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 bg-[#fffaf6] overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
