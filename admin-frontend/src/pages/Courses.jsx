import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import apiFetch from '../api';

const EMPTY_COURSE = { CourseName: '', Category: '', Instructor: '', Price: '', Status: 'Active', Image: '', Description: '' };

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [form, setForm] = useState(EMPTY_COURSE);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => { loadCourses(); }, []);

  const loadCourses = async () => {
    setLoading(true);
    const { data } = await apiFetch('/courses?status=all');
    if (data.success) setCourses(data.courses);
    setLoading(false);
  };

  const openAdd = () => { setEditingCourse(null); setForm(EMPTY_COURSE); setError(''); setShowModal(true); };
  const openEdit = (course) => { setEditingCourse(course); setForm({...course}); setError(''); setShowModal(true); };
  const closeModal = () => setShowModal(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setError('');
    const path = editingCourse ? `/courses/${editingCourse.CourseID}` : '/courses';
    const method = editingCourse ? 'PUT' : 'POST';
    const { ok, data } = await apiFetch(path, { method, body: JSON.stringify(form) });
    if (ok && data.success) { closeModal(); loadCourses(); }
    else setError(data.message || 'Failed to save. Check if Node API is running.');
    setSaving(false);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    const { data } = await apiFetch(`/courses/${id}`, { method: 'DELETE' });
    if (data.success) setCourses(c => c.filter(x => x.CourseID !== id));
    else alert(data.message || 'Delete failed.');
  };

  const filtered = courses.filter(c =>
    c.CourseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.Category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.Instructor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h1 className="fw-bold fs-3 text-dark mb-1 font-sans">Manage Courses</h1>
          <p className="text-muted font-sans mb-0">Add, edit, or delete courses from the database.</p>
        </div>
        <button className="btn btn-dark rounded-pill px-4 py-2 font-sans fw-medium shadow-sm d-flex align-items-center gap-2" onClick={openAdd}>
          <Plus size={18} />Add New Course
        </button>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
        {/* Toolbar */}
        <div className="p-4 border-bottom d-flex justify-content-between align-items-center gap-3 bg-light">
          <div className="position-relative">
            <span className="position-absolute top-50 translate-middle-y ms-3 text-muted"><Search size={18} /></span>
            <input type="text" className="form-control rounded-pill ps-5 py-2 bg-white border-0 shadow-sm font-sans"
              placeholder="Search courses..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ width: '280px' }} />
          </div>
          <span className="text-muted font-sans small">{filtered.length} courses</span>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 font-sans">
            <thead className="bg-light text-muted small text-uppercase">
              <tr>
                <th className="px-4 py-3 fw-semibold border-0">Course Name</th>
                <th className="px-4 py-3 fw-semibold border-0">Category</th>
                <th className="px-4 py-3 fw-semibold border-0">Instructor</th>
                <th className="px-4 py-3 fw-semibold border-0">Price</th>
                <th className="px-4 py-3 fw-semibold border-0">Status</th>
                <th className="px-4 py-3 fw-semibold border-0 text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1,2,3].map(i => (
                  <tr key={i}>
                    {[1,2,3,4,5,6].map(j => <td key={j} className="px-4 py-3"><div className="placeholder-glow"><span className="placeholder col-10 rounded-2"></span></div></td>)}
                  </tr>
                ))
              ) : filtered.length > 0 ? filtered.map(c => (
                <tr key={c.CourseID}>
                  <td className="px-4 py-3"><div className="fw-bold text-dark">{c.CourseName}</div></td>
                  <td className="px-4 py-3 text-muted">{c.Category}</td>
                  <td className="px-4 py-3 text-muted">{c.Instructor}</td>
                  <td className="px-4 py-3 fw-medium text-dark">₹{parseFloat(c.Price).toFixed(0)}</td>
                  <td className="px-4 py-3">
                    <span className={`badge rounded-pill px-3 py-2 fw-medium ${c.Status === 'Active' ? 'bg-success-subtle text-success' : 'bg-warning-subtle text-warning'}`}>
                      {c.Status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-end">
                    <div className="d-flex justify-content-end gap-2">
                      <button className="btn btn-sm btn-light rounded-circle p-2 text-primary" onClick={() => openEdit(c)} title="Edit"><Edit2 size={16}/></button>
                      <button className="btn btn-sm btn-light rounded-circle p-2 text-danger" onClick={() => handleDelete(c.CourseID, c.CourseName)} title="Delete"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="6" className="text-center py-5 text-muted font-sans">No courses found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3 border-top bg-light d-flex justify-content-between align-items-center">
          <span className="text-muted small font-sans">Total: {courses.length} courses</span>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden font-sans">
              <div className="modal-header border-0 px-4 pt-4 pb-0">
                <h5 className="fw-bold text-dark">{editingCourse ? 'Edit Course' : 'Add New Course'}</h5>
                <button className="btn btn-light rounded-circle p-2" onClick={closeModal}><X size={18}/></button>
              </div>
              <div className="modal-body p-4">
                {error && <div className="alert alert-danger py-2 small border-0 rounded-3 mb-3">{error}</div>}
                <form onSubmit={handleSave}>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label fw-medium text-dark">Course Name *</label>
                      <input type="text" className="form-control rounded-3 bg-light border-0" value={form.CourseName} onChange={e => setForm({...form, CourseName: e.target.value})} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium text-dark">Category *</label>
                      <input type="text" className="form-control rounded-3 bg-light border-0" value={form.Category} onChange={e => setForm({...form, Category: e.target.value})} placeholder="e.g. Development" required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium text-dark">Instructor *</label>
                      <input type="text" className="form-control rounded-3 bg-light border-0" value={form.Instructor} onChange={e => setForm({...form, Instructor: e.target.value})} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium text-dark">Price (₹)</label>
                      <input type="number" className="form-control rounded-3 bg-light border-0" value={form.Price} onChange={e => setForm({...form, Price: e.target.value})} min="0" step="1" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-medium text-dark">Status</label>
                      <select className="form-select rounded-3 bg-light border-0" value={form.Status} onChange={e => setForm({...form, Status: e.target.value})}>
                        <option value="Active">Active</option>
                        <option value="Draft">Draft</option>
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-medium text-dark">Image URL</label>
                      <input type="url" className="form-control rounded-3 bg-light border-0" value={form.Image} onChange={e => setForm({...form, Image: e.target.value})} placeholder="https://..." />
                    </div>
                    <div className="col-12">
                      <label className="form-label fw-medium text-dark">Description</label>
                      <textarea className="form-control rounded-3 bg-light border-0" rows="3" value={form.Description} onChange={e => setForm({...form, Description: e.target.value})} />
                    </div>
                  </div>
                  <div className="d-flex justify-content-end gap-2 mt-4">
                    <button type="button" className="btn btn-light rounded-pill px-4 py-2 fw-medium" onClick={closeModal}>Cancel</button>
                    <button type="submit" className="btn btn-dark rounded-pill px-4 py-2 fw-medium" disabled={saving}>
                      {saving ? <><span className="spinner-border spinner-border-sm me-2"/> Saving...</> : (editingCourse ? 'Save Changes' : 'Create Course')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Courses;
