// src/components/layout/Sidebar.jsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();
  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen">
      <div className="p-4 flex items-center space-x-2">
        <svg
          className="w-8 h-8 text-blue-600"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"></path>
          <button>
            <circle cx="12" cy="12" r="5" fill="currentColor"></circle>
          </button>
        </svg>
        <span className="text-blue-600 text-xl font-semibold">RTracker</span>
      </div>

      <nav className="mt-4 flex-1">
        <div className="px-3 py-2">
          <Link
            href="/"
            className={
              pathname === "/"
                ? "flex items-center px-3 py-2 text-sm rounded-md bg-gray-100 text-gray-900"
                : "flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100 text-gray-900"
            }
          >
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              ></path>
            </svg>
            Dashboard
          </Link>
        </div>

        <div className="px-3 py-2">
          <Link
            href="/input"
            className={
              pathname === "/input"
                ? "flex items-center px-3 py-2 text-sm rounded-md bg-gray-100 text-gray-900"
                : "flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100 text-gray-900"
            }
          >
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
            Ibadah Harian
          </Link>
        </div>

        <div className="px-3 py-2">
          <Link
            href="/history"
            className={
              pathname === "/history"
                ? "flex items-center px-3 py-2 text-sm rounded-md bg-gray-100 text-gray-900"
                : "flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100 text-gray-900"
            }
          >
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              ></path>
            </svg>
            Data Ibadah
          </Link>
        </div>

        <div className="px-3 py-2">
          <Link
            href="/setting"
            className={
              pathname === "/setting"
                ? "flex items-center px-3 py-2 text-sm rounded-md bg-gray-100 text-gray-900"
                : "flex items-center px-3 py-2 text-sm rounded-md hover:bg-gray-100 text-gray-900"
            }
          >
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
            Setting
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
