import React, { act, useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";


import CodeMirror from "@uiw/react-codemirror";
import { tokyoNight } from '@uiw/codemirror-theme-tokyo-night';
import {githubDark} from '@uiw/codemirror-theme-github';
import { cpp } from "@codemirror/lang-cpp";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";


const Submission = () => {

  const {backendUrl,userData} = useContext(AppContext)
  const {slug}= useParams();

  const [showModal, setShowModal] = useState(false);
  const [activeCode, setActiveCode] = useState("");
  const [activeLang, setActiveLang] = useState("cpp");
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);

  const openCodeModal = (code, language) => {
    setActiveCode(code);
    setActiveLang(language);
    setShowModal(true);
  };
  const closeModal = () => setShowModal(false);

  // Helper: Map language key to Prism language
  const getPrismLang = (lang) => {
    if (lang === "cpp" || lang === "c++" || lang === "c")
      return languages.clike;
    if (lang === "py" || lang === "python") return languages.python;
    if (lang === "java") return languages.java;
    if (lang === "js" || lang === "javascript") return languages.javascript;
    return languages.clike;
  };

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true);
      try {
        // If your backend expects GET /api/submissions/:slug
        axios.defaults.withCredentials=true;
        const { data } = await axios.get(`${backendUrl}/api/submissions/all/${slug}`);
        // If your backend expects POST with {slug}:
        // const { data } = await axios.post(`${backendUrl}/api/submission/getallsubmission`, { slug });

        if (data.success) {
          setSubmissions(data.submissions || []);
        } else {
          toast.error(data.message || "Failed to fetch submissions");
        }
      } catch (error) {
        toast.error(error.message || "Could not fetch submissions");
      } finally {
        setLoading(false);
      }
    };

    if (backendUrl && slug) fetchSubmissions();
  }, [backendUrl, slug]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-4xl mx-auto mt-10 p-4">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Submissions</h1>
        <div className="shadow rounded-lg bg-white overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-3 px-4 text-left text-gray-600 font-semibold">
                  #
                </th>
                <th className="py-3 px-4 text-left text-gray-600 font-semibold">
                  User
                </th>
                <th className="py-3 px-4 text-left text-gray-600 font-semibold">
                  Problem
                </th>
                <th className="py-3 px-4 text-left text-gray-600 font-semibold">
                  Language
                </th>
                <th className="py-3 px-4 text-left text-gray-600 font-semibold">
                  Verdict
                </th>
                <th className="py-3 px-4 text-left text-gray-600 font-semibold">
                  Code
                </th>
                <th className="py-3 px-4 text-left text-gray-600 font-semibold">
                  Submitted At
                </th>
              </tr>
            </thead>
            <tbody>
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    No submissions found.
                  </td>
                </tr>
              ) : (
                submissions.map((item, idx) => (
                  <tr
                    key={item._id}
                    className="odd:bg-gray-50 even:bg-gray-100"
                  >
                    <td className="py-3 px-4">{idx + 1}</td>
                    <td className="py-3 px-4">{userData.name}</td>
                    <td className="py-3 px-4">
                      <a
                        href={`/problemset/${item.problemSlug}`}
                        className="text-blue-600 hover:underline"
                      >
                        {item.problemSlug}
                      </a>
                    </td>
                    <td className="py-3 px-4 capitalize">{item.language}</td>
                    <td className="py-3 px-4">
                      <span
                        className={
                          item.verdict === "Accepted"
                            ? "text-green-600 font-bold"
                            : "text-red-600 font-bold"
                        }
                      >
                        {item.verdict}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        className="text-indigo-700 underline font-medium hover:text-indigo-900"
                        onClick={() => openCodeModal(item.code, item.language)}
                      >
                        View Code
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal with Code Editor (read-only) */}
      {showModal && (
        <div className="fixed top-1/2 left-1/2 z-50 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 px-3 py-6">
          <button
            onClick={closeModal}
            className="absolute top-3 right-5 text-gray-600 hover:text-gray-900 font-bold text-2xl"
            title="Close"
          >
            &times;
          </button>
          <div className="mb-2 flex gap-2 items-center">
            <span className="font-semibold">Language:</span>
            <span className="px-2 py-0.5 rounded bg-gray-200 text-gray-900 text-xs font-mono">
              {activeLang}
            </span>
          </div>
          <CodeMirror
                  value={activeCode}
                  theme={githubDark}
                  extensions={[cpp()]}
                  height="100%"
                  style={{
                    background: "white",
                    height: "600px",
                    borderRadius: 8,
                  }}
                />
        </div>
      )}
    </div>
  );
};

export default Submission;
