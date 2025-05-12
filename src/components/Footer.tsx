import React from 'react';
export function Footer() {
  return <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-medium mb-3">
              About Anguilla Ferry Tracker
            </h3>
            <p className="text-gray-300 text-sm">
              A comprehensive tool for tracking ferry schedules to and from
              Anguilla. Stay updated with the latest information on routes,
              times, and operators.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-3">Quick Links</h3>
            <ul className="text-gray-300 text-sm space-y-2">
              <li>
                <a href="#" className="hover:text-white">
                  Ferry Schedules
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Operators
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Travel Requirements
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-3">Contact Information</h3>
            <ul className="text-gray-300 text-sm space-y-2">
              <li>Email: info@anguillaferrytracker.com</li>
              <li>Phone: +1 (264) 123-4567</li>
              <li>Address: The Valley, Anguilla</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-300 text-sm">
            © {new Date().getFullYear()} Anguilla Ferry Tracker. All rights
            reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-4">
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>;
}