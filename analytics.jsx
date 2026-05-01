// Analytics page — each chart paired with a Brain insight panel (60/40).
// Insight panel contains headline, collegial explanation, action options with consequences,
// and a "Діяти" button that opens a confirmation dialog.
// Reuses chart primitives from dashboard-view.jsx.

function AnalyticsPage({ brainCard, onClearBrain, controls, onPushControl }) {
  const { t } = useI18n();
  const isEn = t === DICT.en;
  const [confirm, setConfirm] = React.useState(null); // {block, option}

  // Derive appliedFor from controls store (blockId -> applied option label, any status)
  const appliedFor = React.useMemo(() => {
    const m = {};
    controls.forEach(c => { m[c.blockId] = c.optionLabel; });
    return m;
  }, [controls]);

  const onAct = (block, option) => setConfirm({ block, option });
  const apply = () => {
    onPushControl({
      blockId: confirm.block.id,
      blockTitle: confirm.block.title,
      optionLabel: confirm.option.label,
      optionCons: confirm.option.cons,
    });
    setConfirm(null);
  };

  // Insight panels keyed by block
  const INSIGHTS = isEn ? {
    revHour: {
      id: 'revHour',
      headline: 'We have a gap between 15:00 and 17:00',
      body: 'Revenue drops to the day’s minimum here — it looks like we’re not working our afternoon traffic. The lunch peak and evening both look healthy, so this is a specific, fixable slot.',
      problem: true,
      options: [
        { label: 'Launch happy hour −15%', cons: 'Test for 2 weeks · est. +₴2 400/week · small margin hit on bar' },
        { label: 'Coffee & dessert promo', cons: 'Targets afternoon crowd · expected +8 orders/day' },
        { label: 'Leave it as is', cons: 'We stay at the current level · ~₴800/day missed' },
      ],
    },
    category: {
      id: 'category',
      headline: 'Kitchen and bar carry us; desserts are thin',
      body: 'Desserts give us only 7% of revenue, but margin is the highest in the menu. We’re leaving money on the table when we don’t upsell them.',
      problem: false,
      options: [
        { label: 'Add dessert prompt to waiter flow', cons: 'We test for 1 week · expected +12% dessert attach rate' },
        { label: 'Build a dessert + coffee combo', cons: 'Bundle at ₴180 · projected +18 desserts/day' },
      ],
    },
    topDishes: {
      id: 'topDishes',
      headline: 'Cheesecake is slipping',
      body: '32 views, only 4 sales. Either we’re not positioning it well, or the price is too high for our current audience. Nothing else in the top needs us right now.',
      problem: true,
      options: [
        { label: 'Cut price by ₴20 for 2 weeks', cons: 'We watch conversion · revert if nothing changes' },
        { label: 'Replace with seasonal tart', cons: 'Needs kitchen prep · ~3 day switch' },
        { label: 'Leave it, track another week', cons: 'No action · revisit next Tuesday' },
      ],
    },
    checkDyn: {
      id: 'checkDyn',
      headline: 'Our average check is slowly climbing',
      body: 'Up 12% over 30 days — we’re doing well on upsell. Today is slightly below trend, mostly because fewer guests ordered dessert. Nothing urgent.',
      problem: false,
      options: [
        { label: 'Celebrate with the team', cons: 'Short message at briefing · keeps momentum' },
      ],
    },
    kitchenSpeed: {
      id: 'kitchenSpeed',
      headline: 'Hot dishes are 48s slower than our norm',
      body: 'Not critical yet, but if the trend keeps going, guests will start noticing. Everything else is on target. Worth talking to Ihor about station setup.',
      problem: true,
      options: [
        { label: 'Talk to Ihor at end of shift', cons: 'No cost · we listen to his read first' },
        { label: 'Reorganize the hot station', cons: 'Half-day setup · expected −40s cycle time' },
        { label: 'Watch for another 3 days', cons: 'If it grows past 90s — we act immediately' },
      ],
    },
    turnover: {
      id: 'turnover',
      headline: 'Tables 9–12 are underused',
      body: 'These sit at 0.3 turnover while tables 1–4 hit 0.9. Likely a seating-priority issue — we can steer guests there on busy evenings.',
      problem: true,
      options: [
        { label: 'Change host seating priority', cons: 'Zero cost · expected +3 covers/night' },
        { label: 'Reconfigure the back room', cons: 'One evening closed · bigger upside' },
      ],
    },
  } : {
    revHour: {
      id: 'revHour',
      headline: 'У нас провал між 15:00 і 17:00',
      body: 'Виручка падає до мінімуму дня. Схоже, ми не працюємо з afternoon traffic. Обідній пік і вечір у нас здорові — це конкретний слот, який можна виправити.',
      problem: true,
      options: [
        { label: 'Запустити happy hour знижку 15%', cons: 'Тест 2 тижні · очік. +₴2 400/тижд · невелика просадка маржі на барі' },
        { label: 'Додати промо на каву і десерти', cons: 'Прицільно на денну аудиторію · очік. +8 замовлень/день' },
        { label: 'Нічого не змінювати', cons: 'Залишаємося на поточному рівні · різниця ~₴800/день' },
      ],
    },
    category: {
      id: 'category',
      headline: 'Кухня і бар тягнуть нас, десерти тонкі',
      body: 'Десерти дають нам тільки 7% виручки, але маржа тут найвища в меню. Коли ми їх не допродаємо — просто залишаємо гроші на столі.',
      problem: false,
      options: [
        { label: 'Додати підказку по десерту в скрипт офіціанта', cons: 'Тест 1 тиждень · очік. +12% до конверсії десертів' },
        { label: 'Зібрати комбо десерт + кава', cons: 'Бандл за ₴180 · прогноз +18 десертів/день' },
      ],
    },
    topDishes: {
      id: 'topDishes',
      headline: 'Чізкейк просідає',
      body: '32 перегляди, тільки 4 продажі. Ми або не просуваємо його правильно, або ціна висока для поточної аудиторії. Решта топу зараз не потребує уваги.',
      problem: true,
      options: [
        { label: 'Знизити на ₴20 на 2 тижні', cons: 'Дивимося на конверсію · відкат, якщо не змінюється' },
        { label: 'Замінити на сезонний тарт', cons: 'Потрібна підготовка кухні · ~3 дні на перехід' },
        { label: 'Залишити, поспостерігати ще тиждень', cons: 'Без дій · повернемося наступного вівторка' },
      ],
    },
    checkDyn: {
      id: 'checkDyn',
      headline: 'Наш середній чек повільно росте',
      body: '+12% за 30 днів — ми добре працюємо з допродажами. Сьогодні трохи нижче тренду, бо гості менше замовляли десерти. Нічого термінового.',
      problem: false,
      options: [
        { label: 'Відзначити команду на брифінгу', cons: 'Коротке повідомлення · підтримає темп' },
      ],
    },
    kitchenSpeed: {
      id: 'kitchenSpeed',
      headline: 'Гарячі страви виходять на 48 секунд повільніше за норму',
      body: 'Це поки некритично, але якщо тренд продовжиться — гості почнуть помічати. Усе інше в нормі. Варто поговорити з Ігорем про організацію стейшену.',
      problem: true,
      options: [
        { label: 'Поговорити з Ігорем після зміни', cons: 'Без витрат · спочатку слухаємо його думку' },
        { label: 'Перебудувати гарячий стейшен', cons: 'Пів дня на переналаштування · очік. −40с цикл' },
        { label: 'Поспостерігати ще 3 дні', cons: 'Якщо виросте понад 90с — діємо одразу' },
      ],
    },
    turnover: {
      id: 'turnover',
      headline: 'Столики 9–12 недовикористовуємо',
      body: 'У нас там оборот 0.3, а на столиках 1–4 — 0.9. Схоже на проблему пріоритету посадки — можемо спрямовувати туди гостей у завантажені вечори.',
      problem: true,
      options: [
        { label: 'Змінити пріоритет посадки у хостес', cons: 'Нуль витрат · очік. +3 посадки/вечір' },
        { label: 'Перепланувати дальню залу', cons: 'Один вечір закрита · більший апсайд' },
      ],
    },
  };

  const cards = [
    { id: 'revHour',     chart: <HourlyChart />,       insight: INSIGHTS.revHour },
    { id: 'category',    chart: <CategorySplit />,     insight: INSIGHTS.category },
    { id: 'topDishes',   chart: <TopDishes />,         insight: INSIGHTS.topDishes },
    { id: 'checkDyn',    chart: <CheckDynamics />,     insight: INSIGHTS.checkDyn },
    { id: 'kitchenSpeed',chart: <KitchenSpeed />,      insight: INSIGHTS.kitchenSpeed },
    { id: 'turnover',    chart: <TurnoverHeatmap />,   insight: INSIGHTS.turnover },
  ];

  // Chat-routed: show ONE focused block keyed by brainCard.kind
  const focusMap = { revenue: 'revHour', top: 'topDishes', problems: 'kitchenSpeed', critical: 'kitchenSpeed', day: 'revHour', compare: 'revHour', staff: 'turnover' };
  const focusedId = brainCard ? focusMap[brainCard.kind] : null;
  const focused = focusedId ? cards.find(c => c.id === focusedId) : null;

  return (
    <div style={anStyles.page}>
      <style>{`
        .block-chart > div {
          background: transparent !important;
          border: 0 !important;
          border-radius: 0 !important;
          box-shadow: none !important;
          padding: 18px 22px !important;
          width: 100%;
        }
      `}</style>
      <PageHead title={t.a_title} sub={t.a_sub} />
      <div style={anStyles.scroll}>
        {brainCard && focused && (
          <div style={anStyles.focusWrap}>
            <div style={anStyles.focusBadgeRow}>
              <span style={anStyles.focusBadge}>{t.a_ai_label}</span>
              <span style={anStyles.brainQuery}>«{brainCard.query}»</span>
              <button style={anStyles.brainClose} onClick={onClearBrain} title="×">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>
              </button>
            </div>
            <InsightBlock
              chart={focused.chart}
              insight={focused.insight}
              applied={appliedFor[focused.id]}
              onAct={(opt) => onAct({ id: focused.id, title: focused.insight.headline }, opt)}
              expanded
            />
          </div>
        )}
        {!brainCard && (
          <div style={anStyles.stack}>
            {cards.map(c => (
              <InsightBlock
                key={c.id}
                chart={c.chart}
                insight={c.insight}
                applied={appliedFor[c.id]}
                onAct={(opt) => onAct({ id: c.id, title: c.insight.headline }, opt)}
              />
            ))}
          </div>
        )}
      </div>
      {confirm && (
        <ConfirmDialog
          block={confirm.block}
          option={confirm.option}
          onCancel={() => setConfirm(null)}
          onApply={apply}
        />
      )}
    </div>
  );
}

