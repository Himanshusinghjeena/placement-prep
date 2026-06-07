"use client";

import { useState, useEffect } from "react";

const difficulties = ["All", "Easy", "Medium", "Hard"];


export default function ProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [filter, setFilter] = useState("All");
  const [company, setCompany] = useState("All Companies");
  const [search, setSearch] = useState("");
  const [solved, setSolved] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/problems")
      .then((res) => res.json())
      .then((data) => setProblems(data));

    fetch("/api/problems/solved")
      .then((res) => res.json())
      .then((data) => setSolved(data.map((p: any) => p.problemId)));
  }, []);

  const filtered = problems.filter((p: any) => {
  const matchDiff = filter === 'All' || p.difficulty === filter
  const matchSearch = 
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.companies.some((c: string) => c.toLowerCase().includes(search.toLowerCase()))
  return matchDiff && matchSearch
})

  const toggleSolved = async (problemId: string) => {
    setSolved((prev) =>
      prev.includes(problemId)
        ? prev.filter((id) => id !== problemId)
        : [...prev, problemId],
    );
    await fetch("/api/problems/solve", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ problemId }),
    });
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">DSA Problems</h1>
        <p className="text-gray-400 mt-1">
          {solved.length}/{problems.length} Solved
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <input
          type="text"
          placeholder="🔍 Search problems or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500 w-72"
        />
        {difficulties.map((d) => (
          <button
            key={d}
            onClick={() => setFilter(d)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === d
                ? "bg-blue-600 text-white"
                : "bg-gray-900 border border-gray-700 text-gray-400 hover:text-white"
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      

      {/* Results count */}
      <p className="text-gray-500 text-sm mb-4">
        {filtered.length} problems found
      </p>

      {/* Problems Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
  <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left text-gray-400 text-sm font-medium p-4 w-12">
                Status
              </th>
              <th className="text-left text-gray-400 text-sm font-medium p-4">
                #
              </th>
              <th className="text-left text-gray-400 text-sm font-medium p-4">
                Title
              </th>
              <th className="text-left text-gray-400 text-sm font-medium p-4">
                Difficulty
              </th>
              <th className="text-left text-gray-400 text-sm font-medium p-4">
                Companies
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-gray-500 py-12">
                  No problems found
                </td>
              </tr>
            ) : (
              filtered.map((problem: any, index: number) => (
                <tr
                  key={problem.id}
                  className="border-b border-gray-800 hover:bg-gray-800 transition-colors"
                >
                  <td className="p-4">
                    <button
                      onClick={() => toggleSolved(problem.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        solved.includes(problem.id)
                          ? "bg-green-500 border-green-500"
                          : "border-gray-600 hover:border-green-500"
                      }`}
                    >
                      {solved.includes(problem.id) && (
                        <span className="text-white text-xs">✓</span>
                      )}
                    </button>
                  </td>
                  <td className="p-4 text-gray-500 text-sm">{index + 1}</td>
                  <td className="p-4">
                    <a
                      href={problem.leetcodeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white hover:text-blue-400 transition-colors font-medium"
                    >
                      {problem.title}
                    </a>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        problem.difficulty === "Easy"
                          ? "bg-green-900 text-green-400"
                          : problem.difficulty === "Medium"
                            ? "bg-yellow-900 text-yellow-400"
                            : "bg-red-900 text-red-400"
                      }`}
                    >
                      {problem.difficulty}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-1 flex-wrap">
                      {problem.companies.slice(0, 3).map((c: string) => (
                        <span
                          key={c}
                          onClick={() => setCompany(c)}
                          className="px-2 py-0.5 bg-purple-900 text-purple-400 text-xs rounded cursor-pointer hover:bg-purple-800"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}
