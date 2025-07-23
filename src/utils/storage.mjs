// Delete an expense by id
export function deleteExpense(id) {
  const expenses = getExpenses().filter(e => e.id !== id);
  saveExpenses(expenses);
}

// Update an expense by id
export function updateExpense(id, updated) {
  const expenses = getExpenses().map(e =>
    e.id === id ? { ...e, ...updated, id } : e
  );
  saveExpenses(expenses);
}
// LocalStorage helpers for expenses and budgets
const EXPENSES_KEY = 'expenses';
const BUDGETS_KEY = 'budgets';

export function getExpenses() {
  return JSON.parse(localStorage.getItem(EXPENSES_KEY) || '[]');
}

export function saveExpenses(expenses) {
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
}

export function addExpense(expense) {
  const expenses = getExpenses();
  expenses.push(expense);
  saveExpenses(expenses);
}

export function getBudgets() {
  return JSON.parse(localStorage.getItem(BUDGETS_KEY) || '{}');
}

export function saveBudgets(budgets) {
  localStorage.setItem(BUDGETS_KEY, JSON.stringify(budgets));
}
