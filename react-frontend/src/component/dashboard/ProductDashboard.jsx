import { useMemo, useState } from "react";
import useProducts from "../../hooks/useProducts";
import StatCard from "./StatCard";
import Panel from "./Panel";
import BarList from "./BarList";
import DataTable from "./DataTable";
import SearchInput from "./SearchInput";
import SelectFilter from "./SelectFilter";
import StockBadge from "./StockBadge";
import StatusMessage from "./StatusMessage";
import { formatCurrency, formatNumber, getStockLevel, LOW_STOCK_THRESHOLD } from "./format";
import "./styles/ProductDashboard.css";

const UNCATEGORIZED = "Uncategorized";

const stockValue = (product) => (Number(product.price) || 0) * (Number(product.quantity) || 0);

const columns = [
  { key: "name", label: "Product" },
  { key: "category", label: "Category", render: (row) => row.category || UNCATEGORIZED },
  {
    key: "price",
    label: "Price",
    align: "right",
    sortValue: (row) => Number(row.price),
    render: (row) => formatCurrency(row.price),
  },
  {
    key: "quantity",
    label: "Quantity",
    align: "right",
    sortValue: (row) => Number(row.quantity),
    render: (row) => formatNumber(row.quantity),
  },
  {
    key: "stock",
    label: "Stock",
    sortValue: (row) => Number(row.quantity),
    render: (row) => <StockBadge quantity={row.quantity} />,
  },
];

export default function ProductDashboard() {
  const { products, loading, error, refetch } = useProducts();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const categoryOptions = useMemo(() => {
    const names = [...new Set(products.map((p) => p.category || UNCATEGORIZED))].sort();
    return [
      { value: "all", label: "All categories" },
      ...names.map((name) => ({ value: name, label: name })),
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchesCategory = category === "all" || (p.category || UNCATEGORIZED) === category;
      const matchesSearch = !term || p.name?.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [products, search, category]);

  const stats = useMemo(() => ({
    totalUnits: filteredProducts.reduce((sum, p) => sum + (Number(p.quantity) || 0), 0),
    inventoryValue: filteredProducts.reduce((sum, p) => sum + stockValue(p), 0),
    lowStock: filteredProducts.filter((p) => getStockLevel(p.quantity) !== "in").length,
  }), [filteredProducts]);

  const valueByCategory = useMemo(() => {
    const totals = {};
    filteredProducts.forEach((p) => {
      const name = p.category || UNCATEGORIZED;
      totals[name] = (totals[name] || 0) + stockValue(p);
    });
    return Object.entries(totals)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  }, [filteredProducts]);

  if (loading) {
    return (
      <div className="product-dashboard">
        <StatusMessage message="Loading products..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-dashboard">
        <StatusMessage type="error" message={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="product-dashboard">
      <header className="product-dashboard-header">
        <h1 className="product-dashboard-title">Product Dashboard</h1>
        <div className="product-dashboard-filters">
          <SearchInput value={search} onChange={setSearch} placeholder="Search products" />
          <SelectFilter
            label="Filter by category"
            value={category}
            onChange={setCategory}
            options={categoryOptions}
          />
          <button type="button" className="filter-control filter-button" onClick={refetch}>
            Refresh
          </button>
        </div>
      </header>

      <div className="product-dashboard-stats">
        <StatCard label="Products" value={formatNumber(filteredProducts.length)} />
        <StatCard label="Units in stock" value={formatNumber(stats.totalUnits)} />
        <StatCard label="Inventory value" value={formatCurrency(stats.inventoryValue)} />
        <StatCard
          label="Low / out of stock"
          value={formatNumber(stats.lowStock)}
          hint={`Fewer than ${LOW_STOCK_THRESHOLD} units`}
        />
      </div>

      <Panel title="Inventory value by category">
        <BarList items={valueByCategory} formatValue={formatCurrency} />
      </Panel>

      <Panel title="Products">
        <DataTable
          columns={columns}
          rows={filteredProducts}
          emptyMessage="No products match your filters."
        />
      </Panel>
    </div>
  );
}