function InsightBlock({ chart, insight, onAct, applied, expanded }) {
  const { t } = useI18n();
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 480;
  const [showOpts, setShowOpts] = React.useState(!isMobile);
  return (
    <div className={'an-block-card' + (showOpts ? '' : ' an-options-collapsed')}
      style={{ ...anStyles.blockCard, ...(insight.problem ? anStyles.blockCardProblem : {}) }}>
      <div style={anStyles.blockChart} className="block-chart an-block-chart">{chart}</div>
      <div className="an-block-divider" style={anStyles.blockDivider} />
      <div className="an-insight-col" style={{ ...anStyles.insightCol, ...(expanded ? anStyles.insightExpanded : {}) }}>
        <div style={anStyles.insightHead}>
          <span style={anStyles.brainChip}>
            <svg width="10" height="10" viewBox="0 0 32 32" fill="none">
              <defs>
                <linearGradient id={'ib' + insight.id} x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#6DE3A9"/><stop offset="1" stopColor="#2ECC71"/>
                </linearGradient>
              </defs>
              <path d="M14 5c-2.5 0-4.3 1.6-4.6 3.6C7.4 9 6 10.5 6 12.4c0 1 .4 1.9 1 2.6-.9.7-1.5 1.8-1.5 3 0 1.8 1.2 3.3 2.8 3.7.3 2 2.1 3.5 4.2 3.5 1 0 2-.3 2.7-.9V5.4c-.3 0-.6 0-1-.4z" fill={'url(#ib' + insight.id + ')'} opacity=".9"/>
              <path d="M18 5c2.5 0 4.3 1.6 4.6 3.6 2 .4 3.4 1.9 3.4 3.8 0 1-.4 1.9-1 2.6.9.7 1.5 1.8 1.5 3 0 1.8-1.2 3.3-2.8 3.7-.3 2-2.1 3.5-4.2 3.5-1 0-2-.3-2.7-.9V5.4c.3 0 .6 0 1-.4z" fill={'url(#ib' + insight.id + ')'}/>
            </svg>
            {t.brain_speaks}
          </span>
          {insight.problem && <span style={anStyles.problemTag}>!</span>}
        </div>
        <div style={anStyles.insightHeadline}>{insight.headline}</div>
        <div style={anStyles.insightBody}>{insight.body}</div>
        {insight.options && insight.options.length > 0 && (
          <>
            <div style={anStyles.optionsLabel}>
              {t.options}
              {isMobile && (
                <button onClick={() => setShowOpts(s => !s)} style={anStyles.optsMobileToggle}>
                  {showOpts ? (t === DICT.en ? 'Hide' : 'Сховати') : (t === DICT.en ? 'Show options' : 'Показати варіанти')}
                </button>
              )}
            </div>
            <div className="an-options-list" style={anStyles.optionsList}>
              {insight.options.map((o, i) => (
                <InsightOption key={i} option={o} onAct={() => onAct(o)} applied={applied === o.label} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function InsightOption({ option, onAct, applied }) {
  const { t } = useI18n();
  return (
    <div style={anStyles.option}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={anStyles.optLabel}>{option.label}</div>
        <div style={anStyles.optCons}>{option.cons}</div>
      </div>
      {applied ? (
        <span style={anStyles.appliedChip}>✓ {t.act_applied}</span>
      ) : (
        <button style={anStyles.actBtn} onClick={onAct}>{t.act_btn}</button>
      )}
    </div>
  );
}

function ConfirmDialog({ block, option, onCancel, onApply }) {
  const { t } = useI18n();
  return (
    <div style={anStyles.dialogOverlay} onClick={onCancel}>
      <div style={anStyles.dialog} onClick={e => e.stopPropagation()}>
        <div style={anStyles.dialogTitle}>{t.act_confirm}</div>
        <div style={anStyles.dialogBlock}>{block.title}</div>
        <div style={anStyles.dialogOpt}>{option.label}</div>
        <div style={anStyles.dialogCons}>{option.cons}</div>
        <div style={anStyles.dialogActions}>
          <button style={anStyles.btnGhost} onClick={onCancel}>{t.act_cancel}</button>
          <button style={anStyles.btnPrimary} onClick={onApply}>{t.act_apply}</button>
        </div>
      </div>
    </div>
  );
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
        {data.kind === 'critical' && <ProblemsList />}
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

// CheckDynamics, KitchenSpeed, TurnoverHeatmap — kept from previous version
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

function TurnoverHeatmap() {
  const { t } = useI18n();
  const isEn = t === DICT.en;
  const tables = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const hours = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];
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
      <div style={{ display: 'grid', gridTemplateColumns: '50px repeat(' + hours.length + ', 1fr)', gap: 3, fontSize: 10 }}>
        <div />
        {hours.map(h => <div key={h} style={{ textAlign: 'center', color: 'var(--ink-3)', fontFamily: 'JetBrains Mono, monospace' }}>{h}</div>)}
        {tables.map((tbl, ti) => (
          <React.Fragment key={tbl}>
            <div style={{ color: 'var(--ink-3)', fontSize: 10.5, paddingRight: 6, textAlign: 'right' }}>{isEn ? 'T' : 'Ст.'}{tbl}</div>
            {hours.map((_, hi) => {
              const v = getVal(ti, hi);
              return (
                <div key={hi} style={{
                  height: 18, borderRadius: 3,
                  background: `rgba(46,204,113,${0.08 + v * 0.8})`,
                  border: v > 0.7 ? '1px solid #2ECC71' : 'none',
                }} title={`${(v * 4).toFixed(1)} ${isEn ? 'turns' : 'обертань'}`} />
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

const anStyles = {
  page: { display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, gap: 16, animation: 'fadeIn .25s ease-out' },
  scroll: { flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: 2, paddingBottom: 4 },
  stack: { display: 'flex', flexDirection: 'column', gap: 20, paddingBottom: 20 },

  // Unified card: chart + insight share one container, equal width
  blockCard: {
    display: 'grid',
    gridTemplateColumns: '60fr 1px 40fr',
    background: 'var(--card)',
    border: '1px solid var(--hairline)',
    borderRadius: 14,
    boxShadow: '0 1px 2px rgba(14,27,44,.03)',
    overflow: 'hidden',
    minWidth: 0,
  },
  blockCardProblem: {
    borderColor: '#F4B5A6',
    boxShadow: '0 1px 2px rgba(14,27,44,.03), 0 0 0 1px rgba(244,181,166,.3)',
  },
  blockChart: {
    minWidth: 0,
    display: 'flex',
    // Flatten inner chart: remove its card-within-card chrome
    // (chart components use dvStyles.chart which has its own border/bg/radius)
  },
  blockDivider: {
    background: 'var(--hairline-2)',
  },
  insightCol: {
    background: '#FBFAF7',
    padding: '18px 20px',
    display: 'flex', flexDirection: 'column', gap: 10,
    minWidth: 0,
  },
  insightExpanded: { padding: '22px 26px' },
  insightHead: { display: 'flex', alignItems: 'center', gap: 8 },
  brainChip: {
    display: 'inline-flex', alignItems: 'center', gap: 5,
    fontSize: 10, fontWeight: 700, color: 'var(--green-deep)',
    textTransform: 'uppercase', letterSpacing: .5,
    background: 'var(--green-soft)', padding: '3px 8px', borderRadius: 99,
  },
  problemTag: {
    display: 'inline-grid', placeItems: 'center',
    width: 18, height: 18, borderRadius: 99,
    background: 'var(--amber)', color: '#fff',
    fontSize: 11, fontWeight: 800,
    marginLeft: 'auto',
  },
  insightHeadline: { fontSize: 14.5, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.35 },
  insightBody: { fontSize: 12.5, color: 'var(--ink-2)', lineHeight: 1.55 },
  optionsLabel: {
    fontSize: 10, fontWeight: 700, color: 'var(--ink-3)',
    textTransform: 'uppercase', letterSpacing: .5,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
  },
  optsMobileToggle: {
    fontSize: 11, fontWeight: 600, color: 'var(--navy)',
    background: 'transparent', border: '1px solid var(--hairline)', borderRadius: 6,
    padding: '3px 8px', cursor: 'pointer', textTransform: 'none', letterSpacing: 0,
    fontFamily: 'inherit',
  },
  optionsList: { display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 },
  option: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '8px 10px',
    background: '#fff',
    border: '1px solid var(--hairline-2)',
    borderRadius: 8,
  },
  optLabel: { fontSize: 12.5, fontWeight: 500, color: 'var(--ink)' },
  optCons: { fontSize: 11, color: 'var(--ink-3)', marginTop: 2, lineHeight: 1.4 },
  actBtn: {
    background: 'var(--navy)', color: '#fff',
    border: 'none', padding: '6px 12px', borderRadius: 6,
    fontSize: 11.5, fontWeight: 600, cursor: 'pointer',
    fontFamily: 'inherit', flexShrink: 0,
  },
  appliedChip: {
    fontSize: 10.5, fontWeight: 700, color: 'var(--green-deep)',
    background: 'var(--green-soft)', padding: '4px 8px', borderRadius: 99,
    textTransform: 'uppercase', letterSpacing: .3, flexShrink: 0,
  },

  // Confirmation dialog
  dialogOverlay: {
    position: 'fixed', inset: 0, background: 'rgba(14,27,44,.4)',
    display: 'grid', placeItems: 'center', zIndex: 100,
    animation: 'fadeIn .15s ease-out',
  },
  dialog: {
    background: 'var(--card)', borderRadius: 14,
    padding: '22px 24px 20px',
    width: 'min(420px, 92vw)',
    boxShadow: '0 24px 60px rgba(14,27,44,.25)',
    border: '1px solid var(--hairline)',
  },
  dialogTitle: { fontSize: 11, fontWeight: 700, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: .5 },
  dialogBlock: { fontSize: 12.5, color: 'var(--ink-2)', marginTop: 10, fontStyle: 'italic' },
  dialogOpt: { fontSize: 16, fontWeight: 600, color: 'var(--ink)', marginTop: 12, lineHeight: 1.35 },
  dialogCons: { fontSize: 12.5, color: 'var(--ink-3)', marginTop: 8, lineHeight: 1.5 },
  dialogActions: { display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 22 },
  btnGhost: {
    padding: '9px 16px', borderRadius: 8,
    background: 'transparent', border: '1px solid var(--hairline)',
    color: 'var(--ink-2)', fontSize: 13, fontWeight: 500,
    cursor: 'pointer', fontFamily: 'inherit',
  },
  btnPrimary: {
    padding: '9px 18px', borderRadius: 8,
    background: 'var(--navy)', border: 'none',
    color: '#fff', fontSize: 13, fontWeight: 600,
    cursor: 'pointer', fontFamily: 'inherit',
  },

  // Brain-generated (from chat) card
  brainCard: {
    position: 'relative',
    border: '1px solid transparent',
    borderRadius: 16,
    background: 'linear-gradient(#FBFAF7,#FBFAF7) padding-box, linear-gradient(135deg,#6DE3A9,#2ECC71,#3D7FD1) border-box',
    padding: 18,
    marginBottom: 16,
    boxShadow: '0 6px 20px rgba(46,204,113,.08)',
  },
  brainBadgeRow: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 },
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
