/**
 * components/charts/CategoryChart.jsx — books per category horizontal bar
 */

import Plot from "react-plotly.js";
import "../../styles/charts.css";

export default function CategoryChart({ books }) {
  const counts = {};
  books.forEach((b) => { if (b.category) counts[b.category] = (counts[b.category] || 0) + 1; });
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 15);

  return (
    <div className="chart-card">
      <h3 className="chart-title">Books per category</h3>
      <Plot
        data={[
          {
            x: sorted.map((e) => e[1]),
            y: sorted.map((e) => e[0]),
            type: "bar",
            orientation: "h",
            marker: { color: sorted.map((_, i) => `hsl(243,${60 + i * 2}%,${72 - i * 2}%)`), },
            hovertemplate: "<b>%{y}</b><br>%{x} books<extra></extra>",
          },
        ]}
        layout={{
          margin: { t: 10, b: 40, l: 130, r: 10 },
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
          xaxis: { gridcolor: "#f0f0f5" },
          yaxis: { autorange: "reversed", showgrid: false },
          showlegend: false,
          height: 380,
        }}
        config={{ displayModeBar: false }}
        style={{ width: "100%", height: 380 }}
      />
    </div>
  );
}
