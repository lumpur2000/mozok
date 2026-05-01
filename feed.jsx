// Live event feed — compact single-line ticker with varied events

function FeedRow({ ev, fresh, kindMap, tagStop, tagUrgent }) {
  const kind = kindMap[ev.kind];
  const Icon = Icons[kind.icon];
  return (
    <div className="feed-row" style={{
      ...fStyles.row,
      borderLeftColor: kind.color,
      animation: fresh ? 'feedSlide .35s ease-out' : 'none',
      background: fresh ? kind.bg : 'transparent',
    }}>
      <span style={{ ...fStyles.rowIcon, background: kind.bg, color: kind.fg }}><Icon size={11} /></span>
      <span style={fStyles.rowTitle}>{ev.title}</span>
      {ev.tag && <span style={{ ...fStyles.pill, background: kind.bg, color: kind.fg }}>{ev.tag}</span>}
      {ev.urgent && <span style={fStyles.urgentPill}>{tagUrgent}</span>}
      {ev.amount && <span style={fStyles.amount}>{ev.amount}</span>}
      <span style={fStyles.time}>{ev.t}</span>
    </div>
  );
}

function LiveFeed() {
  const { t, money, currency } = useI18n();

  const kindMap = {
    order:   { color: 'var(--green)',      bg: 'var(--green-soft)',  fg: 'var(--green-deep)', icon: 'CircleCheck' },
    stop:    { color: 'var(--red)',        bg: 'var(--red-soft)',    fg: '#A93A37',           icon: 'Stop' },
    ready:   { color: 'var(--amber)',      bg: 'var(--amber-soft)',  fg: '#8C5A14',           icon: 'Ready' },
    kitchen: { color: 'var(--blue)',       bg: 'var(--blue-soft)',   fg: '#2A5FA3',           icon: 'Clock' },
    pay:     { color: 'var(--green-deep)', bg: 'var(--green-soft)',  fg: 'var(--green-deep)', icon: 'Card' },
    staff:   { color: '#6B7A8F',           bg: '#F0EEE7',            fg: '#3A4A5F',           icon: 'User' },
    brain:   { color: 'var(--violet)',     bg: 'var(--violet-soft)', fg: '#4F3DAC',           icon: 'Sparkle' },
  };

  const isEn = t === DICT.en;

  // Pool of varied event generators
  const generators = React.useMemo(() => [
    () => {
      const n = 54 + Math.floor(Math.random() * 30);
      const tbl = 1 + Math.floor(Math.random() * 12);
      const amt = 200 + Math.floor(Math.random() * 700);
      const o = t.ev.order_new(n, tbl, isEn ? 'Maryna' : 'Марина');
      return { kind: 'order', title: o.title, amount: `+${money(amt)}` };
    },
    () => ({
      kind: 'pay',
      title: isEn ? `Payment · table ${1 + Math.floor(Math.random()*12)}` : `Оплата · столик ${1 + Math.floor(Math.random()*12)}`,
      amount: `+${money(300 + Math.floor(Math.random()*600))}`,
    }),
    () => ({
      kind: 'kitchen',
      title: isEn ? `Kitchen picked up order #${60 + Math.floor(Math.random()*30)}` : `Кухня взяла в роботу #${60 + Math.floor(Math.random()*30)}`,
    }),
    () => ({
      kind: 'ready',
      title: isEn ? `Ready: ${['Tom Yum','Carbonara','Caesar','Burger'][Math.floor(Math.random()*4)]}` : `Готово: ${['Том Ям','Карбонара','Цезар','Бургер'][Math.floor(Math.random()*4)]}`,
      urgent: Math.random() > 0.7,
    }),
    () => ({
      kind: 'stop',
      title: isEn ? `Stop-list: ${['Salmon','Tiramisu','Cheesecake','Shrimp'][Math.floor(Math.random()*4)]}` : `Стоп-лист: ${['Лосось','Тірамісу','Чізкейк','Креветки'][Math.floor(Math.random()*4)]}`,
      tag: t.tag_stop,
    }),
    () => ({
      kind: 'staff',
      title: isEn ? `${['Ihor','Iryna','Taras'][Math.floor(Math.random()*3)]} opened a shift` : `${['Ігор','Ірина','Тарас'][Math.floor(Math.random()*3)]} відкрив зміну`,
    }),
    () => ({
      kind: 'brain',
      title: isEn ? 'We forecast a spike in 12 min' : 'У нас прогноз сплеску за 12 хв',
      tag: t.tag_ai,
    }),
  ], [t, isEn, money]);

  const buildInitial = () => {
    const e = t.ev;
    const o1 = e.order_new(53, 4, isEn ? 'Oleksandr' : 'Олександр');
    return [
      { id: 7, t: '12:41', kind: 'order', title: o1.title, amount: `+${money(620)}` },
      { id: 6, t: '12:38', kind: 'stop', title: e.stop, tag: t.tag_stop },
      { id: 5, t: '12:35', kind: 'ready', title: e.ready, urgent: true },
      { id: 4, t: '12:31', kind: 'kitchen', title: e.kitchen },
      { id: 3, t: '12:29', kind: 'pay', title: `${e.pay} · ${isEn ? 'table 2' : 'столик 2'}`, amount: `+${money(840)}` },
      { id: 2, t: '12:24', kind: 'staff', title: e.staff },
      { id: 1, t: '12:18', kind: 'brain', title: e.brain, tag: t.tag_ai },
    ];
  };

  const [events, setEvents] = React.useState(buildInitial);
  const [filter, setFilter] = React.useState('all');
  const [freshId, setFreshId] = React.useState(null);
  const nextId = React.useRef(8);

  React.useEffect(() => { setEvents(buildInitial()); }, [t, currency]);

  React.useEffect(() => {
    let timer;
    const schedule = () => {
      const delay = 5000 + Math.random() * 3000; // 5–8s
      timer = setTimeout(() => {
        const gen = generators[Math.floor(Math.random() * generators.length)];
        const ev = gen();
        const now = new Date();
        const hhmm = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
        const newId = nextId.current++;
        setEvents(prev => [{ id: newId, t: hhmm, ...ev }, ...prev].slice(0, 40));
        setFreshId(newId);
        setTimeout(() => setFreshId(null), 1400);
        schedule();
      }, delay);
    };
    schedule();
    return () => clearTimeout(timer);
  }, [generators]);

  const filtered = filter === 'all' ? events : events.filter(e => e.kind === filter);
  const FILTERS = [
    { key: 'all', label: t.f_all }, { key: 'order', label: t.f_order },
    { key: 'kitchen', label: t.f_kitchen }, { key: 'pay', label: t.f_pay },
    { key: 'stop', label: t.f_stop }, { key: 'brain', label: t.f_brain, badge: true },
  ];

  return (
    <div style={fStyles.wrap}>
      <div style={fStyles.headerRow}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={fStyles.title}>{t.feed_title}</div>
          <div style={fStyles.liveBadge}>
            <span style={{ width: 6, height: 6, borderRadius: 99, background: '#2ECC71', animation: 'pulseDot 1.8s infinite' }} />
            {t.feed_online}
          </div>
        </div>
        <div style={fStyles.countMuted}>{t.feed_count(events.length)}</div>
      </div>
      <div className="feed-filter-row" style={fStyles.filterRow}>
        {FILTERS.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            style={{ ...fStyles.filter, ...(filter === f.key ? fStyles.filterActive : {}) }}>
            {f.label}
            {f.badge && <span style={fStyles.aiDot} />}
          </button>
        ))}
      </div>
      <div style={fStyles.scroll}>
        {filtered.map(ev => <FeedRow key={ev.id} ev={ev} fresh={ev.id === freshId} kindMap={kindMap} tagStop={t.tag_stop} tagUrgent={t.tag_urgent} />)}
        {filtered.length === 0 && <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-3)', fontSize: 12 }}>{t.feed_empty}</div>}
      </div>
    </div>
  );
}

