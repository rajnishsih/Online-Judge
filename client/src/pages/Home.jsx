import React from "react";
import { Link } from "react-router-dom";
import bgImage from "../assets/images/9.png";
import Navbar from "../components/Navbar";

export default function Home() {
  return (


    <div>
     <Navbar/>
   
    <div
      className="min-h-screen bg-cover bg-center flex flex-col">
      {/* Overlay */}
      <div className="bg-black bg-opacity-70 flex-1 flex flex-col justify-center items-center px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Sharpen Your Coding Skills
        </h1>
        <p className="text-lg md:text-2xl text-gray-200 mb-8 max-w-xl">
          Solve real-world problems, improve your logic, and prepare for tech interviews.
        </p>
        <Link to="/problemset">
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-lg transition">
            Practice Now
          </button>
        </Link>
      </div>

      {/* Features Section */}
      <div className="bg-gray-900 py-12 px-6 md:px-20 text-white text-center">
        <h2 className="text-3xl font-bold mb-8">Why Choose Our Platform?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-2">Real-Time Code Execution</h3>
            <p className="text-gray-300">Run your code in C++, Python, or Java and get instant feedback.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-2">Test Against Cases</h3>
            <p className="text-gray-300">Submit your solution and evaluate it against multiple testcases.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
            <p className="text-gray-300">Keep track of your solved problems and continue your journey.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-950 py-4 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} Online Judge. Built with 💻 & Tailwind CSS.
      </footer>
    </div>

     </div>
  );
}
