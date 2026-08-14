const API_URL = "https://69d82cf90576c93882592c6b.mockapi.io/users-info";

const PIE_COLORS = ["#f2c94c", "#d6a93a", "#a77b20", "#7a5a18", "#c9b06a", "#8f7a3f"];

let transactions = [];
let currentFilter = "todos";
let monthlyChart = null;
let categoryChart = null;
let balanceChart = null;

const elements = {
  filterSelect: document.querySelector("#filterSelect"),
  refreshButton: document.querySelector("#refreshButton"),
  refreshIcon: document.querySelector("#refreshIcon"),
  statusText: document.querySelector("#statusText"),
  incomeTotal: document.querySelector("#incomeTotal"),
  expenseTotal: document.querySelector("#expenseTotal"),
  balanceTotal: document.querySelector("#balanceTotal"),
  transactionCount: document.querySelector("#transactionCount"),
  currentFilter: document.querySelector("#currentFilter"),
  transactionsList: document.querySelector("#transactionsList"),
  categoryLegend: document.querySelector("#categoryLegend"),
};

function parseCurrencyValue(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (value === null || value === undefined || value === "") return 0;

  let text = String(value).replace(/R\$/gi, "").replace(/\s/g, "").trim();
  if (!text) return 0;

  const hasComma = text.includes(",");
  const hasDot = text.includes(".");

  if (hasComma && hasDot) {
    if (text.lastIndexOf(",") > text.lastIndexOf(".")) {
      text = text.replace(/\./g, "").replace(",", ".");
    } else {
      text = text.replace(/,/g, "");
    }
  } else if (hasComma) {
    text = text.replace(",", ".");
  }

  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeType(value) {
  const raw = String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

  const incomeWords = ["receita", "entrada", "income", "credit", "credito", "ganho", "recebimento"];
  return incomeWords.some((word) => raw.includes(word)) ? "receita" : "despesa";
}

function normalizeTransaction(item, index = 0) {
  return {
    id: item.ide ?? item.id ?? index + 1,
    title:
      item.buy ??
      item.title ??
      item.titulo ??
      item.descricao ??
      item.description ??
      item.nome ??
      item.name ??
      `Lançamento ${index + 1}`,
    type: normalizeType(
      item.movimento ??
      item.tipoMovimento ??
      item.tipoLancamento ??
      item.natureza ??
      item.tipo ??
      item.type
    ),
    category: item.category ?? item.categoria ?? item.grupo ?? item.type ?? "Sem categoria",
    amount: parseCurrencyValue(
      item.value2 ??
      item.amount ??
      item.valor ??
      item.value ??
      item.preco ??
      item.total ??
      0
    ),
    date:
      item.date2 ??
      item.date ??
      item.data ??
      item.dataLancamento ??
      item.data_lancamento ??
      item.createdAt ??
      null,
  };
}

function safeDate(value) {
  if (value === null || value === undefined || value === "") return null;

  if (typeof value === "number") {
    const millis = value < 1e12 ? value * 1000 : value;
    const date = new Date(millis);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const text = String(value).trim();

  // Data ISO sem horário (YYYY-MM-DD) deve ser criada no fuso local.
  // new Date("2026-05-01") usa UTC e no Brasil pode virar 30/04.
  const isoDateOnly = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (isoDateOnly) {
    const [, year, month, day] = isoDateOnly;
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const br = text.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})/);

  if (br) {
    const [, day, month, year] = br;
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return Number.isNaN(date.getTime()) ? null : date;
  }

  if (/^\d{10,13}$/.test(text)) {
    const numeric = Number(text);
    const date = new Date(text.length === 10 ? numeric * 1000 : numeric);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? null : date;
}

function currency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value) || 0);
}

