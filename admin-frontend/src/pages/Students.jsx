import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import apiFetch from '../api';

const Students = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    apiFetch('/enrollments').then(({ data }) => {
      if (data.success) setEnrollments(data.enrollments);
    }).finally(() => setLoading(false));
  }, []);

  const filtered = enrollments.filter(e =>
    e.StudentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.CourseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.StudentEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="mb-4">
        <h1 className="fw-bold fs-3 text-dark mb-1 font-sans">Student Enrollments</h1>
        <p className="text-muted font-sans mb-0">View which students enrolled in which courses.</p>
      </div>

      <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
        {/* Toolbar */}
        <div className="p-4 border-bottom d-flex justify-content-between align-items-center gap-3 bg-light">
          <div className="position-relative">
            <span className="position-absolute top-50 translate-middle-y ms-3 text-muted"><Search size={18} /></span>
            <input type="text" className="form-control rounded-pill ps-5 py-2 bg-white border-0 shadow-sm font-sans"
              placeholder="Search students or courses..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ width: '300px' }} />
          </div>
          <span className="text-muted font-sans small">{filtered.length} enrollments</span>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0 font-sans">
            <thead className="bg-light text-muted small text-uppercase">
              <tr>
                <th className="px-4 py-3 fw-semibold border-0">#</th>
                <th className="px-4 py-3 fw-semibold border-0">Student</th>
                <th className="px-4 py-3 fw-semibold border-0">Email</th>
                <th className="px-4 py-3 fw-semibold border-0">Course</th>
                <th className="px-4 py-3 fw-semibold border-0">Category</th>
                <th className="px-4 py-3 fw-semibold border-0">Price Paid</th>
                <th className="px-4 py-3 fw-semibold border-0">Enrolled On</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1,2,3].map(i => (
                  <tr key={i}>
                    {[1,2,3,4,5,6,7].map(j => <td key={j} className="px-4 py-3"><div className="placeholder-glow"><span className="placeholder col-10 rounded-2"/></div></td>)}
                  </tr>
                ))
              ) : filtered.length > 0 ? filtered.map((e, idx) => (
                <tr key={e.EnrollmentID}>
                  <td className="px-4 py-3 text-muted">{idx + 1}</td>
                  <td className="px-4 py-3">
                    <div className="d-flex align-items-center gap-2">
                      <div className="d-flex align-items-center justify-content-center rounded-circle fw-bold text-white"
                        style={{ width: '36px', height: '36px', backgroundColor: '#111827', fontSize: '0.8rem', flexShrink: 0 }}>
                        {e.StudentName.charAt(0).toUpperCase()}
                      </div>
                      <span className="fw-bold text-dark">{e.StudentName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted">{e.StudentEmail}</td>
                  <td className="px-4 py-3">
                    <span className="fw-medium text-dark">{e.CourseName}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="badge bg-light text-dark border rounded-pill px-3 py-2 fw-medium" style={{ fontSize: '0.75rem' }}>
                      {e.Category}
                    </span>
                  </td>
                  <td className="px-4 py-3 fw-bold text-dark">₹{parseFloat(e.Price).toFixed(0)}</td>
                  <td className="px-4 py-3 text-muted" style={{ fontSize: '0.875rem' }}>
                    {new Date(e.EnrolledAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="text-center py-5 text-muted font-sans">
                    {loading ? '' : 'No enrollment records found.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 border-top bg-light">
          <span className="text-muted small font-sans">Showing {filtered.length} of {enrollments.length} total enrollments</span>
        </div>
      </div>
    </div>
  );
};

export default Students;
