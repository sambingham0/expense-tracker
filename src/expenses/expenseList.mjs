import { renderHeader } from '../app/header.mjs';
import { renderFooter } from '../app/footer.mjs';
import { getExpenses } from '../utils/storage.mjs';
import { renderExpenseForm, setupExpenseForm } from './expenseForm.mjs';

function renderExpenseList() {
  const expenses = getExpenses().sort((a, b) => b.date.localeCompare(a.date));
  if (!expenses.length) return '<p>No expenses yet.</p>';
  return `
    <ul class="expense-list">
      ${expenses.map(e => `
        <li class="card" data-id="${e.id}">
          <span class="amount">$${e.amount.toFixed(2)}</span>
          <span class="expense-sep">|</span>
          <span>${e.category}</span>
          <span class="expense-sep">|</span>
          <span>${e.date}</span>
          <span class="expense-sep">|</span>
          <span>${e.note ? e.note : ''}</span>
          <span class="expense-actions">
            <button class="edit-expense-btn" data-id="${e.id}">Edit</button>
            <button class="delete-expense-btn" data-id="${e.id}">Delete</button>
          </span>
        </li>
      `).join('')}
    </ul>
  `;
}

export default function renderExpenses() {
  document.getElementById('app').innerHTML = `
    ${renderHeader()}
    <main class="expenses-main">
      <section class="card">
        <h2>Expenses</h2>
        <button id="add-expense-btn">Add Expense</button>
        <div id="expense-form-container" class="expense-form-hidden"></div>
        <div id="expense-list">${renderExpenseList()}</div>
      </section>
    </main>
    ${renderFooter()}
  `;
  const addBtn = document.getElementById('add-expense-btn');
  const formContainer = document.getElementById('expense-form-container');
  addBtn.addEventListener('click', () => {
    formContainer.innerHTML = renderExpenseForm(() => {});
    formContainer.style.display = 'block';
    setupExpenseForm(() => {
      formContainer.style.display = 'none';
      renderExpenses();
    });
  });

  // Delete handler
  document.querySelectorAll('.delete-expense-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = Number(e.target.dataset.id);
      if (confirm('Delete this expense?')) {
        import('../utils/storage.mjs').then(({ deleteExpense }) => {
          deleteExpense(id);
          renderExpenses();
        });
      }
    });
  });

  // Edit handler
  document.querySelectorAll('.edit-expense-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const id = Number(e.target.dataset.id);
      import('../utils/storage.mjs').then(({ getExpenses, updateExpense }) => {
        const expense = getExpenses().find(exp => exp.id === id);
        if (!expense) return;
        formContainer.innerHTML = renderExpenseForm((updated) => {
          updateExpense(id, updated);
          formContainer.style.display = 'none';
          renderExpenses();
        });
        // Pre-fill form
        formContainer.style.display = 'block';
        setTimeout(() => {
          document.getElementById('amount').value = expense.amount;
          document.getElementById('category').value = expense.category;
          document.getElementById('date').value = expense.date;
          document.getElementById('note').value = expense.note || '';
        }, 0);
      });
    });
  });
}

// If loaded directly, render
if (!window.__ROUTER_LOADED__) {
  renderExpenses();
}
