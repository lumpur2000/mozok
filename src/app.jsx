// App shell — routes between Dashboard (live), Analytics, Menu, Warehouse, Staff, Suppliers, Settings.
// Top bar is clean (greeting only). Language/currency live in Settings.

// --- Controls seed data (pre-existing decisions, for demo) ---
function formatFutureDate(daysAhead, lang) {
  // Anchor: today = April 19
  const baseDay = 19;
  const month = { uk: 'квіт.', en: 'Apr' }[lang] || 'квіт.';
  const target = baseDay + daysAhead;
  // stay within April for demo (all offsets < 12)
  return lang === 'en' ? `${month} ${target}` : `${target} ${month}`;
}

function seedControls() {
  const ukMode = (localStorage.getItem('mozok_lang') || 'uk') === 'uk';
  return [
    // Done — past
    {
      id: 'seed_1',
      blockId: 'seed_dessert',
      blockTitle: ukMode ? 'Десерти тонкі в категоріях' : 'Desserts are thin in category mix',
      optionLabel: ukMode ? 'Додати підказку по десерту в скрипт офіціанта' : 'Add dessert prompt to waiter flow',
      optionCons: ukMode ? 'Тест 1 тиждень · очік. +12% до конверсії десертів' : 'Test for 1 week · expected +12% dessert attach rate',
      appliedFromToday: -5, appliedLabel: ukMode ? '14 квіт.' : 'Apr 14',
      daysFromToday: -1, checkLabel: ukMode ? '18 квіт. (вчора)' : 'Apr 18 (yesterday)',
      verdict: 'ok',
      before: { value: '7%', unit: ukMode ? 'частка виручки' : 'revenue share' },
      after:  { value: '11%', unit: ukMode ? 'частка виручки' : 'revenue share' },
      brainVerdict: ukMode
        ? 'Спрацювало. +4 пп до частки десертів за тиждень. Гадаємо, варто залишити в скрипті назавжди і скоро підняти допродаж на каву.'
        : 'Worked. +4 pp on dessert share in a week. We think we should keep the prompt permanent and soon upsell coffee alongside.',
    },
    {
      id: 'seed_2',
      blockId: 'seed_table11',
      blockTitle: ukMode ? 'Столик 11 — 27 хв без сервісу' : 'Table 11 — 27 min without service',
      optionLabel: ukMode ? 'Перерозподілити зони офіціантів' : 'Reassign waiter zones',
      optionCons: ukMode ? 'Без витрат · вступає в силу наступну зміну' : 'No cost · effective next shift',
      appliedFromToday: -4, appliedLabel: ukMode ? '15 квіт.' : 'Apr 15',
      daysFromToday: -2, checkLabel: ukMode ? '17 квіт.' : 'Apr 17',
      verdict: 'partial',
      before: { value: '18', unit: ukMode ? 'хв ср. очікув.' : 'min avg wait' },
      after:  { value: '13', unit: ukMode ? 'хв ср. очікув.' : 'min avg wait' },
      brainVerdict: ukMode
        ? 'Частково. Скоротили з 18 до 13 хв — але це ще не наш бенчмарк у 8 хв. Далекий кут зали все одно гірший. Варто повернутися до цього наступного тижня.'
        : 'Partially. Down from 18 to 13 min — but not at our 8 min benchmark. The far corner is still worse. Worth revisiting next week.',
    },
    {
      id: 'seed_3',
      blockId: 'seed_price_wine',
      blockTitle: ukMode ? 'Знижений апсейл вина' : 'Wine upsell dropping',
      optionLabel: ukMode ? 'Підняти ціну келиху на ₴10' : 'Raise glass price by ₴10',
      optionCons: ukMode ? 'Тест 1 тиждень · маржа +8%' : 'Test for 1 week · margin +8%',
      appliedFromToday: -5, appliedLabel: ukMode ? '14 квіт.' : 'Apr 14',
      daysFromToday: -3, checkLabel: ukMode ? '16 квіт.' : 'Apr 16',
      verdict: 'no',
      before: { value: '42', unit: ukMode ? 'келихи/день' : 'glasses/day' },
      after:  { value: '31', unit: ukMode ? 'келихи/день' : 'glasses/day' },
      brainVerdict: ukMode
        ? 'Не спрацювало. Продажі впали на 26%, маржа в гривнях нижча. Ми повернули ціну вчора. Ідея — краще пробувати апсейл через пейринг.'
        : 'Did not work. Sales down 26%, absolute margin lower. We reverted price yesterday. Better try upsell via pairing next.',
    },
    // Active — future
    {
      id: 'seed_4',
      blockId: 'seed_happy',
      blockTitle: ukMode ? 'Провал між 15:00 і 17:00' : 'Gap between 3pm and 5pm',
      optionLabel: ukMode ? 'Запустити happy hour знижку 15%' : 'Launch happy hour −15%',
      optionCons: ukMode ? 'Тест 2 тижні · очік. +₴2 400/тижд' : 'Test for 2 weeks · est. +₴2 400/week',
      appliedFromToday: -3, appliedLabel: ukMode ? '16 квіт.' : 'Apr 16',
      daysFromToday: 11, checkLabel: ukMode ? '30 квіт.' : 'Apr 30',
      verdict: null,
      pendingNote: ukMode
        ? 'Дивимося дві тижневі точки поспіль: якщо виручка у слоті 15:00–17:00 виросте на ≥₴1 800/тижд, лишаємо акцію постійно.'
        : 'Watching two weekly points: if 3–5pm revenue grows by ≥₴1 800/wk, we keep the promo permanent.',
    },
    {
      id: 'seed_5',
      blockId: 'seed_kitchen',
      blockTitle: ukMode ? 'Гарячі на 48с повільніше за норму' : 'Hot dishes 48s slower than norm',
      optionLabel: ukMode ? 'Поспостерігати ще 3 дні' : 'Watch for another 3 days',
      optionCons: ukMode ? 'Якщо виросте понад 90с — діємо одразу' : 'If it grows past 90s — we act immediately',
      appliedFromToday: 0, appliedLabel: ukMode ? '19 квіт. (сьогодні)' : 'Apr 19 (today)',
      daysFromToday: 3, checkLabel: ukMode ? '22 квіт.' : 'Apr 22',
      verdict: null,
      pendingNote: ukMode
        ? 'Порівняємо медіану часу гарячих за останні 3 дні з нормою. Якщо різниця зросте — ініціюємо розмову з Ігорем.'
        : 'We compare hot-dish median over the last 3 days vs norm. If gap grows — we start the Ihor conversation.',
    },
  ];
}

