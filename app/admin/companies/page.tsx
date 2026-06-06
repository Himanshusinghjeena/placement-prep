"use client";

import { useState, useEffect } from "react";

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    type: "Product",
    ctc: "",
    minCgpa: "",
    date: "",
    branches: [] as string[],
    rounds: [] as string[],
    description: "",
    website: "",
    location: "",
    employees: "",
  });

  useEffect(() => {
    fetch("/api/companies")
      .then((res) => res.json())
      .then((data) => setCompanies(data));
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/companies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        ctc: parseFloat(form.ctc),
        minCgpa: parseFloat(form.minCgpa),
      }),
    });
    if (res.ok) {
      const newCompany = await res.json();
      setCompanies((prev: any) => [newCompany, ...prev]);
      setShowForm(false);
      setForm({
        name: "",
        type: "Product",
        ctc: "",
        minCgpa: "",
        date: "",
        branches: [],
        rounds: [],
        description: "",
        website: "",
        location: "",
        employees: "",
      });
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/companies/${id}`, { method: "DELETE" });
    setCompanies((prev: any) => prev.filter((c: any) => c.id !== id));
  };

  const toggleBranch = (branch: string) => {
    setForm((prev) => ({
      ...prev,
      branches: prev.branches.includes(branch)
        ? prev.branches.filter((b) => b !== branch)
        : [...prev.branches, branch],
    }));
  };

  const toggleRound = (round: string) => {
    setForm((prev) => ({
      ...prev,
      rounds: prev.rounds.includes(round)
        ? prev.rounds.filter((r) => r !== round)
        : [...prev.rounds, round],
    }));
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Companies</h1>
          <p className="text-gray-400 mt-1">Manage placement drives</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + Add Company Drive
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-6">
          <h2 className="font-semibold text-white mb-4">New Placement Drive</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">
                Company Name
              </label>
              <input
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
                placeholder="e.g. Google"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Type</label>
              <select
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="Product">Product</option>
                <option value="Service">Service</option>
                <option value="Startup">Startup</option>
              </select>
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">
                CTC (LPA)
              </label>
              <input
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
                placeholder="e.g. 12"
                type="number"
                value={form.ctc}
                onChange={(e) => setForm({ ...form, ctc: e.target.value })}
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">
                Min CGPA
              </label>
              <input
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
                placeholder="e.g. 7.0"
                type="number"
                value={form.minCgpa}
                onChange={(e) => setForm({ ...form, minCgpa: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <label className="text-gray-400 text-sm mb-1 block">
                Drive Date
              </label>
              <input
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                Eligible Branches
              </label>
              <div className="flex gap-2 flex-wrap">
                {["CSE", "IT", "ECE", "ME", "CE", "EE"].map((b) => (
                  <button
                    key={b}
                    onClick={() => toggleBranch(b)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      form.branches.includes(b)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-gray-400 border border-gray-700"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-2 block">
                Interview Rounds
              </label>
              <div className="flex gap-2 flex-wrap">
                {["Aptitude", "Coding", "Technical", "HR", "GD"].map((r) => (
                  <button
                    key={r}
                    onClick={() => toggleRound(r)}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                      form.rounds.includes(r)
                        ? "bg-green-600 text-white"
                        : "bg-gray-800 text-gray-400 border border-gray-700"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div className="col-span-2">
              <label className="text-gray-400 text-sm mb-1 block">
                Description
              </label>
              <textarea
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
                rows={3}
                placeholder="About the company..."
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">
                Website
              </label>
              <input
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
                placeholder="https://company.com"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">
                Location
              </label>
              <input
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
                placeholder="e.g. Bangalore, India"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>

            <div>
              <label className="text-gray-400 text-sm mb-1 block">
                Employees
              </label>
              <input
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-blue-500"
                placeholder="e.g. 10,000+"
                value={form.employees}
                onChange={(e) =>
                  setForm({ ...form, employees: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Drive"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-gray-800 text-gray-400 px-6 py-2 rounded-lg text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Companies List */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left text-gray-400 text-sm font-medium p-4">
                Company
              </th>
              <th className="text-left text-gray-400 text-sm font-medium p-4">
                Type
              </th>
              <th className="text-left text-gray-400 text-sm font-medium p-4">
                CTC
              </th>
              <th className="text-left text-gray-400 text-sm font-medium p-4">
                Min CGPA
              </th>
              <th className="text-left text-gray-400 text-sm font-medium p-4">
                Date
              </th>
              <th className="text-left text-gray-400 text-sm font-medium p-4">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company: any) => (
              <tr
                key={company.id}
                className="border-b border-gray-800 hover:bg-gray-800"
              >
                <td className="p-4 font-medium text-white">{company.name}</td>
                <td className="p-4 text-gray-400 text-sm">{company.type}</td>
                <td className="p-4 text-green-400 text-sm">
                  ₹{company.ctc} LPA
                </td>
                <td className="p-4 text-gray-400 text-sm">{company.minCgpa}</td>
                <td className="p-4 text-gray-400 text-sm">{company.date}</td>
                <td className="p-4">
                  <button
                    onClick={() => handleDelete(company.id)}
                    className="text-red-400 hover:text-red-300 text-sm transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
