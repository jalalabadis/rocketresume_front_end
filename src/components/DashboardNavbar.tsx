import React from "react";
import { Link } from "react-router-dom";
import { FileText, Download, Settings, User, Bell } from "lucide-react";

const DashboardNavbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <FileText className="h-8 w-8 text-primary-600" />
                <span className="text-xl font-bold text-gray-900">
                  ResumeBuilder
                </span>
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* <button
              type="button"
              className="p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" />
            </button>

            <button
              type="button"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Download className="h-5 w-5" />
              <span className="text-sm font-medium">Export</span>
            </button>

            <button
              type="button"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <Settings className="h-5 w-5" />
              <span className="text-sm font-medium">Settings</span>
            </button> */}

            <div className="flex items-center space-x-3 pl-3 ml-3 border-l border-gray-200">
              <button
                type="button"
                className="flex items-center space-x-2 text-sm focus:outline-none"
              >
                <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary-600" />
                </div>
                <span className="hidden md:inline-block font-medium text-gray-700">
                  John Doe
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
