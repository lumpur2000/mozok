// Tweaks panel — edit mode

function TweaksPanel({ tweaks, setTweak, visible }) {
  if (!visible) return null;
  return (
    <div style={tStyles.panel}>
      <div style={tStyles.head}>
        <div style={tStyles.title}>Tweaks</div>
        <div style={tStyles.sub}>Живі налаштування дашборду</div>
      </div>

      <Group label="Швидкість стрічки">
        <Seg opts={[['slow','повільно'],['normal','нормально'],['fast','швидко']]} value={tweaks.feedSpeed} onChange={v => setTweak('feedSpeed', v)} />
      </Group>

      <Group label="Щільність">
        <Seg opts={[['cozy','затишно'],['comfy','комфортно'],['compact','компакт']]} value={tweaks.density} onChange={v => setTweak('density', v)} />
      </Group>

      <Group label="Акцент">
        <div style={{ display: 'flex', gap: 6 }}>
          {[
            { k: 'green', c: '#2ECC71' },
            { k: 'blue', c: '#3D7FD1' },
            { k: 'violet', c: '#7B61E3' },
            { k: 'amber', c: '#E9A23B' },
          ].map(a => (
            <button
              key={a.k}
              onClick={() => setTweak('accent', a.k)}
              style={{
                ...tStyles.swatch,
                background: a.c,
                outline: tweaks.accent === a.k ? '2px solid var(--ink)' : '2px solid transparent',
                outlineOffset: 2,
              }}
            />
          ))}
        </div>
      </Group>
    </div>
  );
}

function Group({ label, children }) {
  return (
    <div style={{ padding: '10px 14px', borderTop: '1px solid var(--hairline-2)' }}>
      <div style={tStyles.lbl}>{label}</div>
      {children}
    </div>
  );
}

function Seg({ opts, value, onChange }) {
  return (
    <div style={tStyles.seg}>
      {opts.map(([k, l]) => (
        <button key={k} onClick={() => onChange(k)}
          style={{ ...tStyles.segBtn, ...(value === k ? tStyles.segOn : {}) }}>
          {l}
        </button>
      ))}
    </div>
  );
}

const tStyles = {
  panel: {
    position: 'fixed', bottom: 16, right: 16,
    width: 260, zIndex: 100,
    background: '#fff',
    border: '1px solid var(--hairline)',
    borderRadius: 12,
    boxShadow: '0 12px 32px rgba(14,27,44,.14), 0 2px 4px rgba(14,27,44,.04)',
    overflow: 'hidden',
    fontSize: 12,
  },
  head: { padding: '12px 14px' },
  title: { fontSize: 13, fontWeight: 600 },
  sub: { fontSize: 11, color: 'var(--ink-3)', marginTop: 2 },
  lbl: { fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: .5, fontWeight: 600, marginBottom: 6 },
  seg: { display: 'flex', background: '#F3F1EA', borderRadius: 8, padding: 2, gap: 2 },
  segBtn: {
    flex: 1, padding: '5px 6px', border: 'none', background: 'transparent',
    borderRadius: 6, fontSize: 11, color: 'var(--ink-2)', cursor: 'pointer', fontWeight: 500,
  },
  segOn: { background: '#fff', color: 'var(--ink)', boxShadow: '0 1px 2px rgba(14,27,44,.08)' },
  swatch: {
    width: 28, height: 28, borderRadius: 8, border: 'none', cursor: 'pointer',
  },
};

Object.assign(window, { TweaksPanel });
