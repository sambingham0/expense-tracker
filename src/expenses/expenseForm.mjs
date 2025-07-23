import categories from '../utils/categories.json' assert { type: 'json' };
import { addExpense } from '../utils/storage.mjs';

export function renderExpenseForm(onSave) {
  return `
    <form id="expense-form" class="card">
      <h3>Add Expense</h3>
      <label for="amount">Amount</label>
      <input type="number" id="amount" name="amount" min="0.01" step="0.01" required />
      <label for="category">Category</label>
      <select id="category" name="category" required>
        <option value="">Select...</option>
        ${categories.map(cat => `<option value="${cat}">${cat}</option>`).join('')}
      </select>
      <label for="date">Date</label>
      <input type="date" id="date" name="date" required />
      <label for="note">Note</label>
      <input type="text" id="note" name="note" maxlength="50" />
      <button type="submit">Save</button>
    </form>
  `;
}

export function setupExpenseForm(onSave) {
  const form = document.getElementById('expense-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    if (!data.amount || !data.category || !data.date) return;
    const expense = {
      amount: parseFloat(data.amount),
      category: data.category,
      date: data.date,
      note: data.note || '',
      id: Date.now()
    };
    addExpense(expense);
    if (onSave) onSave(expense);
    form.reset();
  });
}
