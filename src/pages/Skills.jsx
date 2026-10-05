import { useEffect, useState } from "react";
import api from "../api/axios";

const empty = { name: "", category: "LANGUAGES", proficiencyLevel: "" };
const categories = ["LANGUAGES", "BACKEND", "FRONTEND", "DATABASE", "TOOLS"];

export default function Skills() {
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  
  const load = () =>
    api
      .get("/skills/get")
      .then(({ data }) => setSkills(data))
      .catch(() => setMessage("Unable to load skills."));
  useEffect(() => {
    load();
  }, []);
  
  const submit = async (event) => {
    event.preventDefault();
    setErrors({});
    setMessage("");
    try {
      if (editingId) await api.put(`/admin/skills/update/${editingId}`, form);
      else await api.post("/admin/skills/create", form);
      setForm(empty);
      setEditingId(null);
      setMessage("Skill saved successfully.");
      load();
    } catch (err) {
      setErrors(err.response?.data?.fieldErrors || {});
      setMessage(
        err.response?.data?.fieldErrors
          ? ""
          : err.response?.data?.message || "Unable to save skill.",
      );
    }
  };
  
  const remove = async (id) => {
    if (!window.confirm("Delete this skill?")) return;
    try {
      await api.delete(`/admin/skills/delete/${id}`);
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || "Unable to delete skill.");
    }
  };
  
  const edit = (skill) => {
    setEditingId(skill.id);
    setForm({
      name: skill.name,
      category: skill.category,
      proficiencyLevel: skill.proficiencyLevel,
    });
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  
  return (
    <section className="mx-auto max-w-5xl">
      
      <h2 className="mb-6 text-2xl font-semibold text-slate-900">Skills</h2>
      
      <form
        onSubmit={submit}
        className="mb-8 border border-slate-200 bg-white p-4 sm:p-6"
      >
        <h3 className="mb-4 text-lg font-semibold">
          {editingId ? "Edit skill" : "Add skill"}
        </h3>
      
        <div className="grid gap-4 sm:grid-cols-3">
          <Field
            label="Name"
            value={form.name}
            error={errors.name}
            onChange={(value) => setForm({ ...form, name: value })}
          />
      
          <label className="text-sm font-medium text-slate-700">
            Category
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="mt-1 h-11 w-full cursor-pointer rounded-md border border-slate-300 px-3 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
            {errors.category && (
              <span className="text-xs text-red-600">{errors.category}</span>
            )}
          </label>
      
          <Field
            label="Proficiency level"
            value={form.proficiencyLevel}
            error={errors.proficiencyLevel}
            onChange={(value) => setForm({ ...form, proficiencyLevel: value })}
          />
        </div>
        {message && (
          <p
            className={`mt-4 text-sm ${message.includes("successfully") ? "text-green-600" : "text-red-600"}`}
          >
            {message}
          </p>
        )}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button className="h-11 w-full cursor-pointer rounded-md bg-blue-600 px-5 font-medium text-white transition-colors hover:bg-blue-700 sm:w-auto">
            {editingId ? "Update" : "Create"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(empty);
              }}
              className="h-11 w-full cursor-pointer rounded-md border border-slate-300 px-5 hover:bg-slate-50 sm:w-auto"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      
      <div className="hidden overflow-hidden border border-slate-200 bg-white md:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Proficiency</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {skills.map((skill) => (
              <tr key={skill.id}>
                <td className="p-4 font-medium">{skill.name}</td>
                <td className="p-4">{skill.category}</td>
                <td className="p-4">{skill.proficiencyLevel}</td>
                <td className="p-4">
                  <button
                    onClick={() => edit(skill)}
                    className="mr-3 cursor-pointer text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => remove(skill.id)}
                    className="cursor-pointer text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="space-y-3 md:hidden">
        {skills.map((skill) => (
          <article key={skill.id} className="border border-slate-200 bg-white p-4">
            <dl className="space-y-2 text-sm">
              <div><dt className="text-xs font-medium uppercase text-slate-500">Name</dt><dd className="font-medium text-slate-900">{skill.name}</dd></div>
              <div><dt className="text-xs font-medium uppercase text-slate-500">Category</dt><dd className="text-slate-700">{skill.category}</dd></div>
              <div><dt className="text-xs font-medium uppercase text-slate-500">Proficiency</dt><dd className="text-slate-700">{skill.proficiencyLevel}</dd></div>
            </dl>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <button onClick={() => edit(skill)} className="h-10 w-full cursor-pointer rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50 sm:w-auto sm:px-4">Edit</button>
              <button onClick={() => remove(skill.id)} className="h-10 w-full cursor-pointer rounded-md border border-red-600 text-red-600 hover:bg-red-50 sm:w-auto sm:px-4">Delete</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
function Field({ label, value, error, onChange }) {
  return (
    <label className="text-sm font-medium text-slate-700">
      {label}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 h-11 w-full rounded-md border border-slate-300 px-3 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
      />
      {error && (
        <span className="mt-1 block text-xs text-red-600">{error}</span>
      )}
    </label>
  );
}
