// Controls (Контроль рішень) — one-line timeline: past 5 days | today | future check dates.
// Click a row → modal with before/after numbers and Brain verdict.

function ControlsPage({ controls }) {
  const { t } = useI18n();
  const isEn = t === DICT.en;
  const [open, setOpen] = React.useState(null);

  // Today is the demo "anchor" — everything aligns around it. Uses fictional date label from greeting.
  const today = 0; // day-offset origin

  // Split by status
  const done = controls.filter(c => c.daysFromToday < 0).sort((a,b) => b.daysFromToday - a.daysFromToday);
  const active = controls.filter(c => c.daysFromToday >= 0).sort((a,b) => a.daysFromToday - b.daysFromToday);

  // Build timeline window: past 5 days … today … max(7, furthest checkpoint)
  const maxFuture = active.length ? Math.max(7, ...active.map(c => c.daysFromToday)) : 7;
  const days = [];
  for (let d = -5; d <= maxFuture; d++) days.push(d);

  return (
    <div style={ctStyles.page}>
      <PageHead title={t.ctrl_title} sub={t.ctrl_sub} />
      <div style={ctStyles.scroll}>
        {controls.length === 0 ? (
          <div style={ctStyles.empty}>{t.ctrl_empty}</div>
        ) : (
          <React.Fragment>
            {/* Timeline scale */}
            <div className="ct-timeline" style={ctStyles.timeline}>
              <div style={ctStyles.timelineRow}>
                {days.map(d => (
                  <div key={d} style={{ ...ctStyles.dayCell, ...(d === 0 ? ctStyles.dayCellToday : d < 0 ? ctStyles.dayCellPast : {}) }}>
                    <div style={ctStyles.dayLabel}>{dayLabel(d, isEn)}</div>
                    <div style={ctStyles.dayTick} />
                  </div>
                ))}
              </div>
            </div>

            {/* Section: done */}
            {done.length > 0 && (
              <div style={ctStyles.section}>
                <SectionHead label={t.ctrl_done} count={done.length} tone="done" />
                {done.map(c => (
                  <TimelineRow key={c.id} ctrl={c} days={days} onOpen={() => setOpen(c)} />
                ))}
              </div>
            )}

            {/* Section: active */}
            {active.length > 0 && (
              <div style={ctStyles.section}>
                <SectionHead label={t.ctrl_active} count={active.length} tone="active" />
                {active.map(c => (
                  <TimelineRow key={c.id} ctrl={c} days={days} onOpen={() => setOpen(c)} />
                ))}
              </div>
            )}
          </React.Fragment>
        )}
      </div>

      {open && <ControlModal ctrl={open} onClose={() => setOpen(null)} />}
    </div>
  );
}

function dayLabel(d, isEn) {
  if (d === 0) return isEn ? 'Today' : 'Сьогодні';
  if (d === -1) return isEn ? 'Yest.' : 'Вчора';
  if (d === 1) return isEn ? 'Tmrw' : 'Завтра';
  return d < 0 ? `${d}` : `+${d}`;
}

function SectionHead({ label, count, tone }) {
  return (
    <div style={ctStyles.sectionHead}>
      <span style={{ ...ctStyles.sectionDot, background: tone === 'done' ? '#9AA6B8' : '#2ECC71' }} />
      <span style={ctStyles.sectionLabel}>{label}</span>
      <span style={ctStyles.sectionCount}>{count}</span>
    </div>
  );
}

