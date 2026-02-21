import { useEffect, useMemo, useState } from "react";
import { createResource, deleteResource, listResources, updateResource } from "../api";

function formatValue(value) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  if (typeof value === "object") {
    if (value.name) return value.name;
    if (value.referenceId) return value.referenceId;
    if (value.vehicleNumber) return value.vehicleNumber;
    if (value.tripCode) return value.tripCode;
    if (value._id) return value._id;
    return JSON.stringify(value);
  }

  return String(value);
}

export default function ResourceSection({ title, endpoint, fields, columns }) {
  const initialForm = useMemo(
    () => Object.fromEntries(fields.map((field) => [field.name, field.defaultValue ?? ""])),
    [fields]
  );

  const [items, setItems] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const response = await listResources(endpoint);
      setItems(response.items || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setForm(initialForm);
    setEditingId(null);
  }, [initialForm]);

  useEffect(() => {
    loadData();
  }, [endpoint]);

  async function onSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const payload = {};

      for (const field of fields) {
        const rawValue = form[field.name];
        if (field.type === "number") {
          payload[field.name] = rawValue === "" ? null : Number(rawValue);
        } else if (field.type === "datetime-local") {
          payload[field.name] = rawValue ? new Date(rawValue).toISOString() : null;
        } else {
          payload[field.name] = rawValue;
        }
      }

      if (editingId) {
        await updateResource(endpoint, editingId, payload);
      } else {
        await createResource(endpoint, payload);
      }

      setForm(initialForm);
      setEditingId(null);
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function onEdit(item) {
    const nextForm = {};

    for (const field of fields) {
      const rawValue = item[field.name];

      if (field.type === "datetime-local") {
        if (!rawValue) {
          nextForm[field.name] = "";
        } else {
          const date = new Date(rawValue);
          const timezoneOffset = date.getTimezoneOffset() * 60000;
          nextForm[field.name] = new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16);
        }
      } else if (typeof rawValue === "object" && rawValue !== null) {
        nextForm[field.name] = rawValue._id || "";
      } else {
        nextForm[field.name] = rawValue ?? "";
      }
    }

    setForm(nextForm);
    setEditingId(item._id);
    setError("");
  }

  function onCancelEdit() {
    setEditingId(null);
    setForm(initialForm);
    setError("");
  }

  async function onDelete(id) {
    setError("");
    try {
      await deleteResource(endpoint, id);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="card">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
          <p className="text-slate-400">Manage and organize resources</p>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? "🔄 Refreshing..." : "⟳ Refresh"}
        </button>
      </div>

      <form className="mb-6 p-4 bg-slate-700/40 border border-slate-600 rounded-xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" onSubmit={onSubmit}>
        {fields.map((field) => (
          <div key={field.name}>
            <label className="label">{field.label}</label>
            {field.options ? (
              <select
                value={form[field.name]}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    [field.name]: event.target.value,
                  }))
                }
                required={field.required}
                className="input"
              >
                <option value="">Select {field.label}</option>
                {field.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type || "text"}
                value={form[field.name]}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    [field.name]: event.target.value,
                  }))
                }
                required={field.required}
                className="input"
                placeholder={field.label}
              />
            )}
          </div>
        ))}

        <div className="md:col-span-2 lg:col-span-3 flex gap-3">
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? "💾 Saving..." : editingId ? `✎ Update ${title}` : `➕ Add ${title}`}
          </button>
          {editingId && (
            <button 
              type="button" 
              onClick={onCancelEdit} 
              className="px-4 py-2 bg-slate-600 text-slate-100 rounded-lg font-medium hover:bg-slate-500 transition"
            >
              ✕ Cancel Edit
            </button>
          )}
        </div>
      </form>

      {error && (
        <div className="mb-6 p-4 bg-red-500 bg-opacity-20 border border-red-500 border-opacity-50 text-red-300 rounded-xl text-sm font-medium">
          ⚠️ {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-600 bg-slate-800 bg-opacity-50">
              {columns.map((column) => (
                <th 
                  key={column.key} 
                  className="px-4 py-3 text-left text-sm font-bold text-slate-200 uppercase tracking-wide"
                >
                  {column.label}
                </th>
              ))}
              <th className="px-4 py-3 text-left text-sm font-bold text-slate-200 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.length + 1} 
                  className="px-4 py-12 text-center text-slate-400 font-medium"
                >
                  📭 No records found.
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <tr 
                  key={item._id} 
                  className="border-b border-slate-700 hover:bg-slate-700 hover:bg-opacity-30 transition duration-200"
                >
                  {columns.map((column) => (
                    <td 
                      key={column.key} 
                      className="px-4 py-3 text-sm text-slate-300"
                    >
                      {formatValue(item[column.key])}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-sm flex gap-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="px-3 py-1 bg-blue-600 bg-opacity-20 text-blue-300 border border-blue-500 border-opacity-30 rounded hover:bg-opacity-40 hover:border-opacity-50 transition text-xs font-medium"
                    >
                      ✎ Edit
                    </button>
                    <button
                      className="px-3 py-1 bg-red-600 bg-opacity-20 text-red-300 border border-red-500 border-opacity-30 rounded hover:bg-opacity-40 hover:border-opacity-50 transition text-xs font-medium"
                      onClick={() => onDelete(item._id)}
                    >
                      🗑 Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
