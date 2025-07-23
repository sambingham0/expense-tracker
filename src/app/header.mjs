// Header component
export function renderHeader() {
  return `
    <header class="app-header">
      <nav>
        <a href="#dashboard" class="nav-link">Dashboard</a>
        <a href="#expenses" class="nav-link">Expenses</a>
        <a href="#reports" class="nav-link">Reports</a>
        <a href="#settings" class="nav-link">Settings</a>
      </nav>
      <h1>Personal Expense Tracker</h1>
    </header>
  `;
}
