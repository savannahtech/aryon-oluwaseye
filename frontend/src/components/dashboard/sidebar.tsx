import { useEffect } from "react";
import { useOutsideClick } from "@/hook/useOutsideClick";
import useStore from "@/store";
import { Button } from "../ui/button";
import {
  FileSearch2,
  LayoutDashboard,
  LogOut,
  NotepadText,
  Sparkles,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

const MENU = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Recommendations", path: "/recommendations", icon: Sparkles },
  { name: "Policies", path: "/policies", icon: NotepadText },
  { name: "Events", path: "/events", icon: FileSearch2 },
];

const Sidebar = () => {
  const { logout, showMenu, toggleMenu } = useStore();

  useEffect(() => {
    const recommendationsList = document.querySelector(
      ".recommendations-list",
    ) as HTMLElement;
    if (!recommendationsList) return;
    if (showMenu) {
      recommendationsList.style.overflow = "hidden";
    } else {
      recommendationsList.style.overflow = "auto";
    }
  }, [showMenu]);

  const ref = useOutsideClick(() => toggleMenu(false));

  return (
    <div
      ref={ref}
      data-testid="sidebar"
      className={`sidebar sticky top-0 z-10 h-screen shrink-0 basis-[225px] border-r border-r-slate-200 bg-white p-4 ${showMenu ? "active" : ""}`}
    >
      <div className="mb-10">
        <h1>
          <span className="syne text-center font-serif text-4xl font-semibold tracking-tight text-teal-600">
            ARYON
          </span>
          <span className="block text-xs leading-none text-gray-700">
            Enterprise
          </span>
        </h1>
      </div>

      <p className="mb-1.5 text-xs font-medium text-slate-600">Platform</p>
      <div className="flex h-[calc(100dvh-142px)] flex-col justify-between">
        <nav className="flex flex-col gap-2">
          {MENU.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              activeProps={{ className: "bg-teal-100 text-teal-600" }}
              className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        <div>
          <div className="flex items-center gap-3 py-4">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-300 text-center text-teal-900">
                <p>YL</p>
              </div>
            </div>
            <div className="py-1">
              <p className="mb-1 font-semibold leading-none">Yair Lad</p>
              <p className="text-sm leading-none">yair@aryon.security</p>
            </div>
          </div>
          <Button onClick={logout} variant="destructive" className="w-full">
            <LogOut />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
