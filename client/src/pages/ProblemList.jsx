import React, { useEffect, useState } from "react";
import axios from "axios";
// import {problems} from '../assets/problelist'
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import Navbar from "../components/Navbar";

function ProblemList({ heading }) {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [problems, setProblems] = useState([]);

  const {backendUrl} = useContext(AppContext);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(backendUrl+"/api/problem/all"
        );
        setProblems(response.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, []);

  const handleClick = (index) => {
    setSelectedIndex(index);
  };

  return (

    <div>
      <Navbar/>
    <div className="w-full md:w-10/12 lg:w-9/12 mx-auto mt-10 bg-gray-100 p-6 rounded-xl shadow-inner">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b border-gray-300 pb-2">
        {heading || "Problem List"}
      </h2>

      {problems.length > 0 ? (
        <div className="relative overflow-x-auto rounded-lg">
          <table className="w-full text-sm text-left text-gray-800">
            <thead className="text-xs uppercase bg-gray-300 text-gray-700">
              <tr>
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Tag</th>
                <th className="px-6 py-3">Difficulty</th>
              </tr>
            </thead>
            <tbody>
              {problems.map((item, index) => (
                <tr
                  key={item.slug}
                  className={`${
                    index % 2 === 0 ? "bg-white" : "bg-gray-200"
                  } transition cursor-pointer`}
                  onClick={() => handleClick(index)}
                >
                  <td className="px-6 py-4 font-medium">{index+1}</td>
                  <td className="px-6 py-4 text-blue-700 hover:underline">
                    <Link to={`/problemset/${item.slug}`}>{item.title}</Link>
                  </td>
                  <td className="px-6 py-4">General</td>
                  <td
                    className="px-6 py-4 font-semibold"
                    style={{
                      color:
                        item.difficulty === "Easy"
                          ? "green"
                          : item.difficulty === "Medium"
                          ? "#8B8000"
                          : "red",
                    }}
                  >
                    {item.difficulty || "Medium"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center m-auto"> 
           <p >Loading...</p>
               <div className = "spinner "></div>
        </div>
        
      )}
    </div>
    </div>
  );
}

export default ProblemList;
