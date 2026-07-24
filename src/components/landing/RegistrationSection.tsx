"use client";

import React from "react";
import { SignUpForm } from "@/components/auth/signup";

export function RegistrationSection() {
  return (
    <section className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden" id="register">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-50 dark:bg-indigo-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-50 dark:bg-purple-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 -translate-x-1/3 translate-y-1/3"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1 text-center lg:text-left">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
            Ready to Become a <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Campus Hero?</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
            Join our exclusive ambassador program today. Represent your institution, lead initiatives, and earn amazing rewards while making a real impact on campus.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">1</div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 text-left">Sign up with your<br/>campus details</p>
            </div>
            <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">2</div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 text-left">Get approved by<br/>your admin</p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-gray-700 relative z-20">
            <h3 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Registration Form</h3>
            <div className="max-h-[500px] overflow-y-auto px-2 py-4 custom-scrollbar">
              <SignUpForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
