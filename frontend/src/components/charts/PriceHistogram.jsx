/**
 * components/charts/PriceHistogram.jsx
 *
 * Plotly histogram of book prices.
 * Each chart lives in its own file — easy to swap the chart type
 * or styling without touching other charts.
 */

import Plot from "react-plotly.js";
import "../../styles/charts.css";

export default function PriceHistogram({ books }) {
  const prices = books.map((b) => b.price).filter(Boolean);

  return (
    <div className="chart-card">
      <h3 className="chart-title">Price distribution</h3>
      <Plot
        data={[
          {
            x: prices,
            type: "histogram",
            nbinsx: 30,
            marker: { color: "#6366f1", opacity: 0.85 },
            hovertemplate: "£%{x:.2f}<br>%{y} books<extra></extra>",
          },
        ]}
        layout={{
          margin: { t: 10, b: 40, l: 40, r: 10 },
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
          xaxis: { title: "Price (£)", showgrid: false },
          yaxis: { title: "Books", gridcolor: "#f0f0f5" },
          bargap: 0.05,
          showlegend: false,
        }}
        config={{ displayModeBar: false }}
        style={{ width: "100%", height: 260 }}
      />
    </div>
  );
}