function monthKey(value) {
  const date = safeDate(value);
  if (!date) return "sem-data";
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(value) {
  const date = safeDate(value);
  if (!date) return "Sem data";
  return date.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" }).replace(".", "");
}

function getTotals(data) {
  const income = data
    .filter((item) => item.type === "receita")
    .reduce((sum, item) => sum + item.amount, 0);

  const expense = data
    .filter((item) => item.type === "despesa")
    .reduce((sum, item) => sum + item.amount, 0);

  return {
    income,
    expense,
    balance: income - expense,
    count: data.length,
  };
}

function getMonthlyData(data) {
  const grouped = new Map();

  data.forEach((item) => {
    const key = monthKey(item.date);

    if (!grouped.has(key)) {
      grouped.set(key, {
        key,
        month: monthLabel(item.date),
        receitas: 0,
        despesas: 0,
        saldo: 0,
      });
    }

    const current = grouped.get(key);

    if (item.type === "receita") current.receitas += item.amount;
    else current.despesas += item.amount;

    current.saldo = current.receitas - current.despesas;
  });

  return Array.from(grouped.values()).sort((a, b) => {
    if (a.key === "sem-data") return 1;
    if (b.key === "sem-data") return -1;
    return a.key.localeCompare(b.key);
  });
}

function getCategoryData(data) {
  const grouped = new Map();

  data
    .filter((item) => item.type === "despesa")
    .forEach((item) => {
      grouped.set(item.category, (grouped.get(item.category) || 0) + item.amount);
    });

  return Array.from(grouped, ([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
}

function getFilteredData(data) {
  if (currentFilter === "todos") return data;
  return data.filter((item) => item.type === currentFilter);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function updateStats(data) {
  const totals = getTotals(data);
  elements.incomeTotal.textContent = currency(totals.income);
  elements.expenseTotal.textContent = currency(totals.expense);
  elements.balanceTotal.textContent = currency(totals.balance);
  elements.transactionCount.textContent = String(totals.count);
}

function renderTransactions(data) {
  elements.currentFilter.textContent = currentFilter;
  elements.transactionsList.innerHTML = "";

  if (!data.length) {
    elements.transactionsList.innerHTML = '<div class="empty-state">Nenhum lançamento encontrado.</div>';
    return;
  }

  data
    .slice()
    .sort((a, b) => (safeDate(b.date)?.getTime() ?? 0) - (safeDate(a.date)?.getTime() ?? 0))
    .slice(0, 8)
    .forEach((item) => {
      const date = safeDate(item.date);
      const formattedDate = date ? date.toLocaleDateString("pt-BR") : "Sem data";
      const sign = item.type === "receita" ? "+" : "-";
      const row = document.createElement("article");
      row.className = "transaction-item";

      row.innerHTML = `
        <div class="transaction-row">
          <div>
            <p class="transaction-title">${escapeHtml(item.title)}</p>
            <p class="transaction-meta">${escapeHtml(item.category)} · ${formattedDate}</p>
          </div>
          <strong class="transaction-amount ${item.type === "despesa" ? "expense" : ""}">
            ${sign}${currency(item.amount)}
          </strong>
        </div>
      `;

      elements.transactionsList.appendChild(row);
    });
}

function renderCategoryLegend(categoryData) {
  elements.categoryLegend.innerHTML = "";

  if (!categoryData.length) {
    elements.categoryLegend.innerHTML = '<div class="empty-state">Nenhuma despesa encontrada.</div>';
    return;
  }

  categoryData.slice(0, 5).forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "legend-item";
    row.innerHTML = `
      <span class="legend-label">
        <span class="legend-dot" style="background:${PIE_COLORS[index % PIE_COLORS.length]}"></span>
        <span>${escapeHtml(item.name)}</span>
      </span>
      <strong>${currency(item.value)}</strong>
    `;
    elements.categoryLegend.appendChild(row);
  });
}

function chartOptions() {
  return {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    scales: {
      x: {
        ticks: { color: "#b8aa86" },
        grid: { color: "#2b2415" },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "#b8aa86",
          callback: (value) => currency(value),
        },
        grid: { color: "#2b2415" },
      },
    },
    plugins: {
      legend: {
        labels: { color: "#e7ddbd", usePointStyle: true },
      },
      tooltip: {
        backgroundColor: "#0b0b0b",
        borderColor: "#6f5723",
        borderWidth: 1,
        titleColor: "#f5d77b",
        bodyColor: "#e7ddbd",
        callbacks: {
          label(context) {
            const value = context.parsed.y ?? context.raw;
            return `${context.dataset.label}: ${currency(value)}`;
          },
        },
      },
    },
  };
}

function buildCharts(data) {
  const monthlyData = getMonthlyData(data);
  const categoryData = getCategoryData(data);
  const monthLabels = monthlyData.map((item) => item.month);

  if (monthlyChart) monthlyChart.destroy();
  if (categoryChart) categoryChart.destroy();
  if (balanceChart) balanceChart.destroy();

  monthlyChart = new Chart(document.querySelector("#monthlyChart"), {
    type: "bar",
    data: {
      labels: monthLabels,
      datasets: [
        {
          label: "Receitas",
          data: monthlyData.map((item) => item.receitas),
          backgroundColor: "#f2c94c",
          borderRadius: 8,
        },
        {
          label: "Despesas",
          data: monthlyData.map((item) => item.despesas),
          backgroundColor: "#7a5a18",
          borderRadius: 8,
        },
      ],
    },
    options: chartOptions(),
  });

  categoryChart = new Chart(document.querySelector("#categoryChart"), {
    type: "doughnut",
    data: {
      labels: categoryData.map((item) => item.name),
      datasets: [
        {
          label: "Despesas",
          data: categoryData.map((item) => item.value),
          backgroundColor: categoryData.map((_, index) => PIE_COLORS[index % PIE_COLORS.length]),
          borderColor: "#101010",
          borderWidth: 4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "62%",
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => `${context.label}: ${currency(context.raw)}`,
          },
        },
      },
    },
  });

  const balanceCanvas = document.querySelector("#balanceChart");
  const ctx = balanceCanvas.getContext("2d");
  const gradient = ctx.createLinearGradient(0, 0, 0, 300);
  gradient.addColorStop(0, "rgba(242, 201, 76, 0.55)");
  gradient.addColorStop(1, "rgba(242, 201, 76, 0.02)");

  balanceChart = new Chart(balanceCanvas, {
    type: "line",
    data: {
      labels: monthLabels,
      datasets: [
        {
          label: "Saldo",
          data: monthlyData.map((item) => item.saldo),
          borderColor: "#f2c94c",
          backgroundColor: gradient,
          fill: true,
          tension: 0.34,
          borderWidth: 3,
        },
      ],
    },
    options: chartOptions(),
  });

  renderCategoryLegend(categoryData);
}

function renderDashboard() {
  const filtered = getFilteredData(transactions);
  updateStats(transactions);
  renderTransactions(filtered);
  buildCharts(transactions);
}

function setLoading(isLoading) {
  elements.refreshButton.disabled = isLoading;
  elements.refreshIcon.classList.toggle("spinning", isLoading);
}

async function loadData() {
  setLoading(true);
  elements.statusText.textContent = "Conectando à MockAPI...";

  try {
    const response = await fetch(API_URL, {
      method: "GET",
      cache: "no-store",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`);
    }

    const payload = await response.json();
    const list = Array.isArray(payload)
      ? payload
      : Array.isArray(payload.data)
        ? payload.data
        : Array.isArray(payload.items)
          ? payload.items
          : [];

    if (!Array.isArray(list)) {
      throw new Error("Formato inesperado retornado pela API");
    }

    transactions = list.map(normalizeTransaction);

    console.info("[Controle Financeiro] JSON MockAPI:", payload);
    console.table(transactions);

    const loadedAt = new Date().toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    elements.statusText.textContent =
      `MockAPI conectada: ${transactions.length} lançamento(s) · atualizado às ${loadedAt}`;

    renderDashboard();
  } catch (error) {
    console.error("[Controle Financeiro] Erro na MockAPI:", error);
    transactions = [];
    renderDashboard();
    elements.statusText.textContent = `Erro na MockAPI: ${error.message}`;
  } finally {
    setLoading(false);
  }
}

elements.filterSelect.addEventListener("change", (event) => {
  currentFilter = event.target.value;
  renderDashboard();
});

elements.refreshButton.addEventListener("click", loadData);

loadData();