function TimelineRow({ ctrl, days, onOpen }) {
  const { t } = useI18n();
  const totalCols = days.length;
  // Position bar: start = applied day (appliedFromToday), end = checkAt (daysFromToday)
  const startIdx = Math.max(0, days.indexOf(ctrl.appliedFromToday));
  const endIdx = Math.max(startIdx + 1, days.indexOf(ctrl.daysFromToday) + 1);
  const leftPct = (startIdx / totalCols) * 100;
  const widthPct = ((endIdx - startIdx) / totalCols) * 100;

  const isDone = ctrl.daysFromToday < 0;
  const verdictColor = ctrl.verdict === 'ok' ? '#2ECC71' : ctrl.verdict === 'partial' ? '#E9A23B' : ctrl.verdict === 'no' ? '#E8504C' : null;

  return (
    <button className="ct-row" style={ctStyles.row} onClick={onOpen}>
      <div style={ctStyles.rowLabel}>
        <div style={ctStyles.rowTitle}>{ctrl.optionLabel}</div>
        <div style={ctStyles.rowSub}>{ctrl.blockTitle}</div>
      </div>
      <div className="ct-row-track-wrap" style={ctStyles.rowTrackWrap}>
        <div style={ctStyles.rowTrack}>
          {/* Today marker */}
          <div style={{ ...ctStyles.todayLine, left: `${(days.indexOf(0) / totalCols) * 100}%` }} />
          {/* Progress bar */}
          <div style={{
            ...ctStyles.bar,
            left: `${leftPct}%`,
            width: `${widthPct}%`,
            background: isDone ? 'rgba(154,166,184,.28)' : 'linear-gradient(90deg, rgba(46,204,113,.12), rgba(46,204,113,.28))',
            borderColor: isDone ? 'rgba(154,166,184,.5)' : 'rgba(46,204,113,.55)',
          }}>
            {/* Check marker — at the right edge */}
            <div style={{
              ...ctStyles.checkDot,
              background: verdictColor || '#2ECC71',
              boxShadow: isDone ? 'none' : '0 0 0 3px rgba(46,204,113,.18)',
            }}>
              {isDone && ctrl.verdict === 'ok' && <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5L20 7"/></svg>}
              {isDone && ctrl.verdict === 'partial' && <span style={{ color: '#fff', fontSize: 9, fontWeight: 700, lineHeight: 1 }}>~</span>}
              {isDone && ctrl.verdict === 'no' && <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>}
            </div>
          </div>
        </div>
      </div>
      <div className="ct-row-right" style={ctStyles.rowRight}>
        {isDone ? (
          <span style={{ ...ctStyles.verdictChip, color: verdictColor, borderColor: verdictColor + '40' }}>
            {ctrl.verdict === 'ok' ? t.ctrl_verdict_ok : ctrl.verdict === 'partial' ? t.ctrl_verdict_partial : t.ctrl_verdict_no}
          </span>
        ) : (
          <span style={ctStyles.etaChip}>{t.ctrl_check_on}: {t.ctrl_days_left(ctrl.daysFromToday)}</span>
        )}
      </div>
    </button>
  );
}

function ControlModal({ ctrl, onClose }) {
  const { t } = useI18n();
  const isDone = ctrl.daysFromToday < 0;
  const verdictColor = ctrl.verdict === 'ok' ? '#2ECC71' : ctrl.verdict === 'partial' ? '#E9A23B' : ctrl.verdict === 'no' ? '#E8504C' : '#6B7A8F';

  return (
    <div style={ctStyles.overlay} onClick={onClose}>
      <div className="ct-modal" style={ctStyles.modal} onClick={e => e.stopPropagation()}>
        <button style={ctStyles.modalClose} onClick={onClose}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>
        </button>

        <div style={ctStyles.modalTopline}>{ctrl.blockTitle}</div>
        <div style={ctStyles.modalHead}>{ctrl.optionLabel}</div>

        <div style={ctStyles.metaRow}>
          <div style={ctStyles.metaCell}>
            <div style={ctStyles.metaLabel}>{t.ctrl_applied_on}</div>
            <div style={ctStyles.metaValue}>{ctrl.appliedLabel}</div>
          </div>
          <div style={ctStyles.metaCell}>
            <div style={ctStyles.metaLabel}>{t.ctrl_check_on}</div>
            <div style={ctStyles.metaValue}>{ctrl.checkLabel}</div>
          </div>
        </div>

        <div style={ctStyles.whyBox}>
          <div style={ctStyles.whyLabel}>{t.ctrl_why}</div>
          <div style={ctStyles.whyText}>{ctrl.optionCons}</div>
        </div>

        {isDone && ctrl.before && ctrl.after && (
          <React.Fragment>
            <div style={ctStyles.barsLabel}>{t.ctrl_result}</div>
            <div className="ct-bars-row" style={ctStyles.barsRow}>
              <BarCompare label={t.ctrl_before} value={ctrl.before.value} unit={ctrl.before.unit} tone="neutral" />
              <div className="ct-arrow" style={ctStyles.arrow}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9AA6B8" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
              </div>
              <BarCompare label={t.ctrl_after} value={ctrl.after.value} unit={ctrl.after.unit} tone={ctrl.verdict === 'ok' ? 'good' : ctrl.verdict === 'no' ? 'bad' : 'neutral'} />
            </div>

            <div style={{ ...ctStyles.verdictBox, borderColor: verdictColor + '40', background: verdictColor + '10' }}>
              <div style={{ ...ctStyles.verdictHead, color: verdictColor }}>{t.ctrl_brain_verdict}</div>
              <div style={ctStyles.verdictBody}>{ctrl.brainVerdict}</div>
            </div>
          </React.Fragment>
        )}

        {!isDone && (
          <div style={ctStyles.pendingBox}>
            <div style={ctStyles.pendingTitle}>
              {t.ctrl_check_on}: {t.ctrl_days_left(ctrl.daysFromToday)} ({ctrl.checkLabel})
            </div>
            <div style={ctStyles.pendingBody}>
              {ctrl.pendingNote}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function BarCompare({ label, value, unit, tone }) {
  const color = tone === 'good' ? '#2ECC71' : tone === 'bad' ? '#E8504C' : '#6B7A8F';
  return (
    <div style={ctStyles.compareCell}>
      <div style={ctStyles.compareLabel}>{label}</div>
      <div style={{ ...ctStyles.compareValue, color }}>{value}</div>
      <div style={ctStyles.compareUnit}>{unit}</div>
    </div>
  );
}

const ctStyles = {
  page: { display: 'flex', flexDirection: 'column', height: '100%', gap: 14 },
  scroll: { flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 18, paddingBottom: 16 },
  empty: { background: 'var(--card)', border: '1px solid var(--hairline)', borderRadius: 12, padding: '32px 24px', color: 'var(--ink-3)', fontSize: 13, textAlign: 'center' },

  timeline: { background: 'var(--card)', border: '1px solid var(--hairline)', borderRadius: 12, padding: '14px 20px' },
  timelineRow: { display: 'flex', position: 'relative' },
  dayCell: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 },
  dayCellToday: { },
  dayCellPast: { opacity: 0.55 },
  dayLabel: { fontSize: 10.5, color: 'var(--ink-3)', fontFamily: 'JetBrains Mono, monospace', fontWeight: 500 },
  dayTick: { width: 1, height: 8, background: 'var(--hairline)' },

  section: { display: 'flex', flexDirection: 'column', gap: 6 },
  sectionHead: { display: 'flex', alignItems: 'center', gap: 8, padding: '0 4px 2px' },
  sectionDot: { width: 6, height: 6, borderRadius: 99 },
  sectionLabel: { fontSize: 11.5, color: 'var(--ink-2)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.6 },
  sectionCount: { fontSize: 11, color: 'var(--ink-4)', fontFamily: 'JetBrains Mono, monospace' },

  row: {
    display: 'grid', gridTemplateColumns: '240px 1fr 120px', gap: 14, alignItems: 'center',
    background: 'var(--card)', border: '1px solid var(--hairline)', borderRadius: 10,
    padding: '12px 16px', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit',
    transition: 'border-color .15s, box-shadow .15s',
  },
  rowLabel: { minWidth: 0 },
  rowTitle: { fontSize: 13, fontWeight: 600, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  rowSub: { fontSize: 11, color: 'var(--ink-3)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },

  rowTrackWrap: { position: 'relative' },
  rowTrack: { position: 'relative', height: 20, background: 'rgba(232,230,223,.5)', borderRadius: 99 },
  todayLine: { position: 'absolute', top: -4, bottom: -4, width: 2, background: '#1A3A5C', borderRadius: 2, zIndex: 1 },
  bar: {
    position: 'absolute', top: 2, bottom: 2,
    borderRadius: 99, border: '1px solid',
    display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 2,
  },
  checkDot: { width: 14, height: 14, borderRadius: 99, display: 'grid', placeItems: 'center', flexShrink: 0 },

  rowRight: { display: 'flex', justifyContent: 'flex-end' },
  verdictChip: { fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 99, border: '1px solid', background: '#fff' },
  etaChip: { fontSize: 11, color: 'var(--ink-2)', fontWeight: 500, padding: '4px 10px', borderRadius: 99, background: 'var(--hairline-2)', fontFamily: 'JetBrains Mono, monospace' },

  // Modal
  overlay: { position: 'fixed', inset: 0, background: 'rgba(14,27,44,.45)', display: 'grid', placeItems: 'center', zIndex: 60, animation: 'fadeIn .18s ease-out' },
  modal: {
    background: 'var(--card)', borderRadius: 16, width: 560, maxWidth: '92vw', maxHeight: '88vh', overflow: 'auto',
    padding: '24px 26px 22px', position: 'relative',
    boxShadow: '0 20px 60px rgba(14,27,44,.25)',
  },
  modalClose: { position: 'absolute', top: 14, right: 14, width: 26, height: 26, borderRadius: 7, border: '1px solid var(--hairline)', background: '#fff', display: 'grid', placeItems: 'center', color: 'var(--ink-3)', cursor: 'pointer' },
  modalTopline: { fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 600 },
  modalHead: { fontSize: 18, fontWeight: 600, color: 'var(--ink)', marginTop: 4, letterSpacing: -0.2 },

  metaRow: { display: 'flex', gap: 24, marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--hairline-2)' },
  metaCell: { flex: 1 },
  metaLabel: { fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 },
  metaValue: { fontSize: 13, color: 'var(--ink)', marginTop: 3, fontWeight: 500 },

  whyBox: { marginTop: 14, padding: '12px 14px', background: 'var(--canvas)', borderRadius: 10, border: '1px solid var(--hairline-2)' },
  whyLabel: { fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600, marginBottom: 4 },
  whyText: { fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.5 },

  barsLabel: { fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600, marginTop: 18, marginBottom: 8 },
  barsRow: { display: 'flex', alignItems: 'center', gap: 12 },
  compareCell: { flex: 1, padding: '14px 16px', background: 'var(--canvas)', borderRadius: 10, border: '1px solid var(--hairline-2)', textAlign: 'center' },
  compareLabel: { fontSize: 10.5, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 },
  compareValue: { fontSize: 26, fontWeight: 600, marginTop: 4, fontFamily: 'JetBrains Mono, monospace', letterSpacing: -0.5 },
  compareUnit: { fontSize: 11, color: 'var(--ink-3)', marginTop: 2 },
  arrow: { display: 'grid', placeItems: 'center', flexShrink: 0 },

  verdictBox: { marginTop: 14, padding: '12px 14px', borderRadius: 10, border: '1px solid' },
  verdictHead: { fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 },
  verdictBody: { fontSize: 13, color: 'var(--ink)', marginTop: 4, lineHeight: 1.5 },

  pendingBox: { marginTop: 14, padding: '14px 16px', borderRadius: 10, border: '1px solid rgba(46,204,113,.3)', background: 'rgba(46,204,113,.08)' },
  pendingTitle: { fontSize: 13, fontWeight: 600, color: 'var(--ink)' },
  pendingBody: { fontSize: 12.5, color: 'var(--ink-2)', marginTop: 4, lineHeight: 1.5 },
};

Object.assign(window, { ControlsPage });
