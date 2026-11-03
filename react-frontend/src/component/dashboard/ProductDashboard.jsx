import { useCallback, useMemo, useState } from "react";
import useProducts from "../../hooks/useProducts";
import { downloadCsv } from "../../utils/csv";
import StatCard from "./StatCard";
import Panel from "./Panel";
import BarList from "./BarList";
import StackedBar from "./StackedBar";
import DataTable from "./DataTable";
import SearchInput from "./SearchInput";
import SelectFilter from "./SelectFilter";
import SegmentedControl from "./SegmentedControl";
import StockBadge from "./StockBadge";
import StatusMessage from "./StatusMessage";
import Modal from "./Modal";
import ProductDetails from "./ProductDetails";
import DashboardSkeleton from "./DashboardSkeleton";
import {
  formatCurrency,
  formatNumber,
  getStockLevel,
  stockValue,
  LOW_STOCK_THRESHOLD,
  STOCK_LEVELS,
} from "./format";
import "./styles/ProductDashboard.css";

const UNCATEGORIZED = "Uncategorized";
const PAGE_SIZE = 10;

const categoryOf = (product) => product.category || UNCATEGORIZED;

const columns = [
  { key: "name", label: "Product" },
  { key: "category", label: "Category", render: categoryOf },
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
    key: "value",
    label: "Stock value",
    align: "right",
    sortValue: stockValue,
    render: (row) => formatCurrency(stockValue(row)),
  },
  {
    key: "stock",
    label: "Stock",
    sortValue: (row) => Number(row.quantity),
    render: (row) => <StockBadge quantity={row.quantity} />,
  },
];

const exportColumns = [
  { label: "ID", value: (p) => p.id },
  { label: "Product", value: (p) => p.name },
  { label: "Category", value: categoryOf },
  { label: "Price", value: (p) => Number(p.price) || 0 },
  { label: "Quantity", value: (p) => Number(p.quantity) || 0 },
  { label: "Stock value", value: (p) => Number(stockValue(p).toFixed(2)) },
  { label: "Stock", value: (p) => STOCK_LEVELS[getStockLevel(p.quantity)].label },
];

const STOCK_OPTIONS = [
  { value: "all", label: "All stock levels" },
  ...Object.entries(STOCK_LEVELS).map(([value, level]) => ({ value, label: level.label })),
];

const CHART_METRICS = {
  value: { label: "Value", get: stockValue, format: formatCurrency },
  units: { label: "Units", get: (p) => Number(p.quantity) || 0, format: formatNumber },
  count: { label: "Products", get: () => 1, format: formatNumber },
};

const CHART_OPTIONS = Object.entries(CHART_METRICS).map(([value, metric]) => ({
  value,
  label: metric.label,
}));

