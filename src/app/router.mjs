
// Simple hash-based router for SPA navigation
const routes = {
  dashboard: () => import('../dashboard/dashboard.mjs'),
  expenses: () => import('../expenses/expenseList.mjs'),
  reports: () => import('../reports/reports.mjs'),
  settings: () => import('../settings/settings.mjs'),
};

export function routeTo(page) {
  window.location.hash = `#${page}`;
}

export function startRouter() {
  async function handleRoute() {
    const hash = window.location.hash.replace('#', '') || 'dashboard';
    if (routes[hash]) {
      const mod = await routes[hash]();
      if (mod && typeof mod.default === 'function') mod.default();
    } else {
      const mod = await routes['dashboard']();
      if (mod && typeof mod.default === 'function') mod.default();
    }
  }
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}
