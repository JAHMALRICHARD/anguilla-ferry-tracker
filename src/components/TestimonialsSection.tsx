import React from 'react';
import { StarIcon } from 'lucide-react';
export function TestimonialsSection() {
  return <div className="mb-16">
      <h2 className="text-2xl font-bold mb-8">Testimonials</h2>
      <div className="bg-[#151923] p-6 rounded-xl">
        <div className="flex items-center space-x-1 mb-4">
          {[...Array(5)].map((_, i) => <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />)}
        </div>
        <p className="text-gray-300 mb-4">
          "Outstanding service! The ferry was on time and the staff was
          incredibly helpful. Made traveling between islands a breeze."
        </p>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full"></div>
          <div>
            <p className="font-medium">Sarah Mitchell</p>
            <p className="text-sm text-gray-400">Frequent Traveler</p>
          </div>
        </div>
      </div>
    </div>;
}