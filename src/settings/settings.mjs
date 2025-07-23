import { renderHeader } from '../app/header.mjs';
import { renderFooter } from '../app/footer.mjs';
import categories from '../utils/categories.json' assert { type: 'json' };
import { getBudgets, saveBudgets } from '../utils/storage.mjs';

function renderBudgetForm(budgets) {
  return `
    <form id="budget-form" class="card">
      <h3>Set Monthly Budgets</h3>
      ${categories.map(cat => `
        <label for="budget-${cat}">${cat}</label>
        <input type="number" id="budget-${cat}" name="${cat}" min="0" step="0.01" value="${budgets[cat] || ''}" />
      `).join('')}
      <button type="submit">Save Budgets</button>
    </form>
  `;
}

function renderCurrentBudgets(budgets) {
  return `
    <ul class="budget-list">
      ${categories.map(cat => `
        <li>${cat}: <span class="amount">$${budgets[cat] ? Number(budgets[cat]).toFixed(2) : '0.00'}</span></li>
      `).join('')}
    </ul>
  `;
}

export default function renderSettings() {
  const budgets = getBudgets();
  document.getElementById('app').innerHTML = `
    ${renderHeader()}
    <main class="settings-main">
      <section class="card">
        <h2>Budgets</h2>
        <div id="current-budgets">${renderCurrentBudgets(budgets)}</div>
        <div id="budget-form-container">${renderBudgetForm(budgets)}</div>
      </section>
    </main>
    ${renderFooter()}
  `;
  const form = document.getElementById('budget-form');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    saveBudgets(data);
    renderSettings();
  });
}

// If loaded directly, render
if (!window.__ROUTER_LOADED__) {
  renderSettings();
}
