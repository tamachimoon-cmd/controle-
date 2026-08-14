<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="Dashboard financeiro preto e dourado com dados carregados via MockAPI." />
  <title>Finance Intelligence | Dashboard Financeiro</title>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">

  <link rel="stylesheet" href="styles.css" />
</head>

<body>
  <div class="background-glow glow-left"></div>
  <div class="background-glow glow-right"></div>

  <main class="container">
    <header class="hero">
      <div>
        <p class="eyebrow">Finance Intelligence</p>
        <h1>Dashboard Financeiro</h1>
        <p class="subtitle">
          Visão executiva de receitas, despesas, saldo e categorias.
          Preto e dourado, porque planilha sem estilo é só sofrimento com borda.
        </p>
      </div>

      <div class="header-actions">
        <select id="filterSelect" aria-label="Filtrar lançamentos">
          <option value="todos">Todos</option>
          <option value="receita">Receitas</option>
          <option value="despesa">Despesas</option>
        </select>

        <button id="refreshButton" type="button">
          <span id="refreshIcon" class="refresh-icon">↻</span>
          <span>Atualizar</span>
        </button>
      </div>
    </header>

    <section class="status-box">
      <strong>Status:</strong>
      <span id="statusText">Conectando à MockAPI...</span>
    </section>

    <section class="stats-grid">
      <article class="stat-card">
        <div>
          <p class="stat-title">Receitas</p>
          <h2 id="incomeTotal">R$ 0,00</h2>
          <p class="trend positive">↗ <span>12% no período</span></p>
        </div>
        <div class="stat-icon">↗</div>
      </article>

      <article class="stat-card">
        <div>
          <p class="stat-title">Despesas</p>
          <h2 id="expenseTotal">R$ 0,00</h2>
          <p class="trend negative">↘ <span>8% no período</span></p>
        </div>
        <div class="stat-icon dark">↘</div>
      </article>

      <article class="stat-card">
        <div>
          <p class="stat-title">Saldo</p>
          <h2 id="balanceTotal">R$ 0,00</h2>
          <p class="trend positive">↗ <span>18% no período</span></p>
        </div>
        <div class="stat-icon">▣</div>
      </article>

      <article class="stat-card">
        <div>
          <p class="stat-title">Lançamentos</p>
          <h2 id="transactionCount">0</h2>
          <p class="trend positive">↗ <span>5% no período</span></p>
        </div>
        <div class="stat-icon dark">●</div>
      </article>
    </section>

    <section class="dashboard-grid first-row">
      <article class="panel panel-wide">
        <div class="panel-header">
          <div>
            <h2>Receitas x Despesas</h2>
            <p>Comparativo mensal consolidado</p>
          </div>
        </div>

        <div class="chart-wrapper chart-large">
          <canvas id="monthlyChart"></canvas>
        </div>
      </article>

      <article class="panel">
        <div class="panel-header">
          <div>
            <h2>Despesas por Categoria</h2>
            <p>Onde o dinheiro está vazando</p>
          </div>
        </div>

        <div class="chart-wrapper chart-large">
          <canvas id="categoryChart"></canvas>
        </div>

        <div id="categoryLegend" class="category-legend"></div>
      </article>
    </section>

    <section class="dashboard-grid second-row">
      <article class="panel panel-wide">
        <div class="panel-header">
          <div>
            <h2>Evolução do Saldo</h2>
            <p>Tendência mensal do caixa</p>
          </div>
        </div>

        <div class="chart-wrapper chart-medium">
          <canvas id="balanceChart"></canvas>
        </div>
      </article>

      <article class="panel">
        <div class="panel-header">
          <div>
            <h2>Últimos Lançamentos</h2>
            <p>Filtrado por: <span id="currentFilter">todos</span></p>
          </div>
        </div>

        <div id="transactionsList" class="transactions-list"></div>
      </article>
    </section>
  </main>

  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.7/dist/chart.umd.min.js"></script>
  <script src="mockapi-combiner.js"></script>
  <script src="app.js"></script>
</body>
</html>
