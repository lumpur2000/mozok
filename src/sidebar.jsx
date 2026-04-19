// Collapsible sidebar — i18n aware

function BrainLogo({ size = 28 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="lgSb" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6DE3A9"/>
          <stop offset="1" stopColor="#2ECC71"/>
        </linearGradient>
      </defs>
      <path d="M14 5c-2.5 0-4.3 1.6-4.6 3.6C7.4 9 6 10.5 6 12.4c0 1 .4 1.9 1 2.6-.9.7-1.5 1.8-1.5 3 0 1.8 1.2 3.3 2.8 3.7.3 2 2.1 3.5 4.2 3.5 1 0 2-.3 2.7-.9V5.4c-.3 0-.6 0-1-.4z" fill="url(#lgSb)" opacity=".9"/>
      <path d="M18 5c2.5 0 4.3 1.6 4.6 3.6 2 .4 3.4 1.9 3.4 3.8 0 1-.4 1.9-1 2.6.9.7 1.5 1.8 1.5 3 0 1.8-1.2 3.3-2.8 3.7-.3 2-2.1 3.5-4.2 3.5-1 0-2-.3-2.7-.9V5.4c.3 0 .6 0 1-.4z" fill="url(#lgSb)"/>
      <circle cx="11" cy="13" r="1" fill="#0F263E" opacity=".3"/>
      <circle cx="21" cy="13" r="1" fill="#0F263E" opacity=".3"/>
      <circle cx="12" cy="18" r="1" fill="#0F263E" opacity=".3"/>
      <circle cx="20" cy="18" r="1" fill="#0F263E" opacity=".3"/>
    </svg>
  );
}

function Sidebar({ active, onNav, expanded, onToggle }) {
  const { t } = useI18n();
  const navItems = [
    { key: 'dashboard', label: t.nav_dashboard, icon: 'Home' },
    { key: 'analytics', label: t.nav_analytics, icon: 'Chart' },
    { key: 'menu', label: t.nav_menu, icon: 'Menu' },
    { key: 'warehouse', label: t.nav_warehouse, icon: 'Box' },
    { key: 'staff', label: t.nav_staff, icon: 'Users' },
    { key: 'suppliers', label: t.nav_suppliers, icon: 'Truck' },
    { key: 'settings', label: t.nav_settings, icon: 'Gear' },
  ];
  const W = expanded ? 224 : 64;
  return (
    <aside style={{ ...sbStyles.aside, width: W }}>
      <div style={{ ...sbStyles.logoRow, justifyContent: expanded ? 'flex-start' : 'center', padding: expanded ? '18px 18px 14px' : '18px 0 14px' }}>
        <BrainLogo />
        <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', opacity: expanded ? 1 : 0, width: expanded ? 'auto' : 0, transition: 'opacity .2s, width .2s' }}>
          <div style={sbStyles.logoTitle}>{t.brand1}</div>
          <div style={sbStyles.logoSub}>{t.brand2}</div>
        </div>
      </div>

      <button onClick={onToggle} title={expanded ? 'Collapse' : 'Expand'} style={{ ...sbStyles.toggle, left: W - 14 }}>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          style={{ transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }}>
          <path d="m9 6 6 6-6 6"/>
        </svg>
      </button>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: expanded ? '8px 10px' : '8px 8px' }}>
        {navItems.map(item => {
          const Icon = Icons[item.icon];
          const isActive = active === item.key;
          return (
            <button key={item.key} onClick={() => onNav(item.key)} title={!expanded ? item.label : undefined}
              style={{ ...sbStyles.navItem, ...(isActive ? sbStyles.navItemActive : {}), justifyContent: expanded ? 'flex-start' : 'center', padding: expanded ? '9px 12px' : '10px 0' }}>
              <span style={sbStyles.navIcon}><Icon size={18} /></span>
              <span style={{ overflow: 'hidden', whiteSpace: 'nowrap', opacity: expanded ? 1 : 0, width: expanded ? 'auto' : 0, transition: 'opacity .18s' }}>{item.label}</span>
              {expanded && item.badge && <span style={sbStyles.navBadge}>{item.badge}</span>}
              {expanded && item.warn && <span style={sbStyles.navBadgeAmber}>!</span>}
              {!expanded && (item.badge || item.warn) && <span style={sbStyles.collapsedDot} />}
            </button>
          );
        })}
      </nav>

      <div style={{ flex: 1 }} />

      <div style={{ ...sbStyles.userRow, padding: expanded ? '10px 10px' : '10px 0', justifyContent: expanded ? 'flex-start' : 'center', margin: expanded ? '4px 12px 14px' : '4px 8px 14px' }}>
        <div style={sbStyles.userAvatar}>А</div>
        <div style={{ flex: 1, minWidth: 0, overflow: 'hidden', whiteSpace: 'nowrap', opacity: expanded ? 1 : 0, width: expanded ? 'auto' : 0, transition: 'opacity .18s' }}>
          <div style={sbStyles.userName}>Андрій Мельник</div>
          <div style={sbStyles.userRole}>{t.owner}</div>
        </div>
      </div>
    </aside>
  );
}

