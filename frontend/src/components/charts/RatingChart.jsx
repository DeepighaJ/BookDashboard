/**
 * components/charts/RatingChart.jsx — star rating bar chart
 */

import Plot from "react-plotly.js";
import "../../styles/charts.css";

const COLORS = { 1: "#f87171", 2: "#fb923c", 3: "#facc15", 4: "#4ade80", 5: "#34d399" };

export default function RatingChart({ books }) {
  const counts = [1, 2, 3, 4, 5].map((r) => books.filter((b) => b.rating === r).length);

  return (
    <div className="chart-card">
      <h3 className="chart-title">Rating breakdown</h3>
      <Plot
        data={[
          {
            x: ["1★", "2★", "3★", "4★", "5★"],
            y: counts,
            type: "bar",
            marker: { color: [COLORS[1], COLORS[2], COLORS[3], COLORS[4], COLORS[5]] },
            hovertemplate: "%{x}<br>%{y} books<extra></extra>",
          },
        ]}
        layout={{
          margin: { t: 10, b: 40, l: 40, r: 10 },
          paper_bgcolor: "transparent",
          plot_bgcolor: "transparent",
          xaxis: { showgrid: false },
          yaxis: { gridcolor: "#f0f0f5" },
          showlegend: false,
        }}
        config={{ displayModeBar: false }}
        style={{ width: "100%", height: 260 }}
      />
    </div>
  );
}
