import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Career, listCareers, createCareer, updateCareer, deleteCareer } from '@/services/careers';

const emptyCareer: Career = {
  title: '',
  department: '',
  location: '',
  type: 'Full-time',
  level: 'Mid Level',
  description: '',
  isActive: true,
};

export default function Careers() {
  const [items, setItems] = useState<Career[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Career | null>(null);
  const [form, setForm] = useState<Career>(emptyCareer);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listCareers();
      setItems(data);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to load careers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editing && editing._id) {
        await updateCareer(editing._id, form);
      } else {
        await createCareer(form);
      }
      setForm(emptyCareer);
      setEditing(null);
      await load();
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || 'Save failed');
    }
  };

  const startEdit = (item: Career) => {
    setEditing(item);
    setForm({
      title: item.title,
      department: item.department,
      location: item.location,
      type: item.type,
      level: item.level,
      description: item.description,
      isActive: item.isActive,
    });
  };

  const remove = async (item: Career) => {
    if (!item._id) return;
    if (!confirm('Delete this career?')) return;
    try {
      await deleteCareer(item._id);
      await load();
    } catch (err: any) {
      alert(err?.response?.data?.message || err?.message || 'Delete failed');
    }
  };


  return (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 8px 0', color: '#111827' }}>
          Careers
        </h1>
        <p style={{ color: '#6b7280', margin: 0 }}>
          Manage job postings and career opportunities.
        </p>
      </div>

      <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, marginBottom: 24 }}>
        <h2 style={{ marginBottom: 12, fontWeight: 600 }}>{editing ? 'Edit Career' : 'Add Career'}</h2>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div>
            <label>Title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 6 }} />
          </div>
          <div>
            <label>Department</label>
            <input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} required style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 6 }} />
          </div>
          <div>
            <label>Location</label>
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} required style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 6 }} />
          </div>
          <div>
            <label>Type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 6 }}>
              {['Full-time','Part-time','Contract','Internship','Temporary'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label>Level</label>
            <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })} style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 6 }}>
              {['Entry Level','Mid Level','Senior Level','Lead','Manager','Director'].map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label>Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={4} style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 6 }} />
          </div>
          <div>
            <label>
              <input type="checkbox" checked={!!form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} /> Active
            </label>
          </div>
          <div style={{ alignSelf: 'end', justifySelf: 'end' }}>
            <button type="button" onClick={() => { setEditing(null); setForm(emptyCareer); }} style={{ marginRight: 8, padding: '8px 12px', borderRadius: 6, border: '1px solid #d1d5db' }}>Clear</button>
            <button type="submit" style={{ padding: '8px 12px', borderRadius: 6, background: '#111827', color: 'white' }}>{editing ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: 'crimson' }}>{error}</div>
      ) : (
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 8 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Title','Department','Location','Type','Level','Active','Actions'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: 12, borderBottom: '1px solid #e5e7eb' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item._id}>
                  <td style={{ padding: 12, borderBottom: '1px solid #f3f4f6' }}>{item.title}</td>
                  <td style={{ padding: 12, borderBottom: '1px solid #f3f4f6' }}>{item.department}</td>
                  <td style={{ padding: 12, borderBottom: '1px solid #f3f4f6' }}>{item.location}</td>
                  <td style={{ padding: 12, borderBottom: '1px solid #f3f4f6' }}>{item.type}</td>
                  <td style={{ padding: 12, borderBottom: '1px solid #f3f4f6' }}>{item.level}</td>
                  <td style={{ padding: 12, borderBottom: '1px solid #f3f4f6' }}>{item.isActive ? 'Yes' : 'No'}</td>
                  <td style={{ padding: 12, borderBottom: '1px solid #f3f4f6' }}>
                    <button onClick={() => startEdit(item)} style={{ marginRight: 8, padding: '6px 10px', borderRadius: 6, border: '1px solid #d1d5db' }}>Edit</button>
                    <button onClick={() => remove(item)} style={{ padding: '6px 10px', borderRadius: 6, border: '1px solid #d1d5db' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

