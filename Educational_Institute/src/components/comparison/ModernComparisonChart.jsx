const clampPercent = (value, maxValue) => {
  if (!maxValue) return 0;
  return Math.max(4, Math.min(100, (value / maxValue) * 100));
};

const formatScore = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? Math.round(number * 10) / 10 : 0;
};

export default function ModernComparisonChart({ title = "Score comparison", metrics }) {
  const visibleMetrics = metrics.filter((metric) => metric.values.length > 0);

  return (
    <section className="modern-chart" aria-label={title}>
      <div className="modern-chart-head">
        <div>
          <span className="eyebrow">Results</span>
          <h2>{title}</h2>
        </div>
        <p>Each row compares the selected institutions on one scoring dimension.</p>
      </div>

      <div className="modern-chart-grid">
        {visibleMetrics.map((metric) => {
          const maxValue = Math.max(...metric.values.map((item) => formatScore(item.value)), 0);

          return (
            <article className="modern-metric" key={metric.label}>
              <div className="modern-metric-title">
                <h3>{metric.label}</h3>
                <span>{metric.help}</span>
              </div>
              <div className="modern-bars">
                {metric.values.map((item, index) => {
                  const score = formatScore(item.value);
                  return (
                    <div className="modern-bar-row" key={`${metric.label}-${item.name}`}>
                      <div className="modern-bar-meta">
                        <span>{index + 1}</span>
                        <strong>{item.name}</strong>
                        <em>{score}</em>
                      </div>
                      <div className="modern-bar-track">
                        <i style={{ width: `${clampPercent(score, maxValue)}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
