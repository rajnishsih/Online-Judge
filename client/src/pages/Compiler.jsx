import React, { useContext, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import ReactMarkdown from "react-markdown";
import CodeMirror from "@uiw/react-codemirror";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";
import { githubDark } from "@uiw/codemirror-theme-github";
import { cpp } from "@codemirror/lang-cpp";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { AppContext } from "../context/AppContext";

function Compiler() {
  const { backendUrl } = useContext(AppContext);
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
  const [aiReview, setAiReview] = useState("");
  const [isAIReviewing, setIsAIReviewing] = useState(false);
  const [showAIReview,setShowAIReview] = useState(false);

  const handleRun = async (e) => {
    if (isLoading) return;

    setIsLoading(true);
    setOutput("Running your code...");

    const payload = { language, code, input };

    try {
      const { data } = await axios.post(backendUrl + "/run", payload);

      console.log(data);

      if (data.success) {
        setOutput(data.output || "No output.");
      } else {
        const errorMsg = data.error || "Unknown error.";
        if (data.errorType === "compilation") {
          setOutput("Compilation Error:\n\n" + errorMsg);
        } else if (data.errorType === "tle") {
          setOutput("Time Limit Exceeded");
        } else if (data.errorType === "runtime") {
          setOutput("Runtime Error:\n\n" + errorMsg);
        } else {
          setOutput(errorMsg);
        }
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAIReview = async () => {
    if (isAIReviewing) return;
    setShowAIReview(true);
    setAiReview("Reviewing your code...");
    try {
      // Example POST; adjust endpoint as needed
      const { data } = await axios.post(backendUrl + "/api/ai/code-review", {
        code,
      });
      console.log(data);
      setAiReview(data.aiResponse || "No feedback received.");
    } catch (err) {
      setAiReview("AI review failed. Try again.");
    } finally {
      setIsAIReviewing(false);
    }
  };

  return (
    <>
      <Navbar />
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

              <div className="flex gap-2">
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

                <button
                  onClick={handleAIReview}
                  disabled={isAIReviewing || isLoading}
                  className={`text-white font-bold py-1 px-4 rounded
        ${
          isAIReviewing
            ? "bg-blue-200 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }
      `}
                >
                  {isAIReviewing ? "Reviewing..." : "AI Review"}
                </button>
              </div>
            </div>

            <div
              className="rounded overflow-y-auto border border-gray-700"
              style={{ height: "550px" }}
            >
              <CodeMirror
                value={code}
                onChange={setCode}
                theme={githubDark}
                extensions={[cpp()]}
                height="100%"
                style={{
                  background: "white",
                  height: "100%", // Or "450px"
                  borderRadius: 8,
                }}
              />
            </div>
          </div>

         <div className="relative w-full lg:w-1/2 bg-gray-800 px-3 py-3 rounded-md">
            <div className="flex flex-col gap-5">
              <div className="bg-gray-900 p-4 rounded-md shadow-md">
                <h2 className="text-lg font-semibold text-gray-100 mb-2">
                  Input
                </h2>
                <textarea
                  id="input"
                  onChange={(e) => setInput(e.target.value)}
                  value={input}
                  className="w-full min-h-32 max-h-40 bg-gray-100 text-gray-900 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm resize-y"
                  placeholder="Enter input"
                />
              </div>
              <div className="bg-gray-900 p-4 rounded-md shadow-md">
                <h2 className="text-lg font-semibold text-gray-100 mb-2">
                  Output
                </h2>
                <pre className="w-full h-40 bg-black text-green-400 p-3 rounded-md font-mono text-sm overflow-y-auto whitespace-pre-wrap">
                  {output}
                </pre>
              </div>
            </div>

            {/* AI Review Drawer/Popover */}
            {showAIReview && (
              <>
                {/* backdrop (optional, transparent and only covers right panel) */}
                <div
                  className="fixed inset-0 z-30"
                  style={{ pointerEvents: "none" }}
                />
                {/* actual drawer: absolute over right panel */}
                <div
                 className="absolute inset-0 z-40 flex flex-col bg-[#283046] border border-blue-900 rounded-xl p-6 shadow-2xl"
                  style={{ minHeight: "350px" }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-blue-700 flex items-center justify-center">
                        <svg
                          viewBox="0 0 24 24"
                          width="20"
                          height="20"
                          fill="none"
                          className="text-white"
                        >
                          <path
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 3v4m0 8v4m4.24-10.24l2.83 2.83m-10.25 2.83l-2.83 2.83M21 12h-4M7 12H3m5.76-6.24L10.59 6.58m2.83 10.25l1.41 1.41"
                          />
                        </svg>
                      </div>
                      <span className="text-blue-200 text-lg font-semibold">
                        AI Review
                      </span>
                      {isAIReviewing && (
                        <span className="text-blue-300 animate-pulse text-xs ml-2">
                          (working...)
                        </span>
                      )}
                    </div>
                    {/* Close button */}
                    <button
                      onClick={() => setShowAIReview(false)}
                      className="text-blue-200 text-lg hover:text-white px-2"
                      style={{ pointerEvents: "all" }}
                    >
                      &times;
                    </button>
                  </div>
                  <div className="overflow-y-auto flex-1 pr-1 pt-2">
                    <ReactMarkdown
                      components={{
                        h1: ({ node, ...props }) => (
                          <h1
                            className="text-lg font-bold mb-2"
                            {...props}
                          />
                        ),
                        p: ({ node, ...props }) => (
                          <p
                            className="mb-2 leading-relaxed"
                            {...props}
                          />
                        ),
                        ul: ({ node, ...props }) => (
                          <ul
                            className="list-disc list-inside mb-2"
                            {...props}
                          />
                        ),
                        code: ({ node, ...props }) => (
                          <code
                            className="bg-blue-900 text-blue-200 px-2 py-1 rounded text-xs"
                            {...props}
                          />
                        ),
                        pre: ({ node, ...props }) => (
                          <pre
                            className="bg-black text-blue-200 p-3 rounded-md mb-2 overflow-x-auto"
                            {...props}
                          />
                        ),
                      }}
                    >
                      {aiReview || "No review yet"}
                    </ReactMarkdown>
                  </div>
                </div>
                {/* Click-away area (optional): covers only the input/output panel behind popover */}
                <div
                  className="absolute inset-0 z-30"
                  style={{ cursor: "pointer", background: "transparent" }}
                  onClick={() => setShowAIReview(false)}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Compiler;
