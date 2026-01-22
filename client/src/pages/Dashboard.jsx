import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { apiFetch } from '../api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalReservations: 0,
    totalCourts: 0,
    totalUsers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Kita gunakan endpoint /data/all yang sudah ada untuk ringkasan
      const res = await apiFetch('/data/all');
      const json = await res.json();

      if (json.success) {
        setStats({
          totalReservations: json.summary.totalReservations,
          totalCourts: json.summary.totalCourts,
          totalUsers: json.summary.totalUsers
        });
      }
    } catch (err) {
      console.error('Gagal ambil data dashboard', err);
    } finally {
      setLoading(false);
    }
  };

  // Data Chart (Sementara dummy karena butuh agregasi data per hari dari backend)
  // Untuk proyek "proper", idealnya backend menyediakan endpoint /api/dashboard/chart
  const data = {
    labels: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
    datasets: [
      {
        label: 'Tren Reservasi',
        data: [2, 4, 3, 5, 4, 6, 3], // Simulasi data
        borderColor: '#2563eb',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, 'rgba(250, 204, 21, 0.5)');
          gradient.addColorStop(1, 'rgba(250, 204, 21, 0.0)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#fbbf24',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Tren Reservasi (7 hari)',
        align: 'start',
        font: { size: 16, weight: 'bold' },
        color: '#334155'
      },
    },
    scales: {
      y: {
        grid: { color: '#f1f5f9' },
        ticks: { color: '#94a3b8' }
      },
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8' }
      }
    }
  };

  return (
    <div className="main-content">
      <h1 className="page-title">Dashboard Admin</h1>

      {/* Grid 3 Kolom */}
      <div className="stats-grid">
        {/* Card 1 */}
        <div className="card">
          <h3>Total Reservasi</h3>
          <div className="value">{loading ? '...' : stats.totalReservations}</div>
        </div>

        {/* Card 2 */}
        <div className="card blue-accent">
          <h3>Total Lapangan</h3>
          <div className="value">{loading ? '...' : stats.totalCourts}</div>
        </div>

        {/* Card 3 */}
        <div className="card">
          <h3>Total User</h3>
          <div className="value">{loading ? '...' : stats.totalUsers}</div>
        </div>
      </div>

      {/* Chart */}
      <div className="chart-container">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default Dashboard;