import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-clike";
import "prismjs/themes/prism.css";
import ReactMarkdown from "react-markdown";

import axios from "axios";
function Problem() {
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

  const handleRun = async (e) => {
    console.log(lang, code, input);
    if (isLoading) return;
    setIsLoading(true);
    setToggle(1);
    setOutput("submission queued");

    const payload = {
      language: lang,
      code,
      input,
    };
    try {
      const { data } = await axios.post("http://localhost:8000/run", payload);
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
        `http://localhost:8000/submit/${slug}`,
        payload
      );
      console.log(data);
      setSubmitResult(data);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/problems/${slug}`
        );
        setProb(response.data);
      } catch (error) {
        console.error("Error fetching data", error);
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
    <div className="mt-3 text-white bg-white  px-1">
      <div className="h-[90vh] overflow-hidden flex flex-col md:flex-row justify-between gap-1">
        {/* Problem Description */}
        <div className="bg-gray-800 rounded p-4 flex-1 overeflow-y-auto h-full">
          <div className="flex justify-between items-center mb-2">
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
          <hr className="border-gray-600 mb-4" />
          <div>
            <div>
              <ReactMarkdown
                components={{
                  h1: ({ node, ...props }) => (
                    <h1 className="text-2xl font-bold" {...props} />
                  ),
                  p: ({ node, ...props }) => <p className="mb-2" {...props} />,
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
                  isLoading ? "bg-green-200" : "bg-green-400 hover:bg-green-500"
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
                  overflowY: "auto",
                  outline: "none",
                  backgroundColor: "black",
                  boxSizing: "border-box",
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
                )
               } 
               { toggle === 1 && (
                  <div>
                    <pre className="w-full h-28 bg-black text-green-400 p-3 rounded-md font-mono text-sm overflow-y-auto whitespace-pre-wrap">
                      {output}
                    </pre>
                  </div>
                )
               }
                { toggle===2 &&
                 (submitResult ? (
                  <>
                    <h3 className="font-bold mb-2">
                      Verdict: {submitResult.verdict}
                    </h3>
                    <table className="w-full text-sm table-fixed border-collapse">
                      <thead className="bg-gray-700">
                        <tr>
                          <th className="text-left px-2 py-1 w-8">#</th>
                          <th className="text-left px-2 py-1 w-20">Status</th>
                          <th className="text-left px-2 py-1">Expected</th>
                          <th className="text-left px-2 py-1">Received</th>
                        </tr>
                      </thead>
                      <tbody>
                        {submitResult.results.map((r) => (
                          <tr
                            key={r.test}
                            className={r.passed ? "bg-green-900" : "bg-red-900"}
                          >
                            <td className="px-2 py-1 align-top">{r.test}</td>
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
  );
}

export default Problem;
