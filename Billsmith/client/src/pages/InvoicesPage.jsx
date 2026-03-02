import React, { useEffect, useMemo, useState } from "react";
import { apiGet } from "../components/api";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import SortDropdown from "../components/SortDropdown";
import SimpleDropdown from "../components/SimpleDropdown"

export default function InvoicesPage() {
  const [minAmount, setMinAmount] = useState("200");
  const [maxAmount, setMaxAmount] = useState("2000");
  const [sort, setSort] = useState("-amount");
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);

  const [fields, setFields] = useState({
    amount: true,
    status: true,
    dueDate: true,
    description: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [payload, setPayload] = useState(null);

  const select = useMemo(() => {
    return Object.entries(fields)
      .filter(([, v]) => v)
      .map(([k]) => k)
      .join(",");
  }, [fields]);

  const params = useMemo(() => {
    return {
      minAmount: minAmount || undefined,
      maxAmount: maxAmount || undefined,
      select: select || undefined,
      sort,
      page,
      limit,
    };
  }, [minAmount, maxAmount, select, sort, page, limit]);

  const debugQuery = useMemo(() => {
    const qp = new URLSearchParams();
    if (minAmount) qp.set("minAmount", minAmount);
    if (maxAmount) qp.set("maxAmount", maxAmount);
    if (select) qp.set("select", select);
    if (sort) qp.set("sort", sort);
    qp.set("page", String(page));
    qp.set("limit", String(limit));
    return qp.toString();
  }, [minAmount, maxAmount, select, sort, page, limit]);

  function getSortIcon(value) {
    return value?.startsWith("-") ? (
      <FaArrowDown className="sortIcon down" />
    ) : (
      <FaArrowUp className="sortIcon up" />
    );
  }

  function formatCell(col, value) {
    if (col === "amount" && value !== undefined && value !== null && value !== "") {
      const n = Number(value);
      return Number.isFinite(n) ? `$${n.toFixed(2)}` : String(value);
    }
    if (col === "dueDate" && value) {
      const d = new Date(value);
      return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleDateString();
    }
    return String(value ?? "");
  }

  async function runQuery() {
    setLoading(true);
    setError("");
    try {
      const data = await apiGet("/api/invoices", params);
      setPayload(data);
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
      setPayload(null);
    } finally {
      setLoading(false);
    }
  }

  // Auto-run whenever query controls change
  useEffect(() => {
    runQuery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const rows = Array.isArray(payload) ? payload : payload?.data || [];
  const totalPages = Array.isArray(payload) ? null : payload?.totalPages;
  const total = Array.isArray(payload) ? null : payload?.total;

  const canNext = totalPages ? page < totalPages : rows.length === limit;

  useEffect(() => {
    if (!Number.isFinite(page) || page < 1) setPage(1);
  }, [page]);

  return (
    <section className="card">
      <div className="card__header">
        <h2>Invoices</h2>
        <p className="muted">
          Demonstrates amount range, select, sort, and pagination.
        </p>
      </div>

      <div className="controls">
        <div className="control">
          <label>Min Amount</label>
          <input value={minAmount} onChange={(e) => setMinAmount(e.target.value)} />
        </div>

        <div className="control">
          <label>Max Amount</label>
          <input value={maxAmount} onChange={(e) => setMaxAmount(e.target.value)} />
        </div>

        <div className="control">
          <label>Sort</label>
          <SortDropdown
            value={sort}
            onChange={setSort}
            options={[
              { value: "-amount", label: "Amount" },
              { value: "amount", label: "Amount" },
              { value: "-dueDate", label: "Due Date" },
              { value: "dueDate", label: "Due Date" },
            ]}
          />
        </div>

        <div className="control">
          <label>Limit</label>
          <SimpleDropdown
            value={limit}
            onChange={(val) => setLimit(Number(val))}
            options={[
              { value: 2, label: "2 per page" },
              { value: 5, label: "5 per page" },
              { value: 10, label: "10 per page" },
            ]}
          />
        </div>

        <div className="control">
          <label>Page</label>
          <input value={page} onChange={(e) => setPage(Number(e.target.value) || 1)} />
        </div>

        <button className="btn" onClick={runQuery} disabled={loading}>
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      <div className="selectFields">
        <div className="muted small">Select fields (projection)</div>
        {Object.keys(fields).map((k) => (
          <label key={k} className="check">
            <input
              type="checkbox"
              checked={fields[k]}
              onChange={(e) => setFields((p) => ({ ...p, [k]: e.target.checked }))}
            />
            {k}
          </label>
        ))}
      </div>

      <div className="debug muted small">GET /api/invoices?{debugQuery}</div>

      {error ? <div className="error">{error}</div> : null}

      <div className="results">
        <div className="results__meta">
          <span className="muted small">
            {Array.isArray(payload)
              ? `Results: ${rows.length}`
              : `Results: ${rows.length} | Page: ${payload?.page ?? page} | TotalPages: ${
                  totalPages ?? "n/a"
                } | Total: ${total ?? "n/a"}`}
          </span>

          <div className="pager">
            <button
              className="btn btn--ghost"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
            >
              Prev
            </button>
            <button
              className="btn btn--ghost"
              onClick={() => setPage((p) => p + 1)}
              disabled={!canNext || loading}
            >
              Next
            </button>
          </div>
        </div>

        {loading ? (
          <div className="empty">Loading invoices…</div>
        ) : rows.length === 0 ? (
          <div className="empty">
            No results. Try widening the amount range or increasing the max.
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                {select
                  .split(",")
                  .filter(Boolean)
                  .map((col) => (
                    <th key={col}>{col}</th>
                  ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((inv) => (
                <tr key={inv._id}>
                  {select
                    .split(",")
                    .filter(Boolean)
                    .map((col) => (
                      <td key={col}>{formatCell(col, inv[col])}</td>
                    ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}