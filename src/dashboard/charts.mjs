// Chart.js chart rendering for dashboard trends
import { getExpenses } from '../utils/storage.mjs';
import categories from '../utils/categories.json' assert { type: 'json' };

export function renderTrendsChart() {
  const ctx = document.getElementById('trends-chart');
  if (!ctx) return;
  // Remove old chart if exists
  if (window.dashboardChart && window.dashboardChart.destroy) {
    window.dashboardChart.destroy();
  }
  // Prepare monthly totals for the last 6 months, per category
  const expenses = getExpenses();
  const now = new Date();
  const months = [];
  const monthLabels = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleString('default', { month: 'short', year: '2-digit' });
    const key = d.toISOString().slice(0, 7);
    months.push(key);
    monthLabels.push(label);
  }

  // Generate a color for each category
  function getColor(idx) {
    const palette = [
      'rgba(75,192,192,1)',
      'rgba(255,99,132,1)',
      'rgba(255,205,86,1)',
      'rgba(54,162,235,1)',
      'rgba(153,102,255,1)',
      'rgba(255,159,64,1)',
      'rgba(201,203,207,1)'
    ];
    return palette[idx % palette.length];
  }

  // For each category, build a dataset
  const datasets = categories.map((cat, idx) => {
    const data = months.map(m =>
      expenses.filter(e => e.date && e.date.startsWith(m) && e.category === cat)
        .reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0)
    );
    return {
      label: cat,
      data,
      borderColor: getColor(idx),
      backgroundColor: getColor(idx).replace('1)', '0.2)'),
      fill: false,
      tension: 0.3,
      pointRadius: 4,
    };
  });
  // Dynamically load Chart.js if not present
  if (!window.Chart) {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.onload = () => renderTrendsChart();
    document.head.appendChild(script);
    return;
  }
  window.dashboardChart = new window.Chart(ctx, {
    type: 'line',
    data: {
      labels: monthLabels,
      datasets: datasets
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true },
        title: { display: true, text: 'Monthly Expense Trends' }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}
