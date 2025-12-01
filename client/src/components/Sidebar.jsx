// Sidebar.jsx
import { Protect, useClerk, useUser } from "@clerk/clerk-react";
import {
  Eraser,
  FileText,
  Hash,
  House,
  Image,
  LogOut,
  Scissors,
  SquarePen,
  Users,
} from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/ai", label: "Dashboard", Icon: House },
  { to: "/ai/write-article", label: "Write Article", Icon: SquarePen },
  { to: "/ai/blog-titles", label: "Blog Titles", Icon: Hash },
  { to: "/ai/generate-images", label: "Generate Images", Icon: Image },
  { to: "/ai/remove-background", label: "Remove Background", Icon: Eraser },
  { to: "/ai/remove-object", label: "Remove Object", Icon: Scissors },
  { to: "/ai/review-resume", label: "Review Resume", Icon: FileText },
  { to: "/ai/community", label: "Community", Icon: Users },
];

const Sidebar = ({ sidebar, setSidebar }) => {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  return (
    <div
      className={`
        sidebar
        w-56 sm:w-60 lg:w-64
        bg-stone-100 border-r border-gray-100
        flex flex-col justify-between items-center
        fixed sm:static 
        top-14 sm:top-0
        bottom-0 left-0 
        z-40
        h-screen sm:h-full
        overflow-y-auto sm:overflow-y-auto
        ${
          sidebar ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
        } transition-transform duration-300 ease-in-out
        shadow-lg sm:shadow-none
      `}
    >
      {/* Top Section - Navigation */}
      <div className="my-7 w-full flex-shrink-0">
        <img
          src={user?.imageUrl}
          alt="User Avatar"
          className="w-14 h-14 rounded-full mx-auto object-cover"
        />
        <h1 className="mt-1 text-center text-sm font-medium">
          {user?.fullName || "Guest User"}
        </h1>

        <div className="px-2 mt-6 text-sm text-gray-600 font-medium space-y-1">
          {navItems.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/ai"}
              onClick={() => setSidebar(false)}
              className={({ isActive }) =>
                `
                px-3.5 py-2.5
                flex items-center gap-3
                rounded text-sm
                transition-colors
                ${
                  isActive
                    ? "bg-gradient-to-r from-[#46c342] to-[#529dc5] text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }
                `
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="truncate">{label}</span>
            </NavLink>
          ))}
        </div>
      </div>

      {/* Bottom Section - User Info & Logout */}
      <div className="w-full border-t border-gray-200 p-4 px-6 flex items-center justify-between flex-shrink-0">
        <button
          type="button"
          onClick={openUserProfile}
          className="flex gap-2 items-center cursor-pointer text-left hover:opacity-70 transition-opacity"
        >
          <img
            src={user?.imageUrl}
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            alt="User"
          />
          <div className="min-w-0">
            <h1 className="text-sm font-medium truncate">
              {user?.fullName || "Account"}
            </h1>
            <p className="text-xs text-gray-500">
              <Protect plan="premium" fallback="Free">
                Premium
              </Protect>{" "}
              Plan
            </p>
          </div>
        </button>

        <LogOut
          onClick={signOut}
          className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors cursor-pointer flex-shrink-0"
        />
      </div>
    </div>
  );
};

export default Sidebar;