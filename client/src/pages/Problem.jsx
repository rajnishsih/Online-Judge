import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { AppContext } from "../context/AppContext";

import CodeMirror from "@uiw/react-codemirror";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";
import { githubDark } from "@uiw/codemirror-theme-github";
import { cpp } from "@codemirror/lang-cpp";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";

import axios from "axios";
import { useContext } from "react";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
function Problem() {
  const navigate = useNavigate();

  const { slug } = useParams();
  const [prob, setProb] = useState(null);
  const [lang, setLang] = useState("cpp");
  const [code, setCode] = useState(`
#include <iostream>
using namespace std;

int main() {
	// your code goes here

}
`);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [toggle, setToggle] = useState(0);
  const [submitResult, setSubmitResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const languageExtensions = {
    cpp: cpp(),
    python: python(),
    java: java(),
    // add more languages as needed
  };

  const { backendUrl } = useContext(AppContext);

  const handleRun = async (e) => {
    if (isLoading) return;

    setIsLoading(true);
    setToggle(1);
    setOutput("Running your code...");

    const payload = { language: lang, code, input };

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

  const handleSubmit = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setToggle(2);
    setSubmitResult(null);

    const payload = {
      language: lang,
      code,
      input,
    };
    try {
      const { data } = await axios.post(
        backendUrl + `/api/submissions/${slug}`,
        payload
      );
      console.log(data);
      if (data.success) {
        if (data.verdict !== "") setSubmitResult(data);
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(backendUrl + `/api/problem/${slug}`);
        setProb(response.data);
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchData();
  }, [slug]);

  if (!prob) {
    return (
      <div className="text-center text-gray-500 mt-10">Problem not found.</div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="mt-3 text-white bg-white  px-1">
        <div className="h-[90vh] overflow-hidden flex flex-col md:flex-row justify-between gap-1">
          {/* Problem Description */}
          <div className="bg-gray-800 rounded p-4 flex-1 overeflow-y-auto h-full">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h5 className="text-xl font-semibold">{prob.title}</h5>
                <h5
                  className={`font-semibold ${
                    prob.difficulty === "Easy"
                      ? "text-green-500"
                      : prob.difficulty === "Medium"
                      ? "text-yellow-400"
                      : "text-red-500"
                  }`}
                >
                  {prob.difficulty}
                </h5>
              </div>

              <button
                onClick={() => navigate(`/submission/${slug}`)}
                className="
        inline-flex items-center gap-2 
        px-5 py-2 rounded-md 
        font-semibold text-white 
        bg-gradient-to-r from-amber-500 to-yellow-600
        shadow-md border border-amber-700 
        transition-all duration-200 ease-in-out
        hover:from-amber-700 hover:to-yellow-700
        hover:shadow-lg hover:scale-105
        focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2
        active:scale-95
      "
              >
                <span>Submissions</span>
              </button>
            </div>
            <hr className="border-gray-600 mb-4" />
            <div>
              <div>
                <ReactMarkdown
                  components={{
                    h1: ({ node, ...props }) => (
                      <h1 className="text-2xl font-bold" {...props} />
                    ),
                    p: ({ node, ...props }) => (
                      <p className="mb-2" {...props} />
                    ),
                  }}
                >
                  {prob.statement}
                </ReactMarkdown>
              </div>
            </div>
          </div>

          {/* Solution Area */}
          <div className="bg-gray-800 rounded p-4 md:w-1/2 overflow-y-auto h-full">
            <div className="flex justify-between items-center mb-4">
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value)}
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
                  className={` text-black font-bold py-1 px-4 rounded ${
                    isLoading
                      ? "bg-green-200"
                      : "bg-green-400 hover:bg-green-500"
                  }`}
                >
                  Run
                </button>
                <button
                  onClick={handleSubmit}
                  className={` text-white font-bold py-1 px-4 rounded ${
                    isLoading ? "bg-red-200" : " bg-red-500 hover:bg-red-600"
                  }
                  `}
                >
                  Submit
                </button>
              </div>
            </div>

            <div className="">
              {/* Code Editor */}
              <div
                className="relative overflow-y-auto rounded-sm"
                style={{ height: "450px", overflowY: "auto" }}
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
              <div className="mt-1 bg-gray-900 p-4 rounded-sm shadow-md">
                {/* Toggle Buttons */}
                <div className="flex  gap-2 mb-3">
                  <button
                    className={`px-4 py-2 rounded font-semibold ${
                      toggle === 0
                        ? "bg-yellow-400 text-black"
                        : "bg-gray-600 text-gray-300"
                    }`}
                    onClick={() => setToggle(0)}
                  >
                    Input
                  </button>
                  <button
                    className={`px-4 py-2 rounded font-semibold ${
                      toggle == 1
                        ? "bg-yellow-400 text-black"
                        : "bg-gray-600 text-gray-300"
                    }`}
                    onClick={() => setToggle(1)}
                  >
                    Output
                  </button>
                  <button
                    className={`px-4 py-2 rounded font-semibold ${
                      toggle === 2
                        ? "bg-yellow-400 text-black"
                        : "bg-gray-600 text-gray-300"
                    }`}
                    onClick={() => setToggle(2)}
                  >
                    Verdict
                  </button>
                </div>

                {/* Input and output field*/}
                <div className="">
                  {toggle === 0 && (
                    <textarea
                      id="input"
                      onChange={(e) => setInput(e.target.value)}
                      value={input}
                      className="w-full h-28 bg-gray-100 text-gray-900 p-3 rounded-sm focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm resize-none"
                      placeholder="Enter input"
                    />
                  )}
                  {toggle === 1 && (
                    <div>
                      <pre className="w-full h-28 bg-black text-green-400 p-3 rounded-md font-mono text-sm overflow-y-auto whitespace-pre-wrap">
                        {output}
                      </pre>
                    </div>
                  )}
                  {toggle === 2 &&
                    (submitResult ? (
                      <>
                        <h3 className="font-bold mb-2">
                          Verdict: {submitResult.verdict}
                        </h3>
                        <table className="w-full text-sm table-fixed border-collapse">
                          <thead className="bg-gray-700">
                            <tr>
                              <th className="text-left px-2 py-1 w-8">#</th>
                              <th className="text-left px-2 py-1 w-20">
                                Status
                              </th>
                              <th className="text-left px-2 py-1">Expected</th>
                              <th className="text-left px-2 py-1">Received</th>
                            </tr>
                          </thead>
                          <tbody>
                            {submitResult.results.map((r) => (
                              <React.Fragment key={r.test}>
                                <tr
                                  className={
                                    r.passed ? "bg-green-900" : "bg-red-900"
                                  }
                                >
                                  <td className="px-2 py-1 align-top">
                                    {r.test}
                                  </td>
                                  <td className="px-2 py-1 align-top">
                                    {r.passed ? "✅" : "❌"}
                                  </td>
                                  <td className="px-2 py-1 whitespace-pre-wrap break-words">
                                    <pre className="whitespace-pre-wrap break-words">
                                      {r.expected}
                                    </pre>
                                  </td>
                                  <td className="px-2 py-1 whitespace-pre-wrap break-words">
                                    <pre className="whitespace-pre-wrap break-words">
                                      {r.received}
                                    </pre>
                                  </td>
                                </tr>
                                {r.error && (
                                  <tr>
                                    <td
                                      colSpan={4}
                                      className="bg-gray-800 text-red-300 px-2 py-1"
                                    >
                                      <pre className="whitespace-pre-wrap break-words">
                                        {r.error}
                                      </pre>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            ))}
                          </tbody>
                        </table>
                      </>
                    ) : (
                      <div className="text-center text-gray-400 h-25">
                        No submission yet
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Problem;
