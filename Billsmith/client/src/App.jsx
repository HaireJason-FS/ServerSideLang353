import React, { useState } from "react";
import ClientsPage from "./pages/ClientsPage";
import InvoicesPage from "./pages/InvoicesPage";

export default function App() {
  const [tab, setTab] = useState("clients");

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand__title">BillSmith</div>
          <div className="brand__sub">Query-powered collections</div>
        </div>

        <nav className="tabs">
          <button
            className={`tab ${tab === "clients" ? "is-active" : ""}`}
            onClick={() => setTab("clients")}
          >
            Clients
          </button>
          <button
            className={`tab ${tab === "invoices" ? "is-active" : ""}`}
            onClick={() => setTab("invoices")}
          >
            Invoices
          </button>
        </nav>
      </header>

      <main className="container">
        {tab === "clients" ? <ClientsPage /> : <InvoicesPage />}
      </main>
    </div>
  );
}