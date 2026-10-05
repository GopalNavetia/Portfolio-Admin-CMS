import { useEffect, useState } from "react";
import api from "../api/axios";

const initialForm = {
  name: "",
  title: "",
  summary: "",
  email: "",
  phone: "",
  location: "",
  profileImage: "",
  resumeUrl: "",
  githubUrl: "",
  linkedinUrl: "",
};

const fields = [
  ["name", "Name"],
  ["title", "Title"],
  ["email", "Email"],
  ["phone", "Phone"],
  ["location", "Location"],
  ["profileImage", "Profile image URL"],
  ["resumeUrl", "Resume URL"],
  ["githubUrl", "GitHub URL"],
  ["linkedinUrl", "LinkedIn URL"],
];

export default function About() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/about")
      .then(({ data }) => setForm({ ...initialForm, ...data }))
      .catch(() => setStatus("Unable to load about information."))
      .finally(() => setLoading(false));
  }, []);
  
  const submit = async (event) => {
    event.preventDefault();
    setErrors({});
    setStatus("");
    try {
      const { data } = await api.put("/admin/about/update", form);
      setForm({ ...initialForm, ...data });
      setStatus("About information saved successfully.");
    } catch (err) {
      setErrors(err.response?.data?.fieldErrors || {});
      setStatus(
        err.response?.data?.fieldErrors
          ? ""
          : err.response?.data?.message || "Unable to save changes.",
      );
    }
  };
  
  if (loading) return <p className="text-slate-600">Loading...</p>;
  return (
    <section className="mx-auto max-w-4xl">
      <h2 className="mb-6 text-2xl font-semibold text-slate-900">About</h2>

      <form onSubmit={submit}       className="border border-slate-200 bg-white p-4 sm:p-6">
        {status && (
          <div
            className={`mb-5 rounded-lg p-3 text-sm ${status.includes("successfully") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
          >
            {status}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map(([name, label]) => (
            <label key={name} className="text-sm font-medium text-slate-700">
              {label}
              <input
                value={form[name]}
                onChange={(e) => setForm({ ...form, [name]: e.target.value })}
                className="mt-1 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
              />
              {errors[name] && (
                <span className="mt-1 block text-xs text-red-600">
                  {errors[name]}
                </span>
              )}
            </label>
          ))}

          <label className="text-sm font-medium text-slate-700 sm:col-span-2">
            Summary
            <textarea
              rows="5"
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
            {errors.summary && (
              <span className="mt-1 block text-xs text-red-600">
                {errors.summary}
              </span>
            )}
          </label>
        </div>

        <button className="mt-6 h-11 w-full cursor-pointer rounded-md bg-blue-600 px-5 font-medium text-white transition-colors hover:bg-blue-700 sm:w-auto">
          Save
        </button>
      </form>
    </section>
  );
}
