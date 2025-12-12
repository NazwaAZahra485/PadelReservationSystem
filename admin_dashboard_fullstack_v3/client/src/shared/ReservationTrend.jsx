import React from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler)

export default function ReservationTrend({ dataPoints = [] }) {
  const labels = ['-6', '-5', '-4', '-3', '-2', '-1', 'Hari ini']

  return (
    <Line
      data={{
        labels,
        datasets: [{
          label: "Reservasi",
          data: dataPoints,
          borderColor: "#163ef1ff",
          fill: true,
          tension: 0.4,
          backgroundColor: (ctx) => {
            const g = ctx.chart.ctx.createLinearGradient(0, 0, 0, 300)
            g.addColorStop(0, '#fffd9bff')
            g.addColorStop(1, 'rgba(172, 172, 96, 0)')
            return g
          }
        }]
      }}
      options={{
        responsive: true,
        scales: {
          y: { grid: { color: "#e5e7eb" } },
          x: { grid: { display: false } }
        }
      }}
    />
  )
}
