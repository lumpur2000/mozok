// KPI grid (2×2) with live-animating numbers + Brain insight block

function useAnimatedNumber(target, duration = 700) {
  const [val, setVal] = React.useState(target);
  const fromRef = React.useRef(target);
  const startRef = React.useRef(performance.now());
  React.useEffect(() => {
    fromRef.current = val;
    startRef.current = performance.now();
    let raf;
    const tick = (now) => {
      const k = Math.min(1, (now - startRef.current) / duration);
      const e = 1 - Math.pow(1 - k, 3);
      setVal(fromRef.current + (target - fromRef.current) * e);
      if (k < 1) raf = requestAnimationFrame(tick);
      else setVal(target);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return val;
}

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
        return <div key={i} style={{ width: 12, height: on ? 34 + (i % 3) * 4 : 14, borderRadius: 3, background: on ? 'var(--navy)' : '#E0DED6', transition: 'height .4s, background .4s' }} />;
      })}
    </div>
  );
}

function BigKpi({ label, value, unit, trend, trendUp, sub, extra, pulse }) {
  return (
    <div className="kpi-card" style={{ ...lvStyles.kpi, ...(pulse ? lvStyles.kpiPulse : {}) }}>
      <div className="kpi-label" style={lvStyles.kpiLabel}>{label}</div>
      <div style={lvStyles.kpiValueRow}>
        <div className="kpi-value" style={lvStyles.kpiValue}>{value}</div>
        {unit && <div style={lvStyles.kpiUnit}>{unit}</div>}
      </div>
      <div style={lvStyles.kpiFoot}>
        <div className="kpi-extra" style={lvStyles.kpiExtra}>{extra}</div>
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
  const { t, currency, money, num, sym } = useI18n();

  // Live-moving raw values (UAH for money)
  const [revenue, setRevenue] = React.useState(14820);
  const [orders, setOrders] = React.useState(47);
  const [check, setCheck] = React.useState(315);
  const [tables, setTables] = React.useState(8);
  const [pulseKey, setPulseKey] = React.useState(0);

  // Sparkline history
  const [revHist, setRevHist] = React.useState([5,6,5,7,8,9,8,10,12,11,13,14.8]);
  const [ordHist, setOrdHist] = React.useState([2,3,3,4,4,5,5,6,5,6,6,7]);
  const [chkHist, setChkHist] = React.useState([310,322,318,330,345,328,340,325,318,322,315,315]);

  React.useEffect(() => {
    const revT = setInterval(() => {
      const bump = 20 + Math.floor(Math.random() * 180); // small revenue bump
      setRevenue(r => {
        const next = r + bump;
        setRevHist(h => [...h.slice(1), next / 1000]);
        return next;
      });
      setPulseKey(k => k + 1);
    }, 3200 + Math.random() * 900);

    const ordT = setInterval(() => {
      if (Math.random() > 0.55) {
        setOrders(o => {
          const next = o + 1;
          setOrdHist(h => [...h.slice(1), next / 7]);
          return next;
        });
      }
    }, 4500);

    const chkT = setInterval(() => {
      setCheck(c => {
        const jitter = Math.round((Math.random() - 0.5) * 10);
        const next = Math.max(290, Math.min(345, c + jitter));
        setChkHist(h => [...h.slice(1), next]);
        return next;
      });
    }, 4200);

    const tblT = setInterval(() => {
      setTables(n => {
        const d = Math.random() < 0.5 ? -1 : 1;
        return Math.max(5, Math.min(12, n + d));
      });
    }, 5500);

    return () => { clearInterval(revT); clearInterval(ordT); clearInterval(chkT); clearInterval(tblT); };
  }, []);

  const animRev = useAnimatedNumber(revenue, 900);
  const animOrd = useAnimatedNumber(orders, 500);
  const animChk = useAnimatedNumber(check, 800);
  const animTbl = useAnimatedNumber(tables, 600);

  return (
    <div className="kpi-grid" style={lvStyles.kpiGrid}>
      <BigKpi
        label={t.kpi_revenue}
        value={money(animRev)}
        trend="+12%" trendUp={true}
        sub={t.kpi_vs}
        extra={<BigSparkline data={revHist} width={150} />}
        pulse={pulseKey}
      />
      <BigKpi
        label={t.kpi_orders}
        value={num(Math.round(animOrd))}
        trend="+6" trendUp={true}
        sub={t.kpi_orders_sub}
        extra={<BigSparkline data={ordHist} color="#3D7FD1" width={150} />}
      />
      <BigKpi
        label={t.kpi_check}
        value={money(animChk)}
        trend={check < 315 ? '-₴' + (315 - check) : '+₴' + (check - 315)}
        trendUp={check >= 315}
        sub={`${t.kpi_check_goal} ${money(340)}`}
        extra={<BigSparkline data={chkHist} color="#7B61E3" width={150} />}
      />
      <BigKpi
        label={t.kpi_tables}
        value={`${num(Math.round(animTbl))} / ${num(12)}`}
        sub={t.kpi_wait}
        extra={<BigTables occupied={Math.round(animTbl)} total={12} />}
      />
    </div>
  );
}

function BrainInsightBlock() {
  const { t } = useI18n();
  return (
    <div style={lvStyles.insight}>
      <div style={lvStyles.insightHead}>
        <span style={lvStyles.brainDot}>
          <svg width="13" height="13" viewBox="0 0 32 32" fill="none">
            <defs>
              <linearGradient id="kpiBG" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#6DE3A9"/><stop offset="1" stopColor="#2ECC71"/>
              </linearGradient>
            </defs>
            <path d="M14 5c-2.5 0-4.3 1.6-4.6 3.6C7.4 9 6 10.5 6 12.4c0 1 .4 1.9 1 2.6-.9.7-1.5 1.8-1.5 3 0 1.8 1.2 3.3 2.8 3.7.3 2 2.1 3.5 4.2 3.5 1 0 2-.3 2.7-.9V5.4c-.3 0-.6 0-1-.4z" fill="url(#kpiBG)" opacity=".9"/>
            <path d="M18 5c2.5 0 4.3 1.6 4.6 3.6 2 .4 3.4 1.9 3.4 3.8 0 1-.4 1.9-1 2.6.9.7 1.5 1.8 1.5 3 0 1.8-1.2 3.3-2.8 3.7-.3 2-2.1 3.5-4.2 3.5-1 0-2-.3-2.7-.9V5.4c.3 0 .6 0 1-.4z" fill="url(#kpiBG)"/>
          </svg>
        </span>
        <div style={lvStyles.insightTitle}>{t.dash_insight}</div>
        <span style={lvStyles.insightLive}>
          <span style={{ width: 5, height: 5, borderRadius: 99, background: '#2ECC71', animation: 'pulseDot 1.8s infinite', display: 'inline-block' }} />
          live
        </span>
      </div>
      <div style={lvStyles.insightBody}>{t.dash_insight_body}</div>
    </div>
  );
}

const lvStyles = {
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridTemplateRows: 'repeat(2, 1fr)', gap: 14, minHeight: 0 },
  kpi: { background: 'var(--card)', border: '1px solid var(--hairline)', borderRadius: 14, padding: '18px 22px 16px', boxShadow: '0 1px 2px rgba(14,27,44,.03)', display: 'flex', flexDirection: 'column', gap: 10, minWidth: 0, transition: 'box-shadow .25s' },
  kpiPulse: {},
  kpiLabel: { fontSize: 11.5, color: 'var(--ink-3)', fontWeight: 500, letterSpacing: .3, textTransform: 'uppercase' },
  kpiValueRow: { display: 'flex', alignItems: 'baseline', gap: 6 },
  kpiValue: { fontSize: 40, fontWeight: 600, letterSpacing: -1.2, color: 'var(--ink)', lineHeight: 1, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' },
  kpiUnit: { fontSize: 15, fontWeight: 500, color: 'var(--ink-3)', letterSpacing: -.2 },
  kpiFoot: { display: 'flex', alignItems: 'center', gap: 10, marginTop: 'auto', flexWrap: 'wrap' },
  kpiExtra: { marginRight: 'auto' },
  kpiTrend: { display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: 12, fontWeight: 600, fontFamily: 'JetBrains Mono, monospace', padding: '3px 7px', borderRadius: 5, whiteSpace: 'nowrap' },
  kpiSub: { fontSize: 11.5, color: 'var(--ink-3)' },

  insight: {
    position: 'relative',
    background: 'linear-gradient(#FBFAF7,#FBFAF7) padding-box, linear-gradient(135deg,#6DE3A9,#3D7FD1) border-box',
    border: '1px solid transparent',
    borderRadius: 14,
    padding: '16px 20px',
    display: 'flex', flexDirection: 'column', gap: 8,
  },
  insightHead: { display: 'flex', alignItems: 'center', gap: 10 },
  brainDot: { width: 26, height: 26, borderRadius: 8, background: 'var(--green-soft)', border: '1px solid #D6EFE0', display: 'grid', placeItems: 'center' },
  insightTitle: { fontSize: 13, fontWeight: 600, color: 'var(--ink)' },
  insightLive: { marginLeft: 'auto', fontSize: 10.5, color: 'var(--green-deep)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: .4, display: 'inline-flex', alignItems: 'center', gap: 5 },
  insightBody: { fontSize: 13, lineHeight: 1.55, color: 'var(--ink-2)', fontStyle: 'italic' },
};

Object.assign(window, { BigKpiRow, BrainInsightBlock });
