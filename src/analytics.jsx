// Analytics page — Brain-generated custom card at top (when requested via chat) + standard dashboards grid.
// Reuses chart primitives from dashboard-view.jsx (HourlyChart, CategorySplit, TopDishes, MiniSparkline).

function AnalyticsPage({ brainCard, onClearBrain }) {
  const { t } = useI18n();
  const isEn = t === DICT.en;

  // Standard dashboards grid — reuse primitives
  return (
    <div style={anStyles.page}>
      <PageHead title={t.a_title} sub={t.a_sub} />
      <div style={anStyles.scroll}>
        {brainCard && (
          <BrainGeneratedCard data={brainCard} onClear={onClearBrain} />
        )}
        <div style={anStyles.grid}>
          <div style={{ gridColumn: 'span 8' }}>
            <StandardReportWrap title={t.a_rev_hour} sub={isEn ? 'today · hourly buckets' : 'сьогодні · по годинах'}>
              <HourlyChart />
            </StandardReportWrap>
          </div>
          <div style={{ gridColumn: 'span 4' }}>
            <StandardReportWrap title={isEn ? 'By category' : 'За категоріями'} sub={isEn ? 'margin split' : 'розподіл маржі'}>
              <CategorySplit />
            </StandardReportWrap>
          </div>
          <div style={{ gridColumn: 'span 12' }}>
            <StandardReportWrap title={t.a_top_margin} sub={isEn ? 'last 7 days trend' : 'тренд за 7 днів'}>
              <TopDishes />
            </StandardReportWrap>
          </div>
          <div style={{ gridColumn: 'span 6' }}>
            <StandardReportWrap title={t.a_check_dyn} sub={isEn ? '30-day trend' : 'тренд 30 днів'}>
              <CheckDynamics />
            </StandardReportWrap>
          </div>
          <div style={{ gridColumn: 'span 6' }}>
            <StandardReportWrap title={t.a_kitchen_speed} sub={isEn ? 'avg time to plate' : 'середній час приготування'}>
              <KitchenSpeed />
            </StandardReportWrap>
          </div>
          <div style={{ gridColumn: 'span 12' }}>
            <StandardReportWrap title={t.a_turnover} sub={isEn ? 'how many guests pass each table per day' : 'скільки гостей проходить через кожен столик за день'}>
              <TurnoverHeatmap />
            </StandardReportWrap>
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrapper: since StandardReportWrap's children already contain their own header (dvStyles.chartHead),
// we just render the child directly — the chart primitives carry their title.
function StandardReportWrap({ children }) {
  return children;
}

function BrainGeneratedCard({ data, onClear }) {
  const { t } = useI18n();
  const isEn = t === DICT.en;
  return (
    <div style={anStyles.brainCard}>
      <div style={anStyles.brainBadgeRow}>
        <span style={anStyles.brainBadge}>
          <svg width="12" height="12" viewBox="0 0 32 32" fill="none">
            <defs>
              <linearGradient id="bgCG" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#6DE3A9"/><stop offset="1" stopColor="#2ECC71"/>
              </linearGradient>
            </defs>
            <path d="M14 5c-2.5 0-4.3 1.6-4.6 3.6C7.4 9 6 10.5 6 12.4c0 1 .4 1.9 1 2.6-.9.7-1.5 1.8-1.5 3 0 1.8 1.2 3.3 2.8 3.7.3 2 2.1 3.5 4.2 3.5 1 0 2-.3 2.7-.9V5.4c-.3 0-.6 0-1-.4z" fill="url(#bgCG)" opacity=".9"/>
            <path d="M18 5c2.5 0 4.3 1.6 4.6 3.6 2 .4 3.4 1.9 3.4 3.8 0 1-.4 1.9-1 2.6.9.7 1.5 1.8 1.5 3 0 1.8-1.2 3.3-2.8 3.7-.3 2-2.1 3.5-4.2 3.5-1 0-2-.3-2.7-.9V5.4c.3 0 .6 0 1-.4z" fill="url(#bgCG)"/>
          </svg>
          {t.a_ai_label}
        </span>
        <span style={anStyles.brainQuery}>«{data.query}»</span>
        <button style={anStyles.brainClose} onClick={onClear} title="×">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>
        </button>
      </div>
      <div style={anStyles.brainBody}>
        {data.kind === 'day' && <><DaySummary /><div style={{ height: 12 }} /><Highlights /></>}
        {data.kind === 'recs' && <Recommendations />}
        {data.kind === 'revenue' && <><HourlyChart /><div style={{ height: 12 }} /><CategorySplit /></>}
        {data.kind === 'compare' && (
          <CompareRow rows={[
            { label: isEn ? 'Revenue' : 'Виручка',    a: '₴14 820', b: '₴13 240', delta: '+12%', up: true },
            { label: isEn ? 'Orders' : 'Замовлень',  a: '47',      b: '41',      delta: '+6',   up: true },
            { label: isEn ? 'Avg check' : 'Сер. чек', a: '₴315',  b: '₴323',    delta: '-₴8',  up: false },
            { label: isEn ? 'Tables' : 'Столики',    a: '8/12',    b: '6/12',    delta: '+2',   up: true },
          ]} />
        )}
        {data.kind === 'top' && <TopDishes />}
        {data.kind === 'problems' && <ProblemsList />}
        {data.kind === 'staff' && <StaffList />}
      </div>
    </div>
  );
}

// Simple line chart for avg check dynamics
function CheckDynamics() {
  const { t, moneyPlain } = useI18n();
  const isEn = t === DICT.en;
  const data = [295, 302, 298, 310, 305, 315, 308, 312, 318, 322, 315, 320, 318, 312, 325, 322, 318, 330, 335, 328, 332, 325, 318, 322, 328, 335, 342, 338, 330, 323];
  const max = Math.max(...data), min = Math.min(...data);
  const W = 560, H = 140;
  const step = W / (data.length - 1);
  const range = max - min || 1;
  const pts = data.map((v, i) => [i * step, H - ((v - min) / range) * (H - 16) - 8]);
  const d = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  const avg = Math.round(data.reduce((s, v) => s + v, 0) / data.length);
  return (
    <div style={dvStyles.chart}>
      <div style={dvStyles.chartHead}>
        <div style={dvStyles.chartTitle}>{t.a_check_dyn}</div>
        <div style={dvStyles.chartSub}>{isEn ? 'avg' : 'середнє'} ₴{avg}</div>
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: 'block', height: 140 }}>
        <defs>
          <linearGradient id="cdGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2ECC71" stopOpacity=".22"/>
            <stop offset="1" stopColor="#2ECC71" stopOpacity="0"/>
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map(f => (
          <line key={f} x1="0" x2={W} y1={H * f} y2={H * f} stroke="#EFEDE6" strokeWidth="1" />
        ))}
        <path d={d + ` L${W},${H} L0,${H} Z`} fill="url(#cdGrad)" />
        <path d={d} fill="none" stroke="#1FA85B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {pts.filter((_, i) => i === pts.length - 1).map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r="4" fill="#fff" stroke="#1FA85B" strokeWidth="2" />
        ))}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: 'var(--ink-3)', fontFamily: 'JetBrains Mono, monospace', marginTop: -6 }}>
        <span>-30d</span><span>-20d</span><span>-10d</span><span>{isEn ? 'today' : 'сьогодні'}</span>
      </div>
    </div>
  );
}

