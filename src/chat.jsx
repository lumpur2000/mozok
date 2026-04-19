// AI Chat panel — i18n aware

function classifyQuery(text) {
  const t = text.toLowerCase();
  if (/(підсум|порад|рекоменд|recommend|advice|summary|how was)/.test(t)) {
    if (/(рекоменд|порад|recommend|advice)/.test(t)) return 'recs';
    return 'day';
  }
  if (/(топ|популярн|найкращ|страв|dish|top|rating)/.test(t)) return 'top';
  if (/(порівн|минул|вчора|тижд|compare|yesterday|last)/.test(t)) return 'compare';
  if (/(проблем|стоп|offline|помилк|issue|problem)/.test(t)) return 'problems';
  if (/(персонал|зміна|офіціант|staff|waiter|shift)/.test(t)) return 'staff';
  if (/(виручк|прибут|продаж|чек|revenue|sales|check)/.test(t)) return 'revenue';
  return null;
}

function buildReplies(t, money, sym) {
  const isEn = t === DICT.en;
  return {
    revenue: { head: `${money(14820)} · ${isEn ? 'margin 31%' : 'маржа 31%'}`, body: isEn ? 'Above-average Tuesday. Dashboard on the right has hourly breakdown and top dishes.' : 'Вище середнього вівторка. Дашборд справа — погодинна розбивка та топ страв.' },
    compare: { head: isEn ? "Today's 12% better" : 'Сьогодні на 12% краще', body: isEn ? `Last Tuesday at this time: ${money(13240)}. Mostly driven by +6 more orders.` : `Мин. вівторок на цей час: ${money(13240)}. Різниця головним чином у кількості замовлень (+6).` },
    top:     { head: isEn ? 'Top 6 today' : 'Топ-6 за сьогодні', body: isEn ? 'Brain Burger & Tom Yum lead. Cheesecake is underperforming — 32 views, 4 sales.' : 'Бургер «Мозок» та Том Ям лідирують. Чізкейк просідає — 32 перегляди, 4 продажі.' },
    problems:{ head: isEn ? '4 active issues' : '4 активні проблеми', body: isEn ? 'Tom Yum on table 7 waiting for waiter. Terminal #2 offline 14 min. Stop-list: salmon.' : 'Том Ям на ст. 7 чекає офіціанта. Термінал #2 оффлайн 14 хв. Стоп-лист: лосось.' },
    staff:   { head: isEn ? '6 on shift · 2 en route' : '6 на зміні · 2 в дорозі', body: isEn ? 'Maryna is 12 min late. Ihor has worked 2 h, Iryna — 4 h.' : 'Марина запізнюється на 12 хв. Ігор працює 2 год, Ірина — 4 год.' },
    day:     { head: isEn ? 'Overall — a strong day' : 'Загалом — сильний день', body: isEn ? 'Revenue +12%, 47 orders, NPS 4.7. Opened the report — breakdown by hours, categories, staff.' : 'Виручка +12%, 47 замовлень, NPS 4.7. Відкрила звіт — там розбивка по годинах, категоріях, персоналу.' },
    recs:    { head: isEn ? '5 recommendations for you' : '5 рекомендацій для вас', body: isEn ? 'Raise Tom Yum price, replace cheesecake, add a waiter for peak, optimize salmon sourcing.' : 'Підняти ціну на Том Ям, замінити Чізкейк, додати офіціанта на пік, оптимізувати закупку лосося.' },
  };
}

function AiBubble({ msg, onOpenDashboard, openLabel }) {
  return (
    <div style={cStyles.aiWrap}>
      <div style={cStyles.aiAvatar}>
        <svg width="14" height="14" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" fill="#2ECC71" opacity=".15" />
          <circle cx="12" cy="12" r="5" fill="#2ECC71" opacity=".35" />
          <circle cx="12" cy="12" r="2.5" fill="#2ECC71" />
        </svg>
      </div>
      <div style={cStyles.aiBubble}>
        <div style={cStyles.aiHeadline}>{msg.text}</div>
        {msg.explain && <div style={cStyles.aiExplain}>{msg.explain}</div>}
        {msg.dashboard && (
          <button style={cStyles.dashBtn} onClick={() => onOpenDashboard(msg.dashboard)}>
            <span>{openLabel}</span>
            <Icons.ChevronRight size={12} />
          </button>
        )}
      </div>
    </div>
  );
}

