(() => {
  const originalFetch = window.fetch.bind(window);

  function normalizeKey(value) {
    return String(value ?? "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
  }

  function parseNumber(value) {
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

  function entries(record) {
    return Object.entries(record ?? {}).map(([key, value]) => ({
      key,
      normalizedKey: normalizeKey(key),
      value,
    }));
  }

  function pick(record, aliases) {
    const list = entries(record);
    const normalizedAliases = aliases.map(normalizeKey);

    for (const alias of normalizedAliases) {
      const exact = list.find((item) => item.normalizedKey === alias);
      if (exact) return exact;
    }

    for (const alias of normalizedAliases) {
      const partial = list.find(
        (item) =>
          item.normalizedKey.includes(alias) ||
          (item.normalizedKey.length > 2 && alias.includes(item.normalizedKey))
      );
      if (partial) return partial;
    }

    return null;
  }

  const aliases = {
    amount: ["amount", "valor", "value", "preco", "price", "total", "valorTotal", "valorLancamento", "vlr"],
    type: ["type", "tipo", "natureza", "movimento", "tipoMovimento", "tipoLancamento"],
    title: ["title", "titulo", "descricao", "description", "nome", "name", "lancamento", "item"],
    category: ["category", "categoria", "grupo", "segmento", "classe"],
    date: ["date", "data", "dataLancamento", "createdAt", "mes", "month", "periodo", "period", "competencia"],
    income: ["receita", "receitas", "income", "incomes", "entrada", "entradas", "faturamento", "renda", "salario", "ganho", "ganhos", "recebido", "recebimentos", "lucro"],
    expense: ["despesa", "despesas", "expense", "expenses", "saida", "saidas", "gasto", "gastos", "custo", "custos", "pagamento", "pagamentos", "divida", "dividas", "contas"],
  };

  function normalizeRecord(record, index) {
    const amountField = pick(record, aliases.amount);
    const typeField = pick(record, aliases.type);
    const titleField = pick(record, aliases.title);
    const categoryField = pick(record, aliases.category);
    const dateField = pick(record, aliases.date);

    if (amountField || typeField) {
      return [
        {
          id: record.id ?? record._id ?? index + 1,
          title: titleField?.value ?? `Lançamento ${index + 1}`,
          type: typeField?.value ?? "despesa",
          category: categoryField?.value ?? "Sem categoria",
          amount: parseNumber(amountField?.value ?? 0),
          date: dateField?.value ?? record.createdAt ?? null,
        },
      ];
    }

    const incomeField = pick(record, aliases.income);
    const expenseField = pick(record, aliases.expense);
    const date = dateField?.value ?? record.createdAt ?? null;
    const baseTitle = titleField?.value ?? `Registro ${index + 1}`;
    const category = categoryField?.value ?? "Sem categoria";
    const result = [];

    if (incomeField) {
      const amount = parseNumber(incomeField.value);
      if (amount !== 0) {
        result.push({
          id: `${record.id ?? index + 1}-receita`,
          title: `${baseTitle} · Receita`,
          type: "receita",
          category: category === "Sem categoria" ? "Receitas" : category,
          amount,
          date,
        });
      }
    }

    if (expenseField) {
      const amount = parseNumber(expenseField.value);
      if (amount !== 0) {
        result.push({
          id: `${record.id ?? index + 1}-despesa`,
          title: `${baseTitle} · Despesa`,
          type: "despesa",
          category: category === "Sem categoria" ? "Despesas" : category,
          amount,
          date,
        });
      }
    }

    return result.length ? result : [record];
  }

  function transformPayload(payload) {
    const list = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.data)
        ? payload.data
        : Array.isArray(payload?.items)
          ? payload.items
          : Array.isArray(payload?.results)
            ? payload.results
            : [];

    const transformed = list.flatMap((record, index) => normalizeRecord(record, index));

    if (list[0]) {
      console.info("[MockAPI Adapter] Campos recebidos:", Object.keys(list[0]));
    }
    console.info("[MockAPI Adapter] Registros originais:", list.length);
    console.info("[MockAPI Adapter] Lançamentos enviados ao gráfico:", transformed.length);
    console.table(transformed);

    return transformed;
  }

  window.fetch = async function patchedFetch(input, init) {
    const response = await originalFetch(input, init);
    const url = typeof input === "string" ? input : input?.url ?? "";

    if (!url.includes("mockapi.io/users-info") || !response.ok) {
      return response;
    }

    try {
      const payload = await response.clone().json();
      const transformed = transformPayload(payload);

      return new Response(JSON.stringify(transformed), {
        status: response.status,
        statusText: response.statusText,
        headers: {
          "content-type": "application/json; charset=utf-8",
        },
      });
    } catch (error) {
      console.error("[MockAPI Adapter] Falha ao adaptar resposta:", error);
      return response;
    }
  };
})();