const fStyles = {
  wrap: { flex: 1, minHeight: 0, background: 'var(--card)', border: '1px solid var(--hairline)', borderRadius: 12, display: 'flex', flexDirection: 'column', boxShadow: '0 1px 2px rgba(14,27,44,.03)', overflow: 'hidden' },
  headerRow: { padding: '12px 14px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--hairline-2)' },
  title: { fontSize: 14, fontWeight: 600, color: 'var(--ink)' },
  liveBadge: { display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 10, fontWeight: 600, color: 'var(--green-deep)', padding: '2px 7px', background: 'var(--green-soft)', borderRadius: 99, textTransform: 'uppercase', letterSpacing: .4 },
  countMuted: { fontSize: 11, color: 'var(--ink-3)', fontFamily: 'JetBrains Mono, monospace' },
  filterRow: { display: 'flex', gap: 4, padding: '8px 12px', borderBottom: '1px solid var(--hairline-2)', overflowX: 'auto' },
  filter: { display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 9px', borderRadius: 99, fontSize: 11, fontWeight: 500, background: 'transparent', color: 'var(--ink-2)', border: '1px solid var(--hairline)', cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit' },
  filterActive: { background: 'var(--ink)', color: '#fff', borderColor: 'var(--ink)' },
  aiDot: { width: 5, height: 5, borderRadius: 99, background: 'var(--violet)' },
  scroll: { flex: 1, overflowY: 'auto', padding: '4px 0' },
  row: {
    display: 'flex', alignItems: 'center', gap: 8,
    padding: '7px 14px',
    borderLeft: '2px solid transparent',
    borderBottom: '1px solid var(--hairline-2)',
    fontSize: 12.5, lineHeight: 1.3,
    transition: 'background .3s',
  },
  rowIcon: { width: 20, height: 20, borderRadius: 5, display: 'grid', placeItems: 'center', flexShrink: 0 },
  rowTitle: { flex: 1, minWidth: 0, color: 'var(--ink)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  pill: { fontSize: 9, fontWeight: 700, letterSpacing: .4, padding: '1px 5px', borderRadius: 3, flexShrink: 0 },
  urgentPill: { fontSize: 9, fontWeight: 700, letterSpacing: .4, padding: '1px 5px', borderRadius: 3, background: 'var(--red-soft)', color: '#A93A37', textTransform: 'uppercase', flexShrink: 0 },
  amount: { fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 600, color: 'var(--green-deep)', flexShrink: 0 },
  time: { fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5, color: 'var(--ink-3)', fontWeight: 500, flexShrink: 0, width: 36, textAlign: 'right' },
};

Object.assign(window, { LiveFeed });