function UserBubble({ text }) {
  return <div style={cStyles.userWrap}><div style={cStyles.userBubble}>{text}</div></div>;
}

function Typing() {
  return (
    <div style={cStyles.aiWrap}>
      <div style={cStyles.aiAvatar}><svg width="14" height="14" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" fill="#2ECC71"/></svg></div>
      <div style={{ ...cStyles.aiBubble, padding: '10px 14px' }}>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {[0,1,2].map(i => <span key={i} style={{ width: 6, height: 6, borderRadius: 99, background: 'var(--ink-4)', display: 'inline-block', animation: `typing 1.2s ${i * 0.15}s infinite` }} />)}
        </div>
      </div>
    </div>
  );
}

function ChatPanel({ onDashboard }) {
  const { t, money, sym } = useI18n();
  const INITIAL_MSGS = [{ role: 'ai', kind: 'hello', text: t.chat_hello, explain: t.chat_hello_body }];
  const [msgs, setMsgs] = React.useState(INITIAL_MSGS);
  const [input, setInput] = React.useState('');
  const [typing, setTyping] = React.useState(false);
  const [listening, setListening] = React.useState(false);
  const scrollRef = React.useRef(null);

  React.useEffect(() => { setMsgs(INITIAL_MSGS); }, [t]);
  React.useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [msgs, typing]);

  const QUICK = [
    { label: t.q_day, icon: 'Sparkle', kind: 'day', featured: true },
    { label: t.q_recs, icon: 'Sparkle', kind: 'recs', featured: true },
    { label: t.q_revenue, icon: 'Receipt', kind: 'revenue' },
    { label: t.q_top, icon: 'Chart', kind: 'top' },
    { label: t.q_problems, icon: 'Bell', kind: 'problems' },
    { label: t.q_staff, icon: 'Users', kind: 'staff' },
  ];

  const send = (text, forceKind) => {
    if (!text.trim()) return;
    setMsgs(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const kind = forceKind || classifyQuery(text);
      const REPLIES = buildReplies(t, money, sym);
      if (kind) {
        const reply = REPLIES[kind];
        setMsgs(prev => [...prev, { role: 'ai', text: reply.head, explain: reply.body, dashboard: kind }]);
        setTimeout(() => onDashboard(kind, text), 400);
      } else {
        setMsgs(prev => [...prev, { role: 'ai', text: t === DICT.en ? 'Got it' : 'Зрозуміла', explain: t === DICT.en ? 'I can show revenue, top dishes, issues, staff, or compare with past days.' : 'Можу показати виручку, топ страв, проблеми, персонал або порівняння з минулими днями.' }]);
      }
    }, 700 + Math.random() * 400);
  };

  return (
    <div style={cStyles.aside}>
      <div style={cStyles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={cStyles.brainBadge}>
            <span style={{ position: 'relative', display: 'inline-flex', width: 8, height: 8 }}>
              <span style={{ position: 'absolute', inset: 0, borderRadius: 99, background: '#2ECC71' }} />
              <span style={{ position: 'absolute', inset: 0, borderRadius: 99, background: '#2ECC71', animation: 'pulseDot 1.8s infinite' }} />
            </span>
          </div>
          <div>
            <div style={cStyles.brainName}>{t.chat_name}</div>
            <div style={cStyles.brainStatus}>{t.chat_status}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button style={cStyles.headBtn} title="New" onClick={() => setMsgs(INITIAL_MSGS)}><Icons.Plus size={14} /></button>
        </div>
      </div>

      <div style={cStyles.quickGrid}>
        {QUICK.map(q => {
          const Icon = Icons[q.icon];
          return (
            <button key={q.label} style={{ ...cStyles.quick, ...(q.featured ? cStyles.quickFeatured : {}) }} onClick={() => send(q.label, q.kind)}>
              <span style={{ ...cStyles.quickIcon, ...(q.featured ? cStyles.quickIconFeat : {}) }}><Icon size={12} /></span>
              <span>{q.label}</span>
            </button>
          );
        })}
      </div>

      <div ref={scrollRef} style={cStyles.scroll}>
        {msgs.map((m, i) => m.role === 'user' ? <UserBubble key={i} text={m.text} /> : <AiBubble key={i} msg={m} onOpenDashboard={onDashboard} openLabel={t.open_dashboard} />)}
        {typing && <Typing />}
      </div>

      <div style={cStyles.inputWrap}>
        <div style={{ ...cStyles.inputBox, ...(listening ? cStyles.inputListening : {}) }}>
          <input
            placeholder={listening ? t.chat_listening : t.chat_placeholder}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send(input)}
            style={cStyles.input}
          />
          <button style={{ ...cStyles.micBtn, ...(listening ? cStyles.micActive : {}) }} onClick={() => setListening(l => !l)}>
            <Icons.Mic size={14} />
          </button>
          <button style={cStyles.sendBtn} onClick={() => send(input)}>
            <Icons.Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

const cStyles = {
  aside: { height: '100%', width: '100%', background: 'var(--card)', display: 'flex', flexDirection: 'column' },
  header: { padding: '14px 16px', borderBottom: '1px solid var(--hairline-2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  brainBadge: { width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg, #F0FAF4, #E6F7EE)', border: '1px solid #D6EFE0', display: 'grid', placeItems: 'center' },
  brainName: { fontSize: 14, fontWeight: 600, color: 'var(--ink)' },
  brainStatus: { fontSize: 11, color: 'var(--ink-3)' },
  headBtn: { width: 28, height: 28, borderRadius: 7, border: '1px solid var(--hairline)', background: '#fff', display: 'grid', placeItems: 'center', cursor: 'pointer', color: 'var(--ink-2)' },
  quickGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6, padding: '10px 12px', borderBottom: '1px solid var(--hairline-2)', background: '#FBFAF7' },
  quick: { display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 8, background: '#fff', border: '1px solid var(--hairline)', fontSize: 12, fontWeight: 500, color: 'var(--ink)', cursor: 'pointer', textAlign: 'left' },
  quickFeatured: { background: 'linear-gradient(135deg, #F0FAF4, #E6F7EE)', borderColor: '#D6EFE0' },
  quickIcon: { width: 20, height: 20, borderRadius: 5, background: 'var(--green-soft)', color: 'var(--green-deep)', display: 'grid', placeItems: 'center', flexShrink: 0 },
  quickIconFeat: { background: 'var(--green)', color: '#fff' },
  scroll: { flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 12 },
  userWrap: { display: 'flex', justifyContent: 'flex-end' },
  userBubble: { background: 'var(--navy)', color: '#fff', padding: '9px 13px', borderRadius: '14px 14px 4px 14px', maxWidth: '85%', fontSize: 13, lineHeight: 1.4 },
  aiWrap: { display: 'flex', gap: 8, alignItems: 'flex-start' },
  aiAvatar: { width: 24, height: 24, borderRadius: 99, background: 'var(--green-soft)', border: '1px solid #D6EFE0', display: 'grid', placeItems: 'center', flexShrink: 0, marginTop: 2 },
  aiBubble: { background: '#FBFAF7', border: '1px solid var(--hairline-2)', padding: '11px 13px', borderRadius: '14px 14px 14px 4px', fontSize: 13, lineHeight: 1.45, flex: 1, minWidth: 0 },
  aiHeadline: { fontWeight: 600, color: 'var(--ink)', fontSize: 13.5 },
  aiExplain: { color: 'var(--ink-2)', marginTop: 4, fontSize: 12.5, lineHeight: 1.5 },
  dashBtn: { marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 4, background: 'var(--navy)', color: '#fff', border: 'none', padding: '6px 11px', borderRadius: 6, fontSize: 11.5, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' },
  inputWrap: { padding: '10px 14px 14px', borderTop: '1px solid var(--hairline-2)', background: '#fff' },
  inputBox: { display: 'flex', alignItems: 'center', gap: 4, background: '#F7F6F3', border: '1.5px solid var(--hairline)', borderRadius: 12, padding: '6px 6px 6px 12px', transition: 'all .15s' },
  inputListening: { borderColor: 'var(--green)', background: 'var(--green-soft)' },
  input: { flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 13, fontFamily: 'inherit', color: 'var(--ink)', padding: '6px 0' },
  micBtn: { width: 30, height: 30, borderRadius: 8, border: 'none', background: 'transparent', color: 'var(--ink-3)', display: 'grid', placeItems: 'center', cursor: 'pointer' },
  micActive: { background: 'var(--green)', color: '#fff' },
  sendBtn: { width: 32, height: 32, borderRadius: 8, border: 'none', background: 'var(--navy)', color: '#fff', display: 'grid', placeItems: 'center', cursor: 'pointer' },
};

Object.assign(window, { ChatPanel });
