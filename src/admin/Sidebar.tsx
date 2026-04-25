import { NavLink } from "react-router-dom";
import '../index.css'

const menuItems = [
  { name: "Dashboard", path: "/admin/dashboard" },
  { name: "Courses", path: "/admin/addcourse" },
  { name: "Quiz", path: "/admin/quiz" },
  { name: "Instructor", path: "/admin/addinstructor" },
  { name: "Classes", path: "/admin/classes" },
  { name: "Pop Up", path: "/admin/popup" },
//   { name: "Payments", path: "/admin/payments" },
//   { name: "Offers & Gallery", path: "/admin/offers-gallery" },
//   { name: "Profile", path: "/admin/profile" },
//   { name: "Restaurant Profile", path: "/admin/restaurant-profile" },
];

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white border-r">
      <h2 className="font-bold text-xl p-4">Admin</h2>

      <nav className="flex flex-col gap-1">
        {menuItems.map((item) => (
          <NavLink
  key={item.name}
  to={item.path}
  className={({ isActive }) =>
    `px-4 py-2 rounded-r-full sidebar ${
      isActive
        ? "bg-purple-600 text-white"
        : "text-black hover:bg-orange-100"
    }`
  }
>
  {item.name}
</NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
