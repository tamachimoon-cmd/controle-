:root {
  --bg: #050505;
  --panel: rgba(16, 16, 16, 0.92);
  --panel-soft: rgba(13, 13, 13, 0.84);
  --card: rgba(17, 17, 17, 0.92);
  --border: #3d321c;
  --border-strong: #6f5723;
  --gold: #f2c94c;
  --gold-light: #f5d77b;
  --gold-medium: #d6a93a;
  --gold-dark: #7a5a18;
  --gold-muted: #c9b06a;
  --text: #ffffff;
  --text-soft: #e7ddbd;
  --text-muted: #c7bd9f;
  --text-dim: #b8aa86;
  --shadow: 0 18px 50px rgba(0, 0, 0, 0.35);
  --radius: 18px;
}

* { box-sizing: border-box; }
html { color-scheme: dark; }
body {
  margin: 0;
  min-height: 100vh;
  background: var(--bg);
  color: var(--text);
  font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  overflow-x: hidden;
}
button, select { font: inherit; }
.background-glow { position: fixed; border-radius: 999px; filter: blur(80px); pointer-events: none; z-index: 0; }
.glow-left { width: 380px; height: 380px; left: -90px; top: 0; background: rgba(143, 107, 31, 0.18); }
.glow-right { width: 320px; height: 320px; right: -20px; top: 160px; background: rgba(242, 201, 76, 0.09); }
.container { position: relative; z-index: 1; width: min(1280px, calc(100% - 32px)); margin: 0 auto; padding: 32px 0 48px; }
.hero { display: flex; justify-content: space-between; align-items: flex-end; gap: 28px; margin-bottom: 28px; }
.eyebrow { margin: 0; color: #c9a646; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.35em; }
.hero h1 { margin: 12px 0 0; color: var(--gold-light); font-size: clamp(2.4rem, 5vw, 4rem); line-height: 1; letter-spacing: -0.04em; font-weight: 900; }
.subtitle { max-width: 700px; margin: 16px 0 0; color: var(--text-muted); line-height: 1.65; }
.header-actions { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; }
select { min-height: 42px; border: 1px solid var(--border-strong); border-radius: 12px; background: #111; color: var(--gold-light); padding: 0 42px 0 14px; outline: none; cursor: pointer; }
select:focus, button:focus-visible { box-shadow: 0 0 0 3px rgba(242, 201, 76, 0.16); }
button { min-height: 42px; border: 0; border-radius: 12px; padding: 0 18px; background: var(--gold); color: #000; font-weight: 800; display: inline-flex; align-items: center; gap: 8px; cursor: pointer; transition: transform 0.18s ease, background 0.18s ease, opacity 0.18s ease; }
button:hover:not(:disabled) { background: var(--gold-medium); transform: translateY(-1px); }
button:disabled { cursor: wait; opacity: 0.65; }
.refresh-icon { display: inline-block; font-size: 1.15rem; }
.refresh-icon.spinning { animation: spin 0.85s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
.status-box { margin-bottom: 18px; padding: 14px 16px; border: 1px solid var(--border); border-radius: 16px; background: var(--panel-soft); color: var(--text-muted); font-size: 0.9rem; }
.status-box strong { color: var(--gold-light); }
.stats-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 16px; }
.stat-card { min-height: 150px; padding: 20px; border: 1px solid var(--border); border-radius: var(--radius); background: var(--card); box-shadow: var(--shadow); display: flex; justify-content: space-between; align-items: flex-start; gap: 18px; animation: cardIn 0.35s ease both; }
.stat-card:nth-child(2) { animation-delay: 0.04s; }
.stat-card:nth-child(3) { animation-delay: 0.08s; }
.stat-card:nth-child(4) { animation-delay: 0.12s; }
@keyframes cardIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
.stat-title { margin: 0; color: var(--text-dim); font-size: 0.9rem; }
.stat-card h2 { margin: 10px 0 0; color: var(--gold-light); font-size: 1.65rem; letter-spacing: -0.03em; }
.trend { margin: 13px 0 0; color: var(--text-muted); font-size: 0.78rem; display: flex; align-items: center; gap: 4px; }
.stat-icon { width: 52px; height: 52px; flex: 0 0 52px; border: 1px solid var(--border-strong); border-radius: 16px; background: #1f1a10; color: var(--gold); display: grid; place-items: center; font-size: 1.35rem; font-weight: 900; }
.stat-icon.dark { color: #d9c68b; }
.dashboard-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 24px; margin-top: 24px; }
.panel { border: 1px solid var(--border); border-radius: var(--radius); background: var(--panel); box-shadow: var(--shadow); padding: 20px; min-width: 0; }
.panel-header { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 18px; }
.panel-header h2 { margin: 0; color: var(--gold-light); font-size: 1.2rem; }
.panel-header p { margin: 6px 0 0; color: var(--text-dim); font-size: 0.86rem; }
.chart-wrapper { position: relative; width: 100%; }
.chart-large { height: 320px; }
.chart-medium { height: 285px; }
.category-legend { display: grid; gap: 8px; margin-top: 14px; }
.legend-item { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 10px 12px; border-radius: 12px; background: #171717; font-size: 0.86rem; }
.legend-label { display: flex; align-items: center; gap: 9px; min-width: 0; color: var(--text-soft); }
.legend-dot { width: 10px; height: 10px; flex: 0 0 10px; border-radius: 50%; }
.legend-item strong { color: var(--gold-light); white-space: nowrap; }
.transactions-list { max-height: 288px; overflow-y: auto; padding-right: 4px; display: grid; gap: 10px; }
.transaction-item { padding: 12px; border: 1px solid #2b2415; border-radius: 12px; background: #151515; }
.transaction-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; }
.transaction-title { margin: 0; color: #f4e6b0; font-size: 0.92rem; font-weight: 700; }
.transaction-meta { margin: 5px 0 0; color: #9f936f; font-size: 0.75rem; }
.transaction-amount { color: var(--gold); white-space: nowrap; font-size: 0.9rem; }
.transaction-amount.expense { color: var(--gold-muted); }
.empty-state { border: 1px dashed var(--border); border-radius: 12px; padding: 24px; color: var(--text-dim); text-align: center; }
.transactions-list::-webkit-scrollbar { width: 8px; }
.transactions-list::-webkit-scrollbar-thumb { background: #4f401f; border-radius: 999px; }
.transactions-list::-webkit-scrollbar-track { background: transparent; }
@media (max-width: 1024px) { .stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .dashboard-grid { grid-template-columns: 1fr; } }
@media (max-width: 760px) { .container { width: min(100% - 22px, 1280px); padding-top: 22px; } .hero { align-items: stretch; flex-direction: column; } .header-actions { width: 100%; } .header-actions select, .header-actions button { flex: 1; } .stats-grid { grid-template-columns: 1fr; } .panel { padding: 16px; } .chart-large, .chart-medium { height: 280px; } }
@media (max-width: 460px) { .hero h1 { font-size: 2.35rem; } .header-actions { flex-direction: column; } .header-actions select, .header-actions button { width: 100%; } .transaction-row { flex-direction: column; } .transaction-amount { align-self: flex-end; } }
