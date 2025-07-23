import { renderHeader } from '../app/header.mjs';
import { renderFooter } from '../app/footer.mjs';
import { getExpenses } from '../utils/storage.mjs';
import categories from '../utils/categories.json' assert { type: 'json' };

function groupBy(arr, keyFn) {
  return arr.reduce((acc, item) => {
    const key = keyFn(item);
    acc[key] = acc[key] || [];
    acc[key].push(item);
    return acc;
  }, {});
}

function renderCategoryReport(expenses, budgets) {
  const byCat = groupBy(expenses, e => e.category);
  return `
    <h3>By Category</h3>
    <table class="report-table auto-width">
      <thead><tr><th class="cat-col">Category</th><th class="spent-budget-col">Spent / Budget</th></tr></thead>
      <tbody>
        ${categories.map(cat => {
          const spent = byCat[cat] ? byCat[cat].reduce((s, e) => s + Number(e.amount), 0) : 0;
          const budget = budgets[cat] ? Number(budgets[cat]) : 0;
          return `<tr><td class="cat-col">${cat}</td><td class="amount spent-budget-col">$${spent.toFixed(2)} / $${budget.toFixed(2)}</td></tr>`;
        }).join('')}
      </tbody>
    </table>
  `;
}

function renderMonthlyReport(expenses) {
  const byMonth = groupBy(expenses, e => e.date.slice(0, 7));
  const months = Object.keys(byMonth).sort().reverse();
  return `
    <h3>By Month</h3>
    <table class="report-table auto-width">
      <thead><tr><th class="month-col">Month</th><th class="total-col">Total</th></tr></thead>
      <tbody>
        ${months.map(month => `
          <tr><td class="month-col">${month}</td><td class="amount total-col">$${byMonth[month].reduce((s, e) => s + Number(e.amount), 0).toFixed(2)}</td></tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

export default function renderReports() {
  const expenses = getExpenses();
  const budgets = JSON.parse(localStorage.getItem('budgets') || '{}');
  const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const totalBudget = Object.values(budgets).reduce((sum, b) => sum + Number(b), 0);
  document.getElementById('app').innerHTML = `
    ${renderHeader()}
    <main class="reports-main">
      <section class="card">
        <h2>Reports</h2>
        <div class="budget-summary budget-summary-large">
          <strong>Total:</strong> $${totalSpent.toFixed(2)} / $${totalBudget.toFixed(2)}
        </div>
        <div id="reports-content">
          ${renderCategoryReport(expenses, budgets)}
          ${renderMonthlyReport(expenses)}
        </div>
      </section>
    </main>
    ${renderFooter()}
  `;
}

// If loaded directly, render
if (!window.__ROUTER_LOADED__) {
  renderReports();
}