export default function ProductDashboard() {
  const { products, loading, error, lastUpdated, refetch } = useProducts();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [stock, setStock] = useState("all");
  const [metric, setMetric] = useState("value");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const categoryOptions = useMemo(() => {
    const names = [...new Set(products.map(categoryOf))].sort();
    return [
      { value: "all", label: "All categories" },
      ...names.map((name) => ({ value: name, label: name })),
    ];
  }, [products]);

  // Search and stock filters apply everywhere. The category filter is left out
  // of the chart so the selected category is still shown next to the others.
  const searchedProducts = useMemo(() => {
    const term = search.trim().toLowerCase();
    return products.filter((p) => {
      const matchesStock = stock === "all" || getStockLevel(p.quantity) === stock;
      const matchesSearch = !term || p.name?.toLowerCase().includes(term);
      return matchesStock && matchesSearch;
    });
  }, [products, search, stock]);

  const filteredProducts = useMemo(
    () =>
      category === "all"
        ? searchedProducts
        : searchedProducts.filter((p) => categoryOf(p) === category),
    [searchedProducts, category]
  );

  const stats = useMemo(() => {
    const levels = { in: 0, low: 0, out: 0 };
    filteredProducts.forEach((p) => {
      levels[getStockLevel(p.quantity)] += 1;
    });

    return {
      levels,
      totalUnits: filteredProducts.reduce((sum, p) => sum + (Number(p.quantity) || 0), 0),
      inventoryValue: filteredProducts.reduce((sum, p) => sum + stockValue(p), 0),
    };
  }, [filteredProducts]);

  const chartItems = useMemo(() => {
    const { get } = CHART_METRICS[metric];
    const totals = {};
    searchedProducts.forEach((p) => {
      const name = categoryOf(p);
      totals[name] = (totals[name] || 0) + get(p);
    });
    return Object.entries(totals)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value);
  }, [searchedProducts, metric]);

  const stockSegments = Object.entries(STOCK_LEVELS).map(([key, level]) => ({
    key,
    label: level.label,
    color: level.color,
    value: stats.levels[key],
  }));

  const hasFilters = search !== "" || category !== "all" || stock !== "all";

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setStock("all");
  };

  const toggleCategory = (label) => {
    setCategory((current) => (current === label ? "all" : label));
  };

  const closeDetails = useCallback(() => setSelectedProduct(null), []);

  const exportProducts = () => {
    const date = new Date().toISOString().slice(0, 10);
    downloadCsv(`products-${date}.csv`, exportColumns, filteredProducts);
  };

  if (loading && !lastUpdated) {
    return (
      <div className="product-dashboard">
        <DashboardSkeleton />
      </div>
    );
  }

  if (error && !lastUpdated) {
    return (
      <div className="product-dashboard">
        <StatusMessage type="error" message={error} onRetry={refetch} />
      </div>
    );
  }

  const averagePrice = stats.totalUnits ? stats.inventoryValue / stats.totalUnits : 0;
  const attentionCount = stats.levels.low + stats.levels.out;

  return (
    <div className="product-dashboard">
      <header className="product-dashboard-header">
        <div>
          <h1 className="product-dashboard-title">Product Dashboard</h1>
          <p className="product-dashboard-subtitle">
            Updated {lastUpdated.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
          </p>
        </div>
        <button
          type="button"
          className="filter-control filter-button"
          onClick={refetch}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </header>

      {error && <StatusMessage type="error" message={error} onRetry={refetch} />}

      <div className="product-dashboard-filters">
        <SearchInput value={search} onChange={setSearch} placeholder="Search products" />
        <SelectFilter
          label="Filter by category"
          value={category}
          onChange={setCategory}
          options={categoryOptions}
        />
        <SelectFilter
          label="Filter by stock level"
          value={stock}
          onChange={setStock}
          options={STOCK_OPTIONS}
        />
        {hasFilters && (
          <button type="button" className="filter-control filter-button" onClick={clearFilters}>
            Clear filters
          </button>
        )}
      </div>

      <div className="product-dashboard-stats">
        <StatCard
          label="Products"
          value={formatNumber(filteredProducts.length)}
          hint={hasFilters ? `of ${formatNumber(products.length)} total` : "All products"}
        />
        <StatCard label="Units in stock" value={formatNumber(stats.totalUnits)} />
        <StatCard
          label="Inventory value"
          value={formatCurrency(stats.inventoryValue)}
          hint={`Avg ${formatCurrency(averagePrice)} per unit`}
        />
        <StatCard
          label="Needs restock"
          value={formatNumber(attentionCount)}
          hint={`Fewer than ${LOW_STOCK_THRESHOLD} units`}
        />
      </div>

      <div className="product-dashboard-charts">
        <Panel
          title="By category"
          actions={
            <SegmentedControl
              label="Chart metric"
              options={CHART_OPTIONS}
              value={metric}
              onChange={setMetric}
            />
          }
        >
          <BarList
            items={chartItems}
            formatValue={CHART_METRICS[metric].format}
            onSelect={toggleCategory}
            activeLabel={category}
          />
          <p className="product-dashboard-hint">Click a category to filter the products.</p>
        </Panel>

        <Panel title="Stock levels">
          <StackedBar segments={stockSegments} formatValue={formatNumber} />
        </Panel>
      </div>

      <Panel
        title="Products"
        actions={
          <button
            type="button"
            className="filter-control filter-button"
            onClick={exportProducts}
            disabled={filteredProducts.length === 0}
          >
            Export CSV
          </button>
        }
      >
        <DataTable
          columns={columns}
          rows={filteredProducts}
          pageSize={PAGE_SIZE}
          onRowClick={setSelectedProduct}
          emptyMessage="No products match your filters."
        />
      </Panel>

      {selectedProduct && (
        <Modal title={selectedProduct.name} onClose={closeDetails}>
          <ProductDetails product={selectedProduct} />
        </Modal>
      )}
    </div>
  );
}