function TopBar({ pageTitle, onBurger, onChat, isMobile }) {
  const { t } = useI18n();
  return (
    <div className="app-topbar" style={appStyles.topbar}>
      {isMobile && (
        <button className="mobile-burger" onClick={onBurger} style={appStyles.iconBtn} title="Menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
        </button>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="app-topbar-greet" style={appStyles.greet}>{pageTitle || t.greet}</div>
        <div className="app-topbar-date" style={appStyles.date}>{t.dateLine}</div>
      </div>
      {isMobile && (
        <button className="mobile-chat-icon" onClick={onChat} style={appStyles.iconBtn} title={t.chat_name}>
          <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
            <defs>
              <linearGradient id="tbBrain" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#6DE3A9"/><stop offset="1" stopColor="#2ECC71"/>
              </linearGradient>
            </defs>
            <path d="M14 5c-2.5 0-4.3 1.6-4.6 3.6C7.4 9 6 10.5 6 12.4c0 1 .4 1.9 1 2.6-.9.7-1.5 1.8-1.5 3 0 1.8 1.2 3.3 2.8 3.7.3 2 2.1 3.5 4.2 3.5 1 0 2-.3 2.7-.9V5.4c-.3 0-.6 0-1-.4z" fill="url(#tbBrain)" opacity=".9"/>
            <path d="M18 5c2.5 0 4.3 1.6 4.6 3.6 2 .4 3.4 1.9 3.4 3.8 0 1-.4 1.9-1 2.6.9.7 1.5 1.8 1.5 3 0 1.8-1.2 3.3-2.8 3.7-.3 2-2.1 3.5-4.2 3.5-1 0-2-.3-2.7-.9V5.4c.3 0 .6 0 1-.4z" fill="url(#tbBrain)"/>
          </svg>
        </button>
      )}
    </div>
  );
}

function FloatingBrain({ open, onClick }) {
  const { t } = useI18n();
  return (
    <button onClick={onClick} className="float-brain" style={{
      ...appStyles.floatBrain,
      transform: open ? 'translateY(8px) scale(.95)' : 'translateY(0) scale(1)',
      opacity: open ? 0 : 1,
      pointerEvents: open ? 'none' : 'auto',
    }}>
      <span className="float-brain-icon" style={appStyles.floatBrainIcon}>
        <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
          <defs>
            <linearGradient id="fbLg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#6DE3A9"/><stop offset="1" stopColor="#2ECC71"/>
            </linearGradient>
          </defs>
          <path d="M14 5c-2.5 0-4.3 1.6-4.6 3.6C7.4 9 6 10.5 6 12.4c0 1 .4 1.9 1 2.6-.9.7-1.5 1.8-1.5 3 0 1.8 1.2 3.3 2.8 3.7.3 2 2.1 3.5 4.2 3.5 1 0 2-.3 2.7-.9V5.4c-.3 0-.6 0-1-.4z" fill="url(#fbLg)" opacity=".9"/>
          <path d="M18 5c2.5 0 4.3 1.6 4.6 3.6 2 .4 3.4 1.9 3.4 3.8 0 1-.4 1.9-1 2.6.9.7 1.5 1.8 1.5 3 0 1.8-1.2 3.3-2.8 3.7-.3 2-2.1 3.5-4.2 3.5-1 0-2-.3-2.7-.9V5.4c.3 0 .6 0 1-.4z" fill="url(#fbLg)"/>
        </svg>
      </span>
      <span className="float-brain-label" style={appStyles.floatBrainLabel}>
        <span style={{ fontWeight: 600 }}>{t.chat_name}</span>
        <span style={appStyles.floatBrainSub}>{t === DICT.en ? 'Ask anything' : 'Запитай що завгодно'}</span>
      </span>
      <span className="float-brain-pulse" style={{ position: 'relative', display: 'inline-flex', width: 7, height: 7 }}>
        <span style={{ position: 'absolute', inset: 0, borderRadius: 99, background: '#2ECC71' }} />
        <span style={{ position: 'absolute', inset: 0, borderRadius: 99, background: '#2ECC71', animation: 'pulseDot 1.8s infinite' }} />
      </span>
    </button>
  );
}

function ChatClose({ onClick }) {
  return (
    <button onClick={onClick} style={appStyles.chatClose} title="×">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>
    </button>
  );
}

function useIsMobile() {
  const [m, setM] = React.useState(() => typeof window !== 'undefined' && window.innerWidth <= 768);
  React.useEffect(() => {
    const onR = () => setM(window.innerWidth <= 768);
    window.addEventListener('resize', onR);
    return () => window.removeEventListener('resize', onR);
  }, []);
  return m;
}

function AppInner() {
  const [active, setActive] = React.useState('dashboard');
  const [navExpanded, setNavExpanded] = React.useState(false);
  const [chatOpen, setChatOpen] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  // Brain-generated card shown at top of Analytics page
  const [brainCard, setBrainCard] = React.useState(null);
  // Controls store: list of applied decisions with check dates
  const [controls, setControls] = React.useState(() => seedControls());
  const { t } = useI18n();
  const isMobile = useIsMobile();

  // Close drawer when nav changes or breakpoint flips back to desktop
  React.useEffect(() => { if (!isMobile) setDrawerOpen(false); }, [isMobile]);

  const navTo = (k) => { setActive(k); setDrawerOpen(false); };

  // Chat asks Analytics to render a custom card — routes to Analytics page and closes chat
  const onDashboard = (kind, query) => {
    setBrainCard({ kind, query: query || '' });
    setActive('analytics');
    setChatOpen(false);
  };

  // Analytics → Controls: push a new decision when user confirms an option
  const onPushControl = (c) => {
    setControls(prev => {
      // one control per block — replace if re-applied
      const next = prev.filter(x => x.blockId !== c.blockId);
      // Check period depends on option wording: "2 weeks" → 14; "3 days" → 3; default 7
      let checkDays = 7;
      const label = (c.optionLabel + ' ' + (c.optionCons || '')).toLowerCase();
      if (/2 weeks|2 тижн/.test(label)) checkDays = 14;
      else if (/1 week|1 тижд/.test(label)) checkDays = 7;
      else if (/3 day|3 дн/.test(label)) checkDays = 3;
      else if (/half.day|пів дня/.test(label)) checkDays = 5;
      return [...next, {
        id: 'ctrl_' + Date.now(),
        blockId: c.blockId,
        blockTitle: c.blockTitle,
        optionLabel: c.optionLabel,
        optionCons: c.optionCons,
        appliedFromToday: 0,
        appliedLabel: t === DICT.en ? 'Apr 19 (today)' : '19 квіт. (сьогодні)',
        daysFromToday: checkDays,
        checkLabel: formatFutureDate(checkDays, t === DICT.en ? 'en' : 'uk'),
        verdict: null,
        pendingNote: t === DICT.en
          ? `We'll compare the same metric ${checkDays === 14 ? 'two weeks' : checkDays + ' days'} from today and give a verdict here.`
          : `Через ${checkDays === 14 ? 'два тижні' : checkDays + ' днів'} порівняємо той самий показник і дамо висновок тут.`,
      }];
    });
  };

  const renderPage = () => {
    switch (active) {
      case 'dashboard':
        return (
          <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: '55fr 45fr', gap: 16, height: '100%', minHeight: 0, animation: 'fadeIn .25s ease-out' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
              <BigKpiRow />
              <BrainInsightBlock />
            </div>
            <div className="dashboard-feed" style={{ display: 'flex', minHeight: 0 }}>
              <LiveFeed />
            </div>
          </div>
        );
      case 'analytics':
        return <AnalyticsPage brainCard={brainCard} onClearBrain={() => setBrainCard(null)} controls={controls} onPushControl={onPushControl} />;
      case 'controls':  return <ControlsPage controls={controls} />;
      case 'menu':      return <MenuPage />;
      case 'warehouse': return <WarehousePage />;
      case 'staff':     return <StaffPage />;
      case 'suppliers': return <SuppliersPage />;
      case 'settings':  return <SettingsPage />;
      default:          return null;
    }
  };

  // Mobile topbar shows the active section name; desktop keeps greeting
  const sectionTitles = {
    dashboard: t.greet,
    analytics: t.nav_analytics,
    controls: t.nav_controls,
    menu: t.nav_menu,
    warehouse: t.nav_warehouse,
    staff: t.nav_staff,
    suppliers: t.nav_suppliers,
    settings: t.nav_settings,
  };

  return (
    <div className="app-shell" style={appStyles.shell}>
      <Sidebar
        active={active}
        onNav={navTo}
        expanded={navExpanded} onToggle={() => setNavExpanded(e => !e)}
        mobileOpen={drawerOpen} isMobile={isMobile}
      />

      {isMobile && drawerOpen && (
        <div className="mobile-overlay" onClick={() => setDrawerOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(14,27,44,.4)', zIndex: 70 }} />
      )}

      <main className="app-main" style={appStyles.main}>
        <TopBar
          pageTitle={isMobile ? sectionTitles[active] : null}
          onBurger={() => setDrawerOpen(true)}
          onChat={() => setChatOpen(true)}
          isMobile={isMobile}
        />
        <div className="app-body" style={appStyles.body}>
          {renderPage()}
        </div>
      </main>

      <div className="chat-wrap" style={{
        ...appStyles.chatWrap,
        transform: chatOpen ? 'translateX(0)' : 'translateX(100%)',
      }}>
        <ChatClose onClick={() => setChatOpen(false)} />
        <ChatPanel onDashboard={onDashboard} />
      </div>

      {!isMobile && <FloatingBrain open={chatOpen} onClick={() => setChatOpen(true)} />}
    </div>
  );
}

function App() {
  return (
    <I18nProvider>
      <AppInner />
    </I18nProvider>
  );
}

const appStyles = {
  shell: { display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', background: 'var(--canvas)', position: 'relative' },
  main: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', background: 'var(--canvas)' },

  topbar: {
    padding: '18px 28px 14px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
  },
  greet: { fontSize: 19, fontWeight: 600, letterSpacing: -.3, color: 'var(--ink)' },
  date: { fontSize: 12, color: 'var(--ink-3)', marginTop: 2 },

  body: {
    flex: 1, minHeight: 0,
    padding: '0 28px 24px',
    display: 'flex', flexDirection: 'column',
  },

  chatWrap: {
    position: 'fixed', top: 0, right: 0, bottom: 0,
    width: 340, zIndex: 50,
    background: 'var(--card)',
    borderLeft: '1px solid var(--hairline)',
    boxShadow: '-8px 0 24px rgba(14,27,44,.06)',
    transition: 'transform .28s cubic-bezier(.4,0,.2,1)',
    display: 'flex', flexDirection: 'column',
  },
  chatClose: {
    position: 'absolute', top: 16, right: 14,
    width: 26, height: 26, borderRadius: 7,
    border: '1px solid var(--hairline)', background: '#fff',
    display: 'grid', placeItems: 'center',
    color: 'var(--ink-3)', cursor: 'pointer', zIndex: 2,
  },

  floatBrain: {
    position: 'fixed', bottom: 20, right: 20, zIndex: 40,
    display: 'inline-flex', alignItems: 'center', gap: 12,
    padding: '10px 16px 10px 10px',
    background: 'var(--navy)', color: '#fff',
    border: 'none', borderRadius: 99,
    boxShadow: '0 12px 28px rgba(14,27,44,.25), 0 2px 6px rgba(14,27,44,.1)',
    cursor: 'pointer', fontFamily: 'inherit',
    transition: 'transform .2s, opacity .2s',
  },
  floatBrainIcon: {
    width: 36, height: 36, borderRadius: 99,
    background: 'rgba(255,255,255,.08)',
    display: 'grid', placeItems: 'center',
  },
  floatBrainLabel: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1, textAlign: 'left' },
  floatBrainSub: { fontSize: 10.5, color: '#8FA7C4', fontWeight: 400 },
  iconBtn: { width: 36, height: 36, borderRadius: 8, border: '1px solid var(--hairline)', background: '#fff', display: 'grid', placeItems: 'center', color: 'var(--ink-2)', cursor: 'pointer', flexShrink: 0 },
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
