import { useEffect, useState } from "react";

export default function AdminContactLog() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const r = await fetch(
        `/api/admin/subscribers${q ? `?q=${encodeURIComponent(q)}` : ""}`,
        {
          credentials: "include",
        }
      );
      const data = await r.json();
      if (!r.ok) return alert(data.error || "fetch_failed");
      setRows(data.subscribers || []);
    } catch {
      alert("network_error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function removeOne(id) {
    if (!confirm("Delete this email?")) return;
    const r = await fetch(`/api/admin/subscribers/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!r.ok) {
      const e = await r.json().catch(() => ({}));
      return alert(e.error || "delete_failed");
    }
    setRows((xs) => xs.filter((i) => i._id !== id));
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-4 p-4">
      <h1 className="text-2xl font-semibold">Subscribers</h1>

      <div className="flex gap-2">
        <input
          className="flex-1 rounded border p-2"
          placeholder="Filter by email"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button
          onClick={load}
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      <div className="overflow-hidden rounded border">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2">Email</th>
              <th className="px-3 py-2">Created</th>
              <th className="px-3 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="px-3 py-3 text-gray-500" colSpan={3}>
                  No results
                </td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r._id} className="border-t">
                  <td className="px-3 py-2">{r.email}</td>
                  <td className="px-3 py-2">
                    {new Date(r.createdAt).toLocaleString()}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      onClick={() => removeOne(r._id)}
                      className="rounded bg-red-600 px-3 py-1.5 text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
