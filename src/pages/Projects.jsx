import { useEffect, useState } from "react";
import api from "../api/axios";

const empty = {
  title: "",
  description: "",
  image: "",
  githubUrlBackend: "",
  githubUrlFrontend: "",
  liveUrl: "",
  technologies: "",
};

const fields = [
  ["title", "Title"],
  ["image", "Image URL"],
  ["githubUrlBackend", "Backend GitHub URL"],
  ["githubUrlFrontend", "Frontend GitHub URL"],
  ["liveUrl", "Live URL"],
];

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const load = () =>
    api
      .get("/projects/get")
      .then(({ data }) => setProjects(data))
      .catch(() => setMessage("Unable to load projects."));
  useEffect(() => {
    load();
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    setErrors({});
    setMessage("");
    const payload = {
      ...form,
      technologies: form.technologies
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };
    try {
      if (editingId)
        await api.put(`/admin/projects/update/${editingId}`, payload);
      else await api.post("/admin/projects/create", payload);
      setForm(empty);
      setEditingId(null);
      setMessage("Project saved successfully.");
      load();
    } catch (err) {
      setErrors(err.response?.data?.fieldErrors || {});
      setMessage(
        err.response?.data?.fieldErrors
          ? ""
          : err.response?.data?.message || "Unable to save project.",
      );
    }
  };

  const edit = (project) => {
    setEditingId(project.id);
    setForm({
      ...project,
      technologies: (project.technologies || []).join(", "),
    });
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await api.delete(`/admin/projects/delete/${id}`);
      load();
    } catch (err) {
      setMessage(err.response?.data?.message || "Unable to delete project.");
    }
  };

  return (
    <section className="mx-auto max-w-5xl">
      
      <h2 className="mb-6 text-2xl font-semibold text-slate-900">Projects</h2>
      
      <form
        onSubmit={submit}
        className="mb-8 border border-slate-200 bg-white p-4 sm:p-6"
      >
        <h3 className="mb-4 text-lg font-semibold">
          {editingId ? "Edit project" : "Add project"}
        </h3>
      
        <div className="grid gap-4 sm:grid-cols-2">
          {fields.map(([name, label]) => (
            <Field
              key={name}
              label={label}
              value={form[name]}
              error={errors[name]}
              onChange={(value) => setForm({ ...form, [name]: value })}
            />
          ))}
      
          <label className="text-sm font-medium text-slate-700 sm:col-span-2">
            Description
            <textarea
              rows="4"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            {errors.description && (
              <span className="text-xs text-red-600">{errors.description}</span>
            )}
          </label>
      
          <Field
            label="Technologies (comma-separated)"
            value={form.technologies}
            error={errors.technologies}
            onChange={(value) => setForm({ ...form, technologies: value })}
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
      
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <article
            key={project.id}
            className="border border-slate-200 bg-white p-4 sm:p-5"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <h3 className="font-semibold text-slate-900">
                {project.title}
              </h3>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <button
                  onClick={() => edit(project)}
                  className="h-10 cursor-pointer rounded-md border border-blue-600 px-3 text-blue-600 hover:bg-blue-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => remove(project.id)}
                  className="h-10 cursor-pointer rounded-md border border-red-600 px-3 text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>
            </div>
            <p className="mt-2 text-sm text-slate-600">{project.description}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(project.technologies || []).map((technology) => (
                <span
                  key={technology}
                  className="rounded-full bg-blue-50 px-2.5 py-1 text-xs text-blue-700"
                >
                  {technology}
                </span>
              ))}
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
