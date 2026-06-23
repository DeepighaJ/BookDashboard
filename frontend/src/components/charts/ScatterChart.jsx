/**
 * components/charts/ScatterChart.jsx — price vs rating scatter plot
 */

import Plot from "react-plotly.js";
import "../../styles/charts.css";

export default function ScatterChart({ books }) {
  // Group by category for colour coding
  const byCategory = {};
  books.forEach((b) => {
    if (!byCategory[b.category]) byCategory[b.category] = [];
    byCategory[b.category].push(b);
  });

  const traces = Object.entries(byCategory).map(([cat, items]) => ({
    x: items.map((b) => b.price),
    y: items.map((b) => b.rating),
    text: items.map((b) => b.title),
    customdata: items.map((b) => b.stock_count),
    name: cat,
    mode: "markers",
    type: "scatter",
    marker: { size: 8, opacity: 0.75 },
    hovertemplate:
      "<b>%{text}</b><br>Price: £%{x:.2f}<br>Rating: %{y}★<br>Stock: %{customdata}<extra></extra>",
  }));

  return (
    <div className="chart-card">
      <h3 className="chart-title">Price vs rating</h3>
      <Plot
        data={traces}
        layout={{
          margin: { t: 10, b: 50, l: 50, r: 10 },
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
          xaxis: { title: "Price (£)", gridcolor: "#f0f0f5" },
          yaxis: { title: "Rating (★)", gridcolor: "#f0f0f5", dtick: 1 },
          showlegend: true,
          legend: { orientation: "h", y: -0.25 },
        }}
        config={{ displayModeBar: false }}
        style={{ width: "100%", height: 360 }}
      />
    </div>
  );
}
