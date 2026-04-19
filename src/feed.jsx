// Live event feed — i18n

function EventCard({ ev, fresh, kindMap, tagStop, tagUrgent }) {
  const kind = kindMap[ev.kind];
  const Icon = Icons[kind.icon];
  return (
    <div style={{ ...fStyles.card, borderLeftColor: kind.color, animation: fresh ? 'slideIn .35s ease-out' : 'none', boxShadow: fresh ? '0 0 0 2px rgba(46,204,113,.12)' : '0 1px 2px rgba(14,27,44,.03)' }}>
      <div style={{ ...fStyles.cardIcon, background: kind.bg, color: kind.fg }}><Icon size={14} /></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={fStyles.cardTitleRow}>
          <span style={fStyles.cardTitle}>{ev.title}</span>
          {ev.tag && <span style={{ ...fStyles.pill, background: kind.bg, color: kind.fg }}>{ev.tag}</span>}
          {ev.urgent && <span style={fStyles.urgentPill}>{tagUrgent}</span>}
        </div>
        <div style={fStyles.cardMeta}>{ev.meta}</div>
      </div>
      <div style={fStyles.cardRight}>
        <div style={fStyles.time}>{ev.t}</div>
        {ev.amount && <div style={fStyles.amount}>{ev.amount}</div>}
      </div>
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

  const buildInitial = () => {
    const e = t.ev;
    const o1 = e.order_new(53, 4, t.chat_status.includes('online') ? 'Oleksandr' : 'Олександр');
    return [
      { id: 7, t: '12:41', kind: 'order', title: o1.title, meta: o1.meta + ` · ${money(620)}`, amount: `+${money(620)}` },
      { id: 6, t: '12:38', kind: 'stop', title: e.stop, meta: e.stop_meta, tag: t.tag_stop },
      { id: 5, t: '12:35', kind: 'ready', title: e.ready, meta: e.ready_meta, urgent: true },
      { id: 4, t: '12:31', kind: 'kitchen', title: e.kitchen, meta: e.kitchen_meta },
      { id: 3, t: '12:29', kind: 'pay', title: `${e.pay} ${money(840)}`, meta: `${e.pay_meta} ${money(60)}`, amount: `+${money(840)}` },
      { id: 2, t: '12:24', kind: 'staff', title: e.staff, meta: e.staff_meta },
      { id: 1, t: '12:18', kind: 'brain', title: e.brain, meta: e.brain_meta, tag: t.tag_ai },
    ];
  };

  const [events, setEvents] = React.useState(buildInitial);
  const [filter, setFilter] = React.useState('all');
  const [freshId, setFreshId] = React.useState(null);
  const nextId = React.useRef(8);

  // rebuild when locale changes
  React.useEffect(() => { setEvents(buildInitial()); }, [t, currency]);

  React.useEffect(() => {
    const id = setInterval(() => {
      const e = t.ev;
      const n = 54 + Math.floor(Math.random() * 20);
      const o = e.order_new(n, 1 + Math.floor(Math.random()*12), t === DICT.en ? 'Maryna' : 'Марина');
      const now = new Date();
      const hhmm = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;
      const newId = nextId.current++;
      const amt = 200 + Math.floor(Math.random() * 600);
      setEvents(prev => [{ id: newId, t: hhmm, kind: 'order', title: o.title, meta: o.meta + ` · ${money(amt)}`, amount: `+${money(amt)}` }, ...prev].slice(0, 30));
      setFreshId(newId);
      setTimeout(() => setFreshId(null), 1200);
    }, 5000);
    return () => clearInterval(id);
  }, [t, currency]);

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
          <div style={fStyles.countMuted}>{t.feed_count(events.length)}</div>
        </div>
      </div>
      <div style={fStyles.filterRow}>
        {FILTERS.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            style={{ ...fStyles.filter, ...(filter === f.key ? fStyles.filterActive : {}) }}>
            {f.label}
            {f.badge && <span style={fStyles.aiDot} />}
          </button>
        ))}
      </div>
      <div style={fStyles.scroll}>
        {filtered.map(ev => <EventCard key={ev.id} ev={ev} fresh={ev.id === freshId} kindMap={kindMap} tagStop={t.tag_stop} tagUrgent={t.tag_urgent} />)}
        {filtered.length === 0 && <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink-3)', fontSize: 12 }}>{t.feed_empty}</div>}
      </div>
    </div>
  );
}

const fStyles = {
  wrap: { flex: 1, minHeight: 0, background: 'var(--card)', border: '1px solid var(--hairline)', borderRadius: 12, display: 'flex', flexDirection: 'column', boxShadow: '0 1px 2px rgba(14,27,44,.03)', overflow: 'hidden' },
  headerRow: { padding: '14px 16px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--hairline-2)' },
  title: { fontSize: 15, fontWeight: 600, color: 'var(--ink)' },
  liveBadge: { display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 10.5, fontWeight: 600, color: 'var(--green-deep)', padding: '3px 8px', background: 'var(--green-soft)', borderRadius: 99, textTransform: 'uppercase', letterSpacing: .4 },
  countMuted: { fontSize: 11.5, color: 'var(--ink-3)' },
  filterRow: { display: 'flex', gap: 6, padding: '10px 16px', borderBottom: '1px solid var(--hairline-2)', overflowX: 'auto' },
  filter: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 10px', borderRadius: 99, fontSize: 11.5, fontWeight: 500, background: 'transparent', color: 'var(--ink-2)', border: '1px solid var(--hairline)', cursor: 'pointer', whiteSpace: 'nowrap' },
  filterActive: { background: 'var(--ink)', color: '#fff', borderColor: 'var(--ink)' },
  aiDot: { width: 5, height: 5, borderRadius: 99, background: 'var(--violet)' },
  scroll: { flex: 1, overflowY: 'auto', padding: '8px 10px 12px', display: 'flex', flexDirection: 'column', gap: 6 },
  card: { display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', background: '#FBFAF7', border: '1px solid var(--hairline-2)', borderLeft: '3px solid transparent', borderRadius: 8, transition: 'background .2s' },
  cardIcon: { width: 26, height: 26, borderRadius: 7, display: 'grid', placeItems: 'center', flexShrink: 0 },
  cardTitleRow: { display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' },
  cardTitle: { fontSize: 13, fontWeight: 500, color: 'var(--ink)' },
  cardMeta: { fontSize: 11.5, color: 'var(--ink-3)', marginTop: 2 },
  pill: { fontSize: 9.5, fontWeight: 700, letterSpacing: .4, padding: '1px 6px', borderRadius: 4 },
  urgentPill: { fontSize: 9.5, fontWeight: 700, letterSpacing: .4, padding: '1px 6px', borderRadius: 4, background: 'var(--red-soft)', color: '#A93A37', textTransform: 'uppercase' },
  cardRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2, flexShrink: 0 },
  time: { fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: 'var(--ink-3)', fontWeight: 500 },
  amount: { fontFamily: 'JetBrains Mono, monospace', fontSize: 11.5, fontWeight: 600, color: 'var(--green-deep)' },
};

Object.assign(window, { LiveFeed });
