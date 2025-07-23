import categories from '../utils/categories.json' assert { type: 'json' };
import { addExpense } from '../utils/storage.mjs';

export function renderExpenseForm(onSave, expense = null) {
  return `
    <form id="expense-form" class="card">
      <h3>${expense ? 'Edit' : 'Add'} Expense</h3>
      <label for="amount">Amount</label>
      <input type="number" id="amount" name="amount" min="0.01" step="0.01" required value="${expense ? expense.amount : ''}" />
      <label for="category">Category</label>
      <select id="category" name="category" required>
        <option value="">Select...</option>
        ${categories.map(cat => `<option value="${cat}"${expense && expense.category === cat ? ' selected' : ''}>${cat}</option>`).join('')}
      </select>
      <label for="date">Date</label>
      <input type="date" id="date" name="date" required value="${expense ? expense.date : ''}" />
      <label for="note">Note</label>
      <input type="text" id="note" name="note" maxlength="50" value="${expense ? expense.note : ''}" />
      <button type="submit">Save</button>
    </form>
  `;
}

export function setupExpenseForm(onSave, expense = null) {
  const form = document.getElementById('expense-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    if (!data.amount || !data.category || !data.date) return;
    const newExpense = {
      amount: parseFloat(data.amount),
      category: data.category,
      date: data.date,
      note: data.note || '',
      id: expense ? expense.id : Date.now()
    };
    if (expense) {
      // Edit mode: do not add, just call onSave
      if (onSave) onSave(newExpense);
    } else {
      // Add mode
      addExpense(newExpense);
      if (onSave) onSave(newExpense);
      form.reset();
    }
  });
}
