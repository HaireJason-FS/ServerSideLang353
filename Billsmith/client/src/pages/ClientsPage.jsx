import React, { useEffect, useMemo, useState } from "react";
import { apiGet } from "../components/api";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import SortDropdown from "../components/SortDropdown";
import SimpleDropdown from "../components/SimpleDropdown"

export default function ClientsPage() {
  // query controls
  const [minRate, setMinRate] = useState("150");
  const [maxRate, setMaxRate] = useState("300");
  const [sort, setSort] = useState("-monthlyRate");
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(1);

  // select controls
  const [fields, setFields] = useState({
    businessName: true,
    contactEmail: true,
    monthlyRate: true,
    status: true,
  });

  // data state
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
      minRate: minRate || undefined,
      maxRate: maxRate || undefined,
      select: select || undefined,
      sort,
      page,
      limit,
    };
  }, [minRate, maxRate, select, sort, page, limit]);

  const debugQuery = useMemo(() => {
    const qp = new URLSearchParams();
    if (minRate) qp.set("minRate", minRate);
    if (maxRate) qp.set("maxRate", maxRate);
    if (select) qp.set("select", select);
    if (sort) qp.set("sort", sort);
    qp.set("page", String(page));
    qp.set("limit", String(limit));
    return qp.toString();
  }, [minRate, maxRate, select, sort, page, limit]);

  function getSortIcon(value) {
    return value?.startsWith("-") ? (
      <FaArrowDown className="sortIcon down" />
    ) : (
      <FaArrowUp className="sortIcon up" />
    );
  }

  function formatCell(col, value) {
    if (col === "monthlyRate" && value !== undefined && value !== null && value !== "") {
      const n = Number(value);
      return Number.isFinite(n) ? `$${n.toFixed(2)}` : String(value);
    }
    return String(value ?? "");
  }

  async function runQuery() {
    setLoading(true);
    setError("");
    try {
      const data = await apiGet("/api/clients", params);
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

  // Smarter "Next" logic:
  // - if API gives totalPages, trust it
  // - else enable next if we got a full page of results
  const canNext = totalPages ? page < totalPages : rows.length === limit;

  useEffect(() => {
    if (!Number.isFinite(page) || page < 1) setPage(1);
  }, [page]);

  return (
    <section className="card">
      <div className="card__header">
        <h2>Clients</h2>
        <p className="muted">
          Test filtering, select, sort, and pagination using query strings.
        </p>
      </div>

      <div className="controls">
        <div className="control">
          <label>Min Rate</label>
          <input value={minRate} onChange={(e) => setMinRate(e.target.value)} />
        </div>

        <div className="control">
          <label>Max Rate</label>
          <input value={maxRate} onChange={(e) => setMaxRate(e.target.value)} />
        </div>

        <div className="control sortControl">
          <label>Sort</label>
          <SortDropdown
            value={sort}
            onChange={setSort}
            options={[
              { value: "-monthlyRate", label: "Monthly Rate" },
              { value: "monthlyRate", label: "Monthly Rate" },
              { value: "-createdAt", label: "Created" },
              { value: "createdAt", label: "Created" },
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
          <input
            value={page}
            onChange={(e) => setPage(Number(e.target.value) || 1)}
          />
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
              onChange={(e) =>
                setFields((p) => ({ ...p, [k]: e.target.checked }))
              }
            />
            {k}
          </label>
        ))}
      </div>

      <div className="debug muted small">GET /api/clients?{debugQuery}</div>

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
          <div className="empty">Loading clients…</div>
        ) : rows.length === 0 ? (
          <div className="empty">
            No results. Try widening the rate range or increasing the max.
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
              {rows.map((c) => (
                <tr key={c._id}>
                  {select
                    .split(",")
                    .filter(Boolean)
                    .map((col) => (
                      <td key={col}>{formatCell(col, c[col])}</td>
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