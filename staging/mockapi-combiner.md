(() => {
  const originalFetch = window.fetch.bind(window);
  const EXPENSE_URL = "https://69d82cf90576c93882592c6b.mockapi.io/users-info";
  const INCOME_URL = "https://69d82cf90576c93882592c6b.mockapi.io/gastos";

  function parseMoney(value) {
    if (typeof value === "number") return Number.isFinite(value) ? value : 0;
    if (value === null || value === undefined || value === "") return 0;

    let text = String(value).replace(/R\$/gi, "").replace(/\s/g, "").trim();
    if (!text) return 0;

    if (text.includes(",") && text.includes(".")) {
      if (text.lastIndexOf(",") > text.lastIndexOf(".")) {
        text = text.replace(/\./g, "").replace(",", ".");
      } else {
        text = text.replace(/,/g, "");
      }
    } else if (text.includes(",")) {
      text = text.replace(",", ".");
    }

    text = text.replace(/[^0-9.-]/g, "");
    const number = Number(text);
    return Number.isFinite(number) ? number : 0;
  }

  function normalizeKey(value) {
    return String(value ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
  }

  function getList(payload) {
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.data)) return payload.data;
    if (Array.isArray(payload?.items)) return payload.items;
    if (Array.isArray(payload?.results)) return payload.results;
    return [];
  }

  function pick(item, keys) {
    for (const key of keys) {
      if (item?.[key] !== undefined && item?.[key] !== null && item?.[key] !== "") {
        return item[key];
      }
    }
    return undefined;
  }

  function findIncomeAmount(item) {
    const preferred = pick(item, [
      "value1",
      "valor1",
      "amount",
      "valor",
      "value",
      "receita",
      "income",
      "entrada",
      "renda",
      "salario",
      "faturamento",
      "total",
    ]);

    if (preferred !== undefined) return parseMoney(preferred);

    const aliases = ["amount", "valor", "value", "receita", "income", "entrada", "renda", "salario", "faturamento", "total"];

    for (const [key, value] of Object.entries(item ?? {})) {
      const normalized = normalizeKey(key);
      if (aliases.some((alias) => normalized.includes(alias))) {
        const parsed = parseMoney(value);
        if (parsed !== 0) return parsed;
      }
    }

    return 0;
  }

  function normalizeIncome(item, index) {
    return {
      id: `receita-${item.ide ?? item.id ?? index + 1}`,
      title:
        item.buy ??
        item.title ??
        item.titulo ??
        item.descricao ??
        item.description ??
        item.nome ??
        item.name ??
        item.origem ??
        item.source ??
        `Receita ${index + 1}`,
      type: "receita",
      category:
        item.category ??
        item.categoria ??
        item.grupo ??
        item.origem ??
        item.source ??
        item.type ??
        "Receitas",
      amount: findIncomeAmount(item),
      date:
        item.date1 ??
        item.data1 ??
        item.date ??
        item.data ??
        item.dataReceita ??
        item.data_receita ??
        item.createdAt ??
        null,
    };
  }

  window.fetch = async function combinedMockApiFetch(input, init = {}) {
    const requestedUrl = typeof input === "string" ? input : input?.url ?? "";

    if (!requestedUrl.includes("mockapi.io/users-info")) {
      return originalFetch(input, init);
    }

    const [expenseResponse, incomeResponse] = await Promise.all([
      originalFetch(input, init),
      originalFetch(INCOME_URL, {
        method: "GET",
        cache: "no-store",
        headers: { Accept: "application/json" },
      }),
    ]);

    if (!expenseResponse.ok) return expenseResponse;

    const expensePayload = await expenseResponse.clone().json();
    const expenses = getList(expensePayload);

    let incomes = [];
    if (incomeResponse.ok) {
      const incomePayload = await incomeResponse.json();
      incomes = getList(incomePayload).map(normalizeIncome);
    } else {
      console.error("[MockAPI] /gastos falhou:", incomeResponse.status, incomeResponse.statusText);
    }

    const combined = [...expenses, ...incomes];

    console.info("[MockAPI] /users-info despesas:", expenses.length);
    console.info("[MockAPI] /gastos receitas:", incomes.length);
    console.table(incomes);

    return new Response(JSON.stringify(combined), {
      status: expenseResponse.status,
      statusText: expenseResponse.statusText,
      headers: { "content-type": "application/json; charset=utf-8" },
    });
  };
})();
