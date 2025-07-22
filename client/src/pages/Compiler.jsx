import React, { useState } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/themes/prism-tomorrow.css";
import axios from "axios";

function Compiler() {
  const [code, setCode] = useState(`\
#include <iostream>
using namespace std;

int main() {
    // your code goes here
}`);
  const [language, setLanguage] = useState("cpp");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRun = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setOutput("submission queued");
    const payload = {
      language,
      code,
      input,
    };
    try {
      const { data } = await axios.post("http://localhost:8001/run", payload);
      setOutput(data.output);
    } catch (error) {
      console.log(error);
      if (error.response) {
        setOutput(
          `Error: ${error.response.data.error || "Server error occurred"}`
        );
      } else if (error.request) {
        setOutput("Error: Could not connect to server.");
      } else {
        setOutput(`Error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-[#e5e5e5] pt-3 px-4 font-sans">
      <h1 className="text-4xl font-bold text-center mb-4 text-indigo-400">
        Code Compiler
      </h1>

      <div className="flex flex-col lg:flex-row gap-3">
        {/*Editor */}
        <div className="w-full lg:w-1/2 bg-gray-800 p-4 rounded-md">
          <div className="flex justify-between items-center mb-4">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-gray-700 text-white rounded px-2 py-1"
            >
              <option value="cpp">C++</option>
              <option value="java">Java</option>
              <option value="py">Python</option>
            </select>
            <button
              onClick={handleRun}
              disabled={isLoading}
              className={`text-black font-bold py-1 px-4 rounded ${
                isLoading
                  ? "bg-green-200 cursor-not-allowed"
                  : "bg-green-400 hover:bg-green-500"
              }`}
            >
              {isLoading ? "Running..." : "Run"}
            </button>
          </div>

          <div
            className="rounded overflow-y-auto border border-gray-700"
            style={{ height: "550px" }}
          >
            <Editor
              value={code}
              onValueChange={setCode}
              highlight={(code) =>
                highlight(code, languages.cpp || languages.clike)
              }
              padding={10}
              style={{
                fontFamily: '"Fira Code", monospace',
                fontSize: 14,
                height: "100%",
                backgroundColor: "black",
                color: "#f8f8f2",
                outline: "none",
                overflowY: "auto",
              }}
            />
          </div>
        </div>

        {/*Input/Output Panel */}
        <div className="w-full  lg:w-1/2 bg-gray-900 p-4 rounded-md shadow-md">
          {/* input field*/}
          <div className="mb-3">
            <button
              className={`px-4 py-2 rounded font-bold mb-4 bg-yellow-400 text-black `}
              onClick={() => setMain(true)}
            >
              Input
            </button>
            <textarea
              id="input"
              onChange={(e) => setInput(e.target.value)}
              value={input}
              className="w-full h-40 bg-gray-100 text-gray-900 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm resize-none"
              placeholder="Enter input"
            />
          </div>

          {/* output field */}
          <div>
            <button
              className={`px-4 py-2 rounded font-bold mb-4 bg-gray-700 text-gray-300`}
              onClick={() => setMain(false)}
            >
              Output
            </button>
            <pre className="w-full h-40 bg-black text-green-400 p-3 rounded-md font-mono text-sm overflow-y-auto whitespace-pre-wrap">
              {output || "No output yet"}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Compiler;