// Kitchen speed — horizontal bars per category
function KitchenSpeed() {
  const { t } = useI18n();
  const isEn = t === DICT.en;
  const rows = isEn ? [
    { cat: 'Cold starters', cur: 4.2, goal: 5, unit: 'min' },
    { cat: 'Soups',         cur: 6.5, goal: 7, unit: 'min' },
    { cat: 'Hot dishes',    cur: 12.8, goal: 12, unit: 'min', over: true },
    { cat: 'Grill',         cur: 18.2, goal: 18, unit: 'min' },
    { cat: 'Desserts',      cur: 3.8, goal: 5, unit: 'min' },
  ] : [
    { cat: 'Холодні закуски', cur: 4.2, goal: 5, unit: 'хв' },
    { cat: 'Супи',             cur: 6.5, goal: 7, unit: 'хв' },
    { cat: 'Гарячі страви',    cur: 12.8, goal: 12, unit: 'хв', over: true },
    { cat: 'Гриль',            cur: 18.2, goal: 18, unit: 'хв' },
    { cat: 'Десерти',          cur: 3.8, goal: 5, unit: 'хв' },
  ];
  const max = Math.max(...rows.map(r => Math.max(r.cur, r.goal))) * 1.1;
  return (
    <div style={dvStyles.chart}>
      <div style={dvStyles.chartHead}>
        <div style={dvStyles.chartTitle}>{t.a_kitchen_speed}</div>
        <div style={dvStyles.chartSub}>{isEn ? 'last 7 days avg' : 'середнє за 7 днів'}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {rows.map((r, i) => (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--ink-2)', marginBottom: 5 }}>
              <span>{r.cat}</span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', color: r.over ? 'var(--red)' : 'var(--ink-2)', fontWeight: 600 }}>
                {r.cur} {r.unit}
                <span style={{ color: 'var(--ink-4)', marginLeft: 6, fontWeight: 400 }}>/ {r.goal}</span>
              </span>
            </div>
            <div style={{ position: 'relative', height: 8, background: '#F3F1EA', borderRadius: 4 }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: (r.cur / max * 100) + '%', background: r.over ? 'var(--red)' : 'linear-gradient(90deg,#2ECC71,#1FA85B)', borderRadius: 4, transition: 'width .4s' }} />
              <div style={{ position: 'absolute', left: (r.goal / max * 100) + '%', top: -2, bottom: -2, width: 1, background: 'var(--ink-3)', opacity: .5 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Turnover heatmap — tables × hours
function TurnoverHeatmap() {
  const { t } = useI18n();
  const isEn = t === DICT.en;
  const tables = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const hours = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
  // Fake data — each cell 0..4 turns
  const seed = (x, y) => ((x * 7 + y * 13) % 10) / 10;
  const getVal = (ti, hi) => {
    const base = hi >= 2 && hi <= 4 ? 0.6 : hi >= 8 && hi <= 10 ? 0.8 : 0.25;
    return Math.max(0, Math.min(1, base + seed(ti, hi) * 0.5 - 0.25));
  };
  return (
    <div style={dvStyles.chart}>
      <div style={dvStyles.chartHead}>
        <div style={dvStyles.chartTitle}>{t.a_turnover}</div>
        <div style={dvStyles.chartSub}>{isEn ? 'avg turns per hour (0 → 1)' : 'середня завантаженість (0 → 1)'}</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '60px repeat(' + hours.length + ', 1fr)', gap: 3, fontSize: 10.5 }}>
        <div />
        {hours.map(h => <div key={h} style={{ textAlign: 'center', color: 'var(--ink-3)', fontFamily: 'JetBrains Mono, monospace' }}>{h}</div>)}
        {tables.map((tbl, ti) => (
          <React.Fragment key={tbl}>
            <div style={{ color: 'var(--ink-3)', fontSize: 11, paddingRight: 8, textAlign: 'right' }}>{isEn ? 'T' : 'Ст.'} {tbl}</div>
            {hours.map((_, hi) => {
              const v = getVal(ti, hi);
              return (
                <div key={hi} style={{
                  height: 20, borderRadius: 3,
                  background: `rgba(46,204,113,${0.08 + v * 0.8})`,
                  border: v > 0.7 ? '1px solid #2ECC71' : 'none',
                }} title={`${(v * 4).toFixed(1)} ${isEn ? 'turns' : 'обертань'}`} />
              );
            })}
          </React.Fragment>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2, fontSize: 11, color: 'var(--ink-3)' }}>
        <span>{isEn ? 'low' : 'мало'}</span>
        <div style={{ flex: 1, height: 8, borderRadius: 4, background: 'linear-gradient(90deg, rgba(46,204,113,.08), rgba(46,204,113,.88))' }} />
        <span>{isEn ? 'high' : 'багато'}</span>
      </div>
    </div>
  );
}

const anStyles = {
  page: { display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, gap: 16, animation: 'fadeIn .25s ease-out' },
  scroll: { flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: 2, paddingBottom: 4 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 14, paddingBottom: 20 },
  brainCard: {
    position: 'relative',
    border: '1px solid transparent',
    borderRadius: 16,
    background: 'linear-gradient(#FBFAF7,#FBFAF7) padding-box, linear-gradient(135deg,#6DE3A9,#2ECC71,#3D7FD1) border-box',
    padding: 18,
    marginBottom: 16,
    boxShadow: '0 6px 20px rgba(46,204,113,.08)',
  },
  brainBadgeRow: {
    display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12,
  },
  brainBadge: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    fontSize: 11, fontWeight: 700, color: 'var(--green-deep)',
    textTransform: 'uppercase', letterSpacing: .5,
    background: 'var(--green-soft)', padding: '4px 10px', borderRadius: 99,
  },
  brainQuery: { fontSize: 12, color: 'var(--ink-3)', fontStyle: 'italic' },
  brainClose: {
    marginLeft: 'auto', width: 24, height: 24, borderRadius: 6,
    border: '1px solid var(--hairline)', background: '#fff',
    color: 'var(--ink-3)', cursor: 'pointer', display: 'grid', placeItems: 'center',
  },
  brainBody: { display: 'flex', flexDirection: 'column' },
};

Object.assign(window, { AnalyticsPage });