const sbStyles = {
  aside: { flexShrink: 0, height: '100vh', background: 'var(--navy)', color: '#D9E2EF', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(0,0,0,.2)', fontSize: 13, transition: 'width .22s cubic-bezier(.4,0,.2,1)', position: 'relative' },
  logoRow: { display: 'flex', alignItems: 'center', gap: 10 },
  logoTitle: { color: '#fff', fontWeight: 600, fontSize: 15, letterSpacing: -.1 },
  logoSub: { color: '#8FA7C4', fontSize: 11, marginTop: 1 },
  toggle: { position: 'absolute', top: 64, width: 22, height: 22, borderRadius: 99, background: '#fff', color: 'var(--navy)', border: '1px solid var(--hairline)', display: 'grid', placeItems: 'center', cursor: 'pointer', zIndex: 5, boxShadow: '0 2px 6px rgba(14,27,44,.15)', transition: 'left .22s cubic-bezier(.4,0,.2,1)', transform: 'translateX(-50%)' },
  navItem: { display: 'flex', alignItems: 'center', gap: 10, borderRadius: 8, background: 'transparent', border: 'none', color: '#B4C3D6', textAlign: 'left', cursor: 'pointer', fontSize: 13, fontWeight: 500, transition: 'all .15s', position: 'relative' },
  navItemActive: { background: 'rgba(255,255,255,.07)', color: '#fff', boxShadow: 'inset 2px 0 0 #2ECC71' },
  navIcon: { color: 'inherit', display: 'inline-flex', flexShrink: 0 },
  navBadge: { marginLeft: 'auto', fontSize: 10, fontWeight: 700, background: '#2ECC71', color: '#0F263E', padding: '1px 6px', borderRadius: 99, fontFamily: 'JetBrains Mono, monospace' },
  navBadgeAmber: { marginLeft: 'auto', fontSize: 10, fontWeight: 700, background: '#E9A23B', color: '#3A2A0E', width: 16, height: 16, borderRadius: 99, display: 'grid', placeItems: 'center' },
  collapsedDot: { position: 'absolute', top: 7, right: 12, width: 6, height: 6, borderRadius: 99, background: '#2ECC71' },
  userRow: { background: 'rgba(0,0,0,.18)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10 },
  userAvatar: { width: 32, height: 32, borderRadius: 99, background: '#D9E2EF', color: '#1A3A5C', fontWeight: 700, fontSize: 13, display: 'grid', placeItems: 'center', flexShrink: 0 },
  userName: { color: '#fff', fontWeight: 600, fontSize: 12.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  userRole: { color: '#8FA7C4', fontSize: 10.5 },
};

Object.assign(window, { Sidebar });
