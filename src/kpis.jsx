// KPI row — i18n + currency aware, no currency symbol in values

function BigSparkline({ data, color = '#2ECC71', width = 180, height = 48 }) {
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  const pts = data.map((v, i) => [i * step, height - ((v - min) / range) * (height - 6) - 3]);
  const d = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  const area = d + ` L${width},${height} L0,${height} Z`;
  const last = pts[pts.length - 1];
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <path d={area} fill={color} opacity=".1" />
      <path d={d} fill="none" stroke={color} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="3" fill={color} />
      <circle cx={last[0]} cy={last[1]} r="7" fill={color} opacity=".2" />
    </svg>
  );
}

function BigTables({ occupied, total }) {
  return (
    <div style={{ display: 'flex', gap: 5, alignItems: 'flex-end', height: 48 }}>
      {Array.from({ length: total }).map((_, i) => {
        const on = i < occupied;
        return <div key={i} style={{ width: 12, height: on ? 34 + (i % 3) * 4 : 14, borderRadius: 3, background: on ? 'var(--navy)' : '#E0DED6' }} />;
      })}
    </div>
  );
}

function BigKpi({ label, value, unit, trend, trendUp, sub, extra }) {
  return (
    <div style={lvStyles.kpi}>
      <div style={lvStyles.kpiLabel}>{label}</div>
      <div style={lvStyles.kpiValueRow}>
        <div style={lvStyles.kpiValue}>{value}</div>
        {unit && <div style={lvStyles.kpiUnit}>{unit}</div>}
      </div>
      <div style={lvStyles.kpiFoot}>
        <div style={lvStyles.kpiExtra}>{extra}</div>
        {trend && (
          <div style={{ ...lvStyles.kpiTrend, color: trendUp ? 'var(--green-deep)' : 'var(--red)', background: trendUp ? 'rgba(46,204,113,.08)' : 'rgba(232,80,76,.08)' }}>
            {trendUp ? <Icons.ArrowUp size={12} /> : <Icons.ArrowDown size={12} />}
            <span>{trend}</span>
          </div>
        )}
        <div style={lvStyles.kpiSub}>{sub}</div>
      </div>
    </div>
  );
}

function BigKpiRow() {
  const { t, currency, money, moneyK, num, sym } = useI18n();
  return (
    <div style={lvStyles.kpiRow}>
      <BigKpi
        label={t.kpi_revenue}
        value={money(14820)}
        trend="+12%" trendUp={true}
        sub={t.kpi_vs}
        extra={<BigSparkline data={[5,6,5,7,8,9,8,10,12,11,13,14.8]} />}
      />
      <BigKpi
        label={t.kpi_orders}
        value={num(47)}
        trend="+6" trendUp={true}
        sub={t.kpi_orders_sub}
        extra={<BigSparkline data={[2,3,3,4,4,5,5,6,5,6,6,7]} color="#3D7FD1" />}
      />
      <BigKpi
        label={t.kpi_check}
        value={money(315)}
        trend={currency === 'USD' ? '-$0.45' : '-₴18'} trendUp={false}
        sub={`${t.kpi_check_goal} ${money(340)}`}
        extra={<BigSparkline data={[310,322,318,330,345,328,340,325,318,322,315,315]} color="#7B61E3" />}
      />
      <BigKpi
        label={t.kpi_tables}
        value={`${num(8)} / ${num(12)}`}
        sub={t.kpi_wait}
        extra={<BigTables occupied={8} total={12} />}
      />
    </div>
  );
}

const lvStyles = {
  kpiRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 },
  kpi: { background: 'var(--card)', border: '1px solid var(--hairline)', borderRadius: 14, padding: '18px 22px 16px', boxShadow: '0 1px 2px rgba(14,27,44,.03)', display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0 },
  kpiLabel: { fontSize: 12, color: 'var(--ink-3)', fontWeight: 500, letterSpacing: .3, textTransform: 'uppercase' },
  kpiValueRow: { display: 'flex', alignItems: 'baseline', gap: 6 },
  kpiValue: { fontSize: 44, fontWeight: 600, letterSpacing: -1.2, color: 'var(--ink)', lineHeight: 1, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' },
  kpiUnit: { fontSize: 16, fontWeight: 500, color: 'var(--ink-3)', letterSpacing: -.2 },
  kpiFoot: { display: 'flex', alignItems: 'center', gap: 10, marginTop: 'auto', flexWrap: 'wrap' },
  kpiExtra: { marginRight: 'auto' },
  kpiTrend: { display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: 12, fontWeight: 600, fontFamily: 'JetBrains Mono, monospace', padding: '3px 7px', borderRadius: 5, whiteSpace: 'nowrap' },
  kpiSub: { fontSize: 11.5, color: 'var(--ink-3)' },
};

Object.assign(window, { BigKpiRow });
