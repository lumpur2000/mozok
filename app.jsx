// App shell — routes between Dashboard (live), Analytics, Menu, Warehouse, Staff, Suppliers, Settings.
// Top bar is clean (greeting only). Language/currency live in Settings.

function TopBar({ pageTitle }) {
  const { t } = useI18n();
  return (
    <div style={appStyles.topbar}>
      <div>
        <div style={appStyles.greet}>{pageTitle || t.greet}</div>
        <div style={appStyles.date}>{t.dateLine}</div>
      </div>
    </div>
  );
}

function FloatingBrain({ open, onClick }) {
  const { t } = useI18n();
  return (
    <button onClick={onClick} style={{
      ...appStyles.floatBrain,
      transform: open ? 'translateY(8px) scale(.95)' : 'translateY(0) scale(1)',
      opacity: open ? 0 : 1,
      pointerEvents: open ? 'none' : 'auto',
    }}>
      <span style={appStyles.floatBrainIcon}>
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
      <span style={appStyles.floatBrainLabel}>
        <span style={{ fontWeight: 600 }}>{t.chat_name}</span>
        <span style={appStyles.floatBrainSub}>{t === DICT.en ? 'Ask anything' : 'Запитай що завгодно'}</span>
      </span>
      <span style={{ position: 'relative', display: 'inline-flex', width: 7, height: 7 }}>
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

function AppInner() {
  const [active, setActive] = React.useState('dashboard');
  const [navExpanded, setNavExpanded] = React.useState(false);
  const [chatOpen, setChatOpen] = React.useState(false);
  // Brain-generated card shown at top of Analytics page
  const [brainCard, setBrainCard] = React.useState(null);
  const { t } = useI18n();

  // Chat asks Analytics to render a custom card — routes to Analytics page
  const onDashboard = (kind, query) => {
    setBrainCard({ kind, query: query || '' });
    setActive('analytics');
    if (!chatOpen) setChatOpen(true);
  };

  const renderPage = () => {
    switch (active) {
      case 'dashboard':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18, height: '100%', minHeight: 0, animation: 'fadeIn .25s ease-out' }}>
            <BigKpiRow />
            <LiveFeed />
          </div>
        );
      case 'analytics':
        return <AnalyticsPage brainCard={brainCard} onClearBrain={() => setBrainCard(null)} />;
      case 'menu':      return <MenuPage />;
      case 'warehouse': return <WarehousePage />;
      case 'staff':     return <StaffPage />;
      case 'suppliers': return <SuppliersPage />;
      case 'settings':  return <SettingsPage />;
      default:          return null;
    }
  };

  return (
    <div style={appStyles.shell}>
      <Sidebar
        active={active}
        onNav={(k) => setActive(k)}
        expanded={navExpanded} onToggle={() => setNavExpanded(e => !e)}
      />

      <main style={appStyles.main}>
        <TopBar />
        <div style={appStyles.body}>
          {renderPage()}
        </div>
      </main>

      <div style={{
        ...appStyles.chatWrap,
        transform: chatOpen ? 'translateX(0)' : 'translateX(100%)',
      }}>
        <ChatClose onClick={() => setChatOpen(false)} />
        <ChatPanel onDashboard={onDashboard} />
      </div>

      <FloatingBrain open={chatOpen} onClick={() => setChatOpen(true)} />
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
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
