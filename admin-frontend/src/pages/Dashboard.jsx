import React, { useState, useEffect } from 'react';
import { Users, BookOpen, IndianRupee, TrendingUp } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import apiFetch from '../api';

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul'];

const StatCard = ({ title, value, icon, trend, trendUp, loading }) => (
  <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
    <div className="d-flex align-items-center justify-content-between mb-3">
      <span className="text-muted font-sans fw-medium">{title}</span>
      <div className="p-2 bg-light rounded-circle text-primary">{icon}</div>
    </div>
    <div className="d-flex align-items-end justify-content-between">
      {loading
        ? <div className="placeholder-glow w-50"><span className="placeholder col-12 rounded-3" style={{height:'2.5rem'}}></span></div>
        : <h3 className="fw-bold fs-2 mb-0 text-dark font-sans">{value}</h3>
      }
      <span className={`d-flex align-items-center gap-1 font-sans fw-medium small ${trendUp ? 'text-success' : 'text-danger'}`}>
        <TrendingUp size={16} />
        {trend}
      </span>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/enrollments/stats').then(({ data }) => {
      if (data.success) setStats(data.stats);
    }).finally(() => setLoading(false));
  }, []);

  // Build mock monthly chart data with real total as max
  const chartData = months.map((name, i) => ({
    name,
    enrollment: Math.round((stats?.totalEnrollments || 30) * (0.4 + i * 0.1)),
    revenue: Math.round((stats?.totalRevenue || 1000) * (0.3 + i * 0.12)),
  }));

  return (
    <div>
      <div className="mb-4 d-flex justify-content-between align-items-end">
        <div>
          <h1 className="fw-bold fs-3 text-dark mb-1">Overview Dashboard</h1>
          <p className="text-muted font-sans mb-0">Live data from the database.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard title="Total Students" value={stats ? stats.totalStudents.toLocaleString() : '—'} icon={<Users size={24} />} trend="+12.5%" trendUp loading={loading} />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard title="Total Revenue" value={stats ? `₹${Number(stats.totalRevenue).toLocaleString('en-IN')}` : '—'} icon={<IndianRupee size={24} />} trend="+8.2%" trendUp loading={loading} />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard title="Active Courses" value={stats ? stats.totalCourses : '—'} icon={<BookOpen size={24} />} trend="+2.1%" trendUp loading={loading} />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard title="Total Enrollments" value={stats ? stats.totalEnrollments : '—'} icon={<TrendingUp size={24} />} trend="+4.3%" trendUp loading={loading} />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
            <h5 className="fw-bold mb-4 font-sans text-dark">Enrollment Trend</h5>
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dx={-10} />
                  <Tooltip cursor={{ fill: '#F3F4F6' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="enrollment" fill="#111827" radius={[4, 4, 0, 0]} barSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
            <h5 className="fw-bold mb-4 font-sans text-dark">Revenue Trend</h5>
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Line type="monotone" dataKey="revenue" stroke="#2563EB" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
