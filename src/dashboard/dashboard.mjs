// Dashboard logic placeholder
import { renderHeader } from '../app/header.mjs';
import { renderFooter } from '../app/footer.mjs';
import { getExpenses, getBudgets } from '../utils/storage.mjs';
import categories from '../utils/categories.json' assert { type: 'json' };
import { renderTrendsChart } from './charts.mjs';

function renderSummary() {
  const expenses = getExpenses();
  const budgets = getBudgets();
  const total = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  // Calculate spending per category for current month
  const now = new Date();
  const monthStr = now.toISOString().slice(0, 7);
  const catTotals = {};
  for (const cat of categories) catTotals[cat] = 0;
  expenses.forEach(e => {
    if (e.date && e.date.startsWith(monthStr) && catTotals.hasOwnProperty(e.category)) {
      catTotals[e.category] += Number(e.amount);
    }
  });
  // Find warnings
  const warnings = categories.filter(cat => budgets[cat] && catTotals[cat] > Number(budgets[cat]));
  // Category breakdown HTML
  const catRows = categories.map(cat => `
    <tr><td>${cat}</td><td>$${catTotals[cat].toFixed(2)}</td><td>${budgets[cat] ? `$${budgets[cat]}` : '-'}</td></tr>
  `).join('');
  return `
    <div class="summary-total">
      <strong>Total Spent:</strong> <span class="amount">$${total.toFixed(2)}</span>
    </div>
    <div class="summary-count">
      <strong>Entries:</strong> ${expenses.length}
    </div>
    ${warnings.length ? `<div class="budget-warning over-budget">⚠ Over budget: ${warnings.join(', ')}</div>` : ''}
    <div class="summary-categories">
      <h3>Spending by Category (This Month)</h3>
      <table class="cat-breakdown"><thead><tr><th>Category</th><th>Spent</th><th>Budget</th></tr></thead><tbody>${catRows}</tbody></table>
    </div>
  `;
}

function renderRecentExpenses(limit = 5) {
  const expenses = getExpenses()
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);
  if (!expenses.length) return '<p>No recent expenses.</p>';
  return `
    <table class="recent-expenses">
      <thead><tr><th>Date</th><th>Category</th><th>Description</th><th>Amount</th></tr></thead>
      <tbody>
        ${expenses.map(e => `
          <tr>
            <td>${e.date || ''}</td>
            <td>${e.category || ''}</td>
            <td>${e.note || ''}</td>
            <td>$${parseFloat(e.amount).toFixed(2)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}


function renderTrendsChartSection() {
  // Canvas for Chart.js
  return `<canvas id="trends-chart" width="400" height="200"></canvas>`;
}

export default function renderDashboard() {
  document.getElementById('app').innerHTML = `
    ${renderHeader()}
    <main class="dashboard-main">
      <section class="card">
        <h2>Summary</h2>
        <div id="summary-totals">${renderSummary()}</div>
      </section>
      <section class="card">
        <h2>Recent Expenses</h2>
        <div id="recent-expenses">${renderRecentExpenses(5)}</div>
      </section>
      <section class="card">
        <h2>Trends</h2>
        ${renderTrendsChartSection()}
      </section>
    </main>
    ${renderFooter()}
  `;
  // Render the chart after DOM is updated
  setTimeout(() => {
    renderTrendsChart();
  }, 0);
}

// If loaded directly, render
if (!window.__ROUTER_LOADED__) {
  renderDashboard();
}
