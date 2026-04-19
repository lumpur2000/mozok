// Dashboard View — analytics dashboard shown when an analytical query is sent.
// Query shape picks which dashboard to render.

function MiniSparkline({ data, color = '#2ECC71', width = 92, height = 28 }) {
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const step = width / (data.length - 1);
  const pts = data.map((v, i) => [i * step, height - ((v - min) / range) * (height - 4) - 2]);
  const d = pts.map((p, i) => (i === 0 ? 'M' : 'L') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  const area = d + ` L${width},${height} L0,${height} Z`;
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <path d={area} fill={color} opacity=".12" />
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// Hourly revenue bar chart
function HourlyChart() {
  const { t } = useI18n();
  const isEn = t === DICT.en;
  const hours = [
    { h: '10', v: 380 },   { h: '11', v: 820 },   { h: '12', v: 1420 },
    { h: '13', v: 2280 },  { h: '14', v: 2610 },  { h: '15', v: 1840 },
    { h: '16', v: 1220 },  { h: '17', v: 1530 },  { h: '18', v: 2200 },
    { h: '19', v: 0, projected: 2600 }, { h: '20', v: 0, projected: 2400 },
    { h: '21', v: 0, projected: 1800 },
  ];
  const max = Math.max(...hours.map(h => Math.max(h.v, h.projected || 0)));
  return (
    <div style={dvStyles.chart}>
      <div style={dvStyles.chartHead}>
        <div style={dvStyles.chartTitle}>{isEn ? 'Revenue by hour' : 'Виручка по годинах'}</div>
        <div style={dvStyles.chartLegend}>
          <span style={dvStyles.legItem}><span style={{ ...dvStyles.legSwatch, background: '#2ECC71' }} /> {isEn ? 'actual' : 'факт'}</span>
          <span style={dvStyles.legItem}><span style={{ ...dvStyles.legSwatch, background: '#2ECC71', opacity: .25, border: '1px dashed #2ECC71' }} /> {isEn ? 'forecast' : 'прогноз'}</span>
        </div>
      </div>
      <div style={dvStyles.barsWrap}>
        {hours.map((h, i) => {
          const actualPct = (h.v / max) * 100;
          const projPct = h.projected ? (h.projected / max) * 100 : 0;
          return (
            <div key={i} style={dvStyles.barCol}>
              <div style={dvStyles.barStack}>
                {h.projected > 0 && (
                  <div style={{ ...dvStyles.bar, height: projPct + '%', background: 'rgba(46,204,113,.18)', border: '1px dashed #6DE3A9' }} />
                )}
                {h.v > 0 && (
                  <div style={{ ...dvStyles.bar, height: actualPct + '%', background: 'linear-gradient(180deg,#2ECC71,#1FA85B)' }} />
                )}
              </div>
              <div style={dvStyles.barLabel}>{h.h}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Category donut
function CategorySplit() {
  const { t, moneyK, sym, money } = useI18n();
  const isEn = t === DICT.en;
  const cats = [
    { name: isEn ? 'Kitchen' : 'Кухня', value: 7300, pct: 49, color: '#2ECC71' },
    { name: isEn ? 'Bar' : 'Бар', value: 5800, pct: 39, color: '#3D7FD1' },
    { name: isEn ? 'Desserts' : 'Десерти', value: 1020, pct: 7, color: '#E9A23B' },
    { name: isEn ? 'Other' : 'Інше', value: 700, pct: 5, color: '#7B61E3' },
  ];
  let acc = 0;
  const R = 52, C = 2 * Math.PI * R;
  return (
    <div style={dvStyles.chart}>
      <div style={dvStyles.chartHead}>
        <div style={dvStyles.chartTitle}>{isEn ? 'By category' : 'За категоріями'}</div>
        <div style={dvStyles.chartSub}>{money(14820)}</div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <svg width="140" height="140" viewBox="-70 -70 140 140" style={{ flexShrink: 0 }}>
          <circle r={R} fill="none" stroke="#F3F1EA" strokeWidth="14" />
          {cats.map((c, i) => {
            const len = (c.pct / 100) * C;
            const seg = <circle key={i} r={R} fill="none" stroke={c.color} strokeWidth="14"
              strokeDasharray={`${len} ${C - len}`}
              strokeDashoffset={-acc}
              transform="rotate(-90)"
              strokeLinecap="butt" />;
            acc += len;
            return seg;
          })}
          <text x="0" y="-4" textAnchor="middle" fontSize="10" fill="var(--ink-3)" fontFamily="Inter">{isEn ? 'margin' : 'маржа'}</text>
          <text x="0" y="14" textAnchor="middle" fontSize="18" fontWeight="600" fill="var(--ink)" fontFamily="Inter">31%</text>
        </svg>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {cats.map(c => (
            <div key={c.name} style={dvStyles.catRow}>
              <span style={{ ...dvStyles.catSwatch, background: c.color }} />
              <span style={dvStyles.catName}>{c.name}</span>
              <span style={dvStyles.catPct}>{c.pct}%</span>
              <span style={dvStyles.catVal}>{sym}{moneyK(c.value)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Comparison table
function CompareRow({ rows }) {
  return (
    <div style={dvStyles.chart}>
      <div style={dvStyles.chartHead}>
        <div style={dvStyles.chartTitle}>Порівняння з минулим вівторком</div>
        <div style={dvStyles.chartSub}>на цей час · 14:37</div>
      </div>
      <div style={dvStyles.cmpGrid}>
        {rows.map((r, i) => (
          <div key={i} style={dvStyles.cmpCell}>
            <div style={dvStyles.cmpLbl}>{r.label}</div>
            <div style={dvStyles.cmpValRow}>
              <div style={dvStyles.cmpA}>{r.a}</div>
              <div style={{ ...dvStyles.cmpDelta, color: r.up ? 'var(--green-deep)' : 'var(--red)' }}>
                {r.up ? <Icons.ArrowUp size={11} /> : <Icons.ArrowDown size={11} />}
                {r.delta}
              </div>
            </div>
            <div style={dvStyles.cmpB}>було {r.b}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Top dishes table
function TopDishes() {
  const { t, moneyK, sym } = useI18n();
  const isEn = t === DICT.en;
  const dishes = [
    { name: 'Бургер «Мозок»',  count: 18, rev: 3780, trend: [10,12,14,13,15,17,18], up: true,  margin: 42 },
    { name: 'Том Ям',          count: 14, rev: 2380, trend: [8,9,10,11,12,13,14],   up: true,  margin: 38 },
    { name: 'Цезар з куркою',  count: 11, rev: 1870, trend: [14,13,12,13,12,11,11], up: false, margin: 45 },
    { name: 'Паста Карбонара', count: 9,  rev: 1620, trend: [7,8,9,8,9,9,9],        up: true,  margin: 35 },
    { name: 'Піца 4 Сири',     count: 7,  rev: 1540, trend: [9,8,8,7,7,7,7],        up: false, margin: 48 },
    { name: 'Чізкейк',         count: 4,  rev: 560,  trend: [8,7,6,5,5,4,4],        up: false, margin: 52 },
  ];
  return (
    <div style={dvStyles.chart}>
      <div style={dvStyles.chartHead}>
        <div style={dvStyles.chartTitle}>{isEn ? 'Top dishes today' : 'Топ страв сьогодні'}</div>
        <a style={dvStyles.chartLink}>{isEn ? 'all →' : 'всі →'}</a>
      </div>
      <div style={dvStyles.dishHead}>
        <span>Страва</span>
        <span style={{ textAlign: 'right' }}>Шт</span>
        <span style={{ textAlign: 'right' }}>Виручка</span>
        <span style={{ textAlign: 'center' }}>7 днів</span>
        <span style={{ textAlign: 'right' }}>Маржа</span>
      </div>
      {dishes.map((d, i) => (
        <div key={i} style={dvStyles.dishRow}>
          <div style={dvStyles.dishName}>
            <span style={dvStyles.dishRank}>{i + 1}</span>
            {d.name}
          </div>
          <span style={dvStyles.dishNum}>{d.count}</span>
          <span style={dvStyles.dishNum}>{sym}{moneyK(d.rev)}</span>
          <span style={{ justifySelf: 'center' }}>
            <MiniSparkline data={d.trend} color={d.up ? '#2ECC71' : '#E8504C'} width={60} height={18} />
          </span>
          <span style={{ ...dvStyles.dishNum, color: d.margin > 40 ? 'var(--green-deep)' : 'var(--ink-2)' }}>{d.margin}%</span>
        </div>
      ))}
    </div>
  );
}

// Problems list
function ProblemsList() {
  const { t } = useI18n();
  const isEn = t === DICT.en;
  const items = isEn ? [
    { sev: 'red',   t: 'Tom Yum · table 7', m: 'Waiting for waiter 3+ min after ready', age: '3 min' },
    { sev: 'red',   t: 'POS terminal #2',  m: 'Offline, orders going through POS #1', age: '14 min' },
    { sev: 'amber', t: 'Salmon',           m: 'On stop-list — affects 6 menu items', age: '42 min' },
    { sev: 'amber', t: 'Maryna',           m: 'Late for 13:00 shift',                   age: '12 min' },
  ] : [
    { sev: 'red',   t: 'Том Ям · столик 7', m: 'Очікує офіціанта 3+ хв після готовності', age: '3 хв' },
    { sev: 'red',   t: 'Термінал POS #2',   m: 'Оффлайн, замовлення приймає POS #1', age: '14 хв' },
    { sev: 'amber', t: 'Лосось с/с',        m: 'У стоп-листі — впливає на 6 позицій меню', age: '42 хв' },
    { sev: 'amber', t: 'Марина',             m: 'Запізнюється на зміну 13:00',               age: '12 хв' },
  ];
  const cmap = { red: { c: '#E8504C', bg: '#FCE9E8' }, amber: { c: '#E9A23B', bg: '#FCF1DF' } };
  return (
    <div style={dvStyles.chart}>
      <div style={dvStyles.chartHead}>
        <div style={dvStyles.chartTitle}>{isEn ? 'Active issues' : 'Активні проблеми'}</div>
        <span style={dvStyles.countChip}>{items.length}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((it, i) => {
          const s = cmap[it.sev];
          return (
            <div key={i} style={{ ...dvStyles.probRow, borderLeft: `3px solid ${s.c}` }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={dvStyles.probTitle}>{it.t}</div>
                <div style={dvStyles.probMeta}>{it.m}</div>
              </div>
              <span style={{ ...dvStyles.probAge, background: s.bg, color: s.c }}>{it.age}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Staff list
function StaffList() {
  const { t } = useI18n();
  const isEn = t === DICT.en;
  const staff = isEn ? [
    { name: 'Iryna Koval',     role: 'Bar',     status: 'on', since: '4 h',  orders: 22 },
    { name: 'Oleksandr Petryk',role: 'Floor',   status: 'on', since: '4 h',  orders: 18 },
    { name: 'Ihor Sydor',      role: 'Bar',     status: 'on', since: '2 h',  orders: 11 },
    { name: 'Maryna Lysenko',  role: 'Floor',   status: 'late', since: '—', orders: 0 },
    { name: 'Taras Bondar',    role: 'Kitchen', status: 'on', since: '6 h',  orders: 34 },
    { name: 'Olena Moroz',     role: 'Kitchen', status: 'break', since: '15 min', orders: 0 },
  ] : [
    { name: 'Ірина Коваль',     role: 'Бар',       status: 'on', since: '4 год', orders: 22 },
    { name: 'Олександр Петрик', role: 'Зал',       status: 'on', since: '4 год', orders: 18 },
    { name: 'Ігор Сидор',       role: 'Бар',       status: 'on', since: '2 год', orders: 11 },
    { name: 'Марина Лисенко',   role: 'Зал',       status: 'late', since: '—',   orders: 0 },
    { name: 'Тарас Бондар',     role: 'Кухня',     status: 'on', since: '6 год', orders: 34 },
    { name: 'Олена Мороз',      role: 'Кухня',     status: 'break', since: '15 хв', orders: 0 },
  ];
  const smap = isEn ? {
    on:    { c: 'var(--green-deep)', bg: 'var(--green-soft)', label: 'on shift' },
    late:  { c: '#A93A37',           bg: 'var(--red-soft)',   label: 'late' },
    break: { c: '#8C5A14',           bg: 'var(--amber-soft)', label: 'break' },
  } : {
    on:    { c: 'var(--green-deep)', bg: 'var(--green-soft)', label: 'на зміні' },
    late:  { c: '#A93A37',           bg: 'var(--red-soft)',   label: 'запізнюється' },
    break: { c: '#8C5A14',           bg: 'var(--amber-soft)', label: 'перерва' },
  };
  return (
    <div style={dvStyles.chart}>
      <div style={dvStyles.chartHead}>
        <div style={dvStyles.chartTitle}>{isEn ? 'Staff on shift' : 'Персонал на зміні'}</div>
        <span style={dvStyles.countChip}>{isEn ? '6 of 8' : '6 з 8'}</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {staff.map((s, i) => {
          const st = smap[s.status];
          return (
            <div key={i} style={dvStyles.staffRow}>
              <div style={dvStyles.staffAvatar}>{s.name[0]}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={dvStyles.staffName}>{s.name}</div>
                <div style={dvStyles.staffRole}>{s.role} · {s.since}</div>
              </div>
              <span style={dvStyles.staffOrders}>{s.orders} {isEn ? 'ord.' : 'зам.'}</span>
              <span style={{ ...dvStyles.staffStatus, background: st.bg, color: st.c }}>{st.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Day summary — KPI grid + highlights + lowlights
function DaySummary() {
  const { t, money, sym } = useI18n();
  const isEn = t === DICT.en;
  const rows = [
    { label: isEn ? 'Revenue' : 'Виручка',    v: money(14820),  d: '+12%', up: true },
    { label: isEn ? 'Orders' : 'Замовлень',  v: '47',       d: '+6',   up: true },
    { label: isEn ? 'Avg check' : 'Сер. чек',   v: money(315),  d: isEn ? `-${sym}8` : '-₴8',  up: false },
    { label: isEn ? 'Tables' : 'Столики',    v: '8/12',     d: '+2',   up: true },
    { label: 'NPS',        v: '4.7',      d: '+0.2', up: true },
    { label: isEn ? 'Kitchen time' : 'Час кухні',  v: '7:42',     d: '-0:18', up: true },
  ];
  return (
    <div style={dvStyles.chart}>
      <div style={dvStyles.chartHead}>
        <div style={dvStyles.chartTitle}>{isEn ? 'Key metrics of the day' : 'Ключові показники дня'}</div>
        <div style={dvStyles.chartSub}>{isEn ? 'as of 14:37' : 'станом на 14:37'}</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
        {rows.map((r, i) => (
          <div key={i} style={dvStyles.cmpCell}>
            <div style={dvStyles.cmpLbl}>{r.label}</div>
            <div style={dvStyles.cmpValRow}>
              <div style={{ ...dvStyles.cmpA, fontSize: 18 }}>{r.v}</div>
            </div>
            <div style={{ ...dvStyles.cmpDelta, color: r.up ? 'var(--green-deep)' : 'var(--red)', marginTop: 2 }}>
              {r.up ? <Icons.ArrowUp size={11} /> : <Icons.ArrowDown size={11} />}{r.d}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Highlights() {
  const { t } = useI18n();
  const isEn = t === DICT.en;
  const wins = isEn ? [
    { t: 'Bar overperformed plan by 42%', m: 'Cocktail menu — esp. Aperol Spritz (+18 portions)' },
    { t: 'Average kitchen time dropped', m: 'By 18 seconds vs. average — KDS effect' },
    { t: 'Returning visits: 31%', m: 'Recognized 14 guests from loyalty program' },
  ] : [
    { t: 'Бар перевиконав план на 42%', m: 'Коктейльне меню · особливо Апероль Шприц (+18 порцій)' },
    { t: 'Середній час кухні скоротився', m: 'На 18 секунд vs. середнє — ефект від нового KDS' },
    { t: 'Повторні візити: 31%', m: 'Впізнали 14 гостей із програми лояльності' },
  ];
  const losses = isEn ? [
    { t: 'Avg check dropped', m: 'Guests ordered fewer desserts (-18% to plan)' },
    { t: 'Terminal #2 offline 14 min', m: 'Tech issue · 3 orders delayed' },
    { t: 'Salmon on stop-list since 13:55', m: 'Affects 6 items' },
  ] : [
    { t: 'Середній чек знизився на ₴8', m: 'Гості рідше замовляли десерти (-18% до плану)' },
    { t: 'Термінал #2 простояв 14 хв', m: 'Технічний збій · 3 замовлення прийшли із затримкою' },
    { t: 'Лосось у стоп-листі з 13:55', m: 'Впливає на 6 позицій · ₴420 упущеної виручки' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
      <div style={dvStyles.chart}>
        <div style={dvStyles.chartHead}>
          <div style={{ ...dvStyles.chartTitle, color: 'var(--green-deep)' }}>{isEn ? '✓ Wins of the day' : '✓ Перемоги дня'}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {wins.map((w, i) => (
            <div key={i} style={{ ...dvStyles.probRow, borderLeft: '3px solid var(--green)' }}>
              <div style={{ flex: 1 }}>
                <div style={dvStyles.probTitle}>{w.t}</div>
                <div style={dvStyles.probMeta}>{w.m}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={dvStyles.chart}>
        <div style={dvStyles.chartHead}>
          <div style={{ ...dvStyles.chartTitle, color: '#A93A37' }}>{isEn ? '! Needs attention' : '! Що варто покращити'}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {losses.map((w, i) => (
            <div key={i} style={{ ...dvStyles.probRow, borderLeft: '3px solid var(--red)' }}>
              <div style={{ flex: 1 }}>
                <div style={dvStyles.probTitle}>{w.t}</div>
                <div style={dvStyles.probMeta}>{w.m}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Recommendations() {
  const { t } = useI18n();
  const isEn = t === DICT.en;
  const recs = [
    { priority: 'Високий',  impact: '+₴2 800/тижд', title: 'Підняти ціну на Том Ям на 8%',
      body: 'Попит стабільний при +10%, еластичність низька. Рекомендую ₴170 → ₴184. Прогноз: +18 порцій/тижд × ₴14 маржі.',
      confidence: 86 },
    { priority: 'Високий',  impact: '+₴1 400/тижд', title: 'Замінити Чізкейк на сезонний десерт',
      body: 'Конверсія 12.5% (32 переглядів, 4 продажі). Медіанна по категорії — 34%. Запропонувати ягідний тарт.',
      confidence: 74 },
    { priority: 'Середній', impact: '-5 хв очік.',  title: 'Додати офіціанта у зал на 19:00–21:30',
      body: 'Очікуваний пік +24% до середи. При поточних 2 офіціантах очікування гостей зросте до 18 хв.',
      confidence: 92 },
    { priority: 'Середній', impact: '+8% маржа',    title: 'Перейти на ТОВ «Свіжий улов» для лосося',
      body: 'Поточний постачальник підняв ціну тричі за 3 міс. Альтернатива на 12% дешевша, якість аналогічна.',
      confidence: 68 },
    { priority: 'Низький',  impact: '+NPS 0.3',     title: 'Додати безкоштовний хліб до супів',
      body: 'У 4 відгуках згадувалось. Вартість ~₴6/порція, впливає на сприйняття ціни.',
      confidence: 55 },
  ];
  const pmap = {
    'Високий':  { c: '#A93A37', bg: 'var(--red-soft)' },
    'Середній': { c: '#8C5A14', bg: 'var(--amber-soft)' },
    'Низький':  { c: 'var(--ink-3)', bg: '#F3F1EA' },
  };
  return (
    <div style={dvStyles.chart}>
      <div style={dvStyles.chartHead}>
        <div style={dvStyles.chartTitle}>{isEn ? 'Brain recommendations' : 'Рекомендації Мозку'}</div>
        <span style={dvStyles.countChip}>{recs.length}</span>
        <div style={dvStyles.chartSub}>{isEn ? 'based on 7 days · updated 14:30' : 'на основі 7 днів · оновлено о 14:30'}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {recs.map((r, i) => {
          const p = pmap[r.priority];
          return (
            <div key={i} style={{ ...dvStyles.probRow, alignItems: 'flex-start', padding: '14px 16px', borderLeft: '3px solid ' + p.c, flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}>
                <span style={{ ...dvStyles.probAge, background: p.bg, color: p.c }}>{r.priority}</span>
                <span style={{ ...dvStyles.probAge, background: 'var(--green-soft)', color: 'var(--green-deep)' }}>{r.impact}</span>
                <span style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--ink-3)', fontFamily: 'JetBrains Mono, monospace' }}>
                  {isEn ? 'confidence' : 'впевненість'} {r.confidence}%
                </span>
              </div>
              <div style={{ ...dvStyles.probTitle, fontSize: 14 }}>{r.title}</div>
              <div style={dvStyles.probMeta}>{r.body}</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                <button style={{ ...dvStyles.toolBtn, background: 'var(--navy)', color: '#fff', borderColor: 'var(--navy)' }}>{isEn ? 'Apply' : 'Застосувати'}</button>
                <button style={dvStyles.toolBtn}>{isEn ? 'Details' : 'Детальніше'}</button>
                <button style={{ ...dvStyles.toolBtn, color: 'var(--ink-3)' }}>{isEn ? 'Skip' : 'Пропустити'}</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Dashboard layouts per query type
const DASHBOARDS = {
  day: {
    title: 'Як пройшов день',
    sub: 'Сводка за 19 квітня · оновлено щойно',
    layout: () => (
      <>
        <div style={{ gridColumn: 'span 12' }}><DaySummary /></div>
        <div style={{ gridColumn: 'span 8' }}><HourlyChart /></div>
        <div style={{ gridColumn: 'span 4' }}><CategorySplit /></div>
        <div style={{ gridColumn: 'span 12' }}><Highlights /></div>
        <div style={{ gridColumn: 'span 12' }}><TopDishes /></div>
      </>
    ),
  },
  recs: {
    title: 'Рекомендації Мозку',
    sub: 'AI-поради для росту бізнесу · ранжовано за впливом',
    layout: () => (
      <>
        <div style={{ gridColumn: 'span 12' }}><Recommendations /></div>
      </>
    ),
  },
  revenue: {
    title: 'Виручка сьогодні',
    sub: 'повний розбір · оновлено щойно',
    layout: () => (
      <>
        <div style={{ gridColumn: 'span 8' }}><HourlyChart /></div>
        <div style={{ gridColumn: 'span 4' }}><CategorySplit /></div>
        <div style={{ gridColumn: 'span 12' }}><TopDishes /></div>
      </>
    ),
  },
  compare: {
    title: 'Порівняння з минулим вівторком',
    sub: 'аналогічні години · 10:00–14:37',
    layout: () => (
      <>
        <div style={{ gridColumn: 'span 12' }}>
          <CompareRow rows={[
            { label: 'Виручка',    a: '₴14 820', b: '₴13 240', delta: '+12%', up: true },
            { label: 'Замовлень',  a: '47',      b: '41',      delta: '+6',   up: true },
            { label: 'Середній чек', a: '₴315',  b: '₴323',    delta: '-₴8',  up: false },
            { label: 'Столики',    a: '8/12',    b: '6/12',    delta: '+2',   up: true },
          ]} />
        </div>
        <div style={{ gridColumn: 'span 8' }}><HourlyChart /></div>
        <div style={{ gridColumn: 'span 4' }}><CategorySplit /></div>
      </>
    ),
  },
  top: {
    title: 'Топ страв',
    sub: 'за кількістю продажів сьогодні',
    layout: () => (
      <>
        <div style={{ gridColumn: 'span 12' }}><TopDishes /></div>
        <div style={{ gridColumn: 'span 6' }}><CategorySplit /></div>
        <div style={{ gridColumn: 'span 6' }}><HourlyChart /></div>
      </>
    ),
  },
  problems: {
    title: 'Проблеми',
    sub: '4 активні події, що потребують уваги',
    layout: () => (
      <>
        <div style={{ gridColumn: 'span 12' }}><ProblemsList /></div>
        <div style={{ gridColumn: 'span 12' }}><StaffList /></div>
      </>
    ),
  },
  staff: {
    title: 'Персонал',
    sub: 'зміна · 10:00–22:00',
    layout: () => (
      <>
        <div style={{ gridColumn: 'span 12' }}><StaffList /></div>
        <div style={{ gridColumn: 'span 12' }}><ProblemsList /></div>
      </>
    ),
  },
};

function DashboardView({ kind, onBack }) {
  const { t } = useI18n();
  const isEn = t === DICT.en;
  const TITLES = {
    day:      { title: t.d_day_title, sub: t.d_day_sub },
    recs:     { title: t.d_recs_title, sub: t.d_recs_sub },
    revenue:  { title: t.d_rev_title, sub: t.d_rev_sub },
    compare:  { title: t.d_cmp_title, sub: t.d_cmp_sub },
    top:      { title: t.d_top_title, sub: t.d_top_sub },
    problems: { title: t.d_prob_title, sub: t.d_prob_sub },
    staff:    { title: t.d_staff_title, sub: t.d_staff_sub },
  };
  const dash = { ...(DASHBOARDS[kind] || DASHBOARDS.revenue), ...(TITLES[kind] || TITLES.revenue) };
  return (
    <div style={dvStyles.wrap}>
      <div style={dvStyles.headRow}>
        <button style={dvStyles.backPill} onClick={onBack}>
          {t.back_to_live}
        </button>
        <div>
          <div style={dvStyles.title}>{dash.title}</div>
          <div style={dvStyles.sub}>{dash.sub}</div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          <button style={dvStyles.toolBtn}>{t.today} ▾</button>
          <button style={dvStyles.toolBtn}>{t.export}</button>
        </div>
      </div>
      <div style={dvStyles.grid}>
        {dash.layout()}
      </div>
    </div>
  );
}

const dvStyles = {
  wrap: { flex: 1, minHeight: 0, overflowY: 'auto', animation: 'fadeIn .3s ease-out' },
  headRow: {
    display: 'flex', alignItems: 'center', gap: 14,
    padding: '0 0 18px',
  },
  backPill: {
    display: 'inline-flex', alignItems: 'center', gap: 6,
    background: 'var(--card)', border: '1px solid var(--hairline)',
    padding: '7px 13px', borderRadius: 99,
    fontSize: 12.5, fontWeight: 500, color: 'var(--ink-2)',
    cursor: 'pointer', fontFamily: 'inherit',
    boxShadow: '0 1px 2px rgba(14,27,44,.03)',
  },
  title: { fontSize: 20, fontWeight: 600, letterSpacing: -.3, color: 'var(--ink)' },
  sub: { fontSize: 12, color: 'var(--ink-3)', marginTop: 2 },
  toolBtn: {
    background: 'var(--card)', border: '1px solid var(--hairline)',
    padding: '7px 12px', borderRadius: 8, fontSize: 12, color: 'var(--ink-2)',
    cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
  },

  grid: { display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 14, paddingBottom: 20 },

  chart: {
    background: 'var(--card)', border: '1px solid var(--hairline)',
    borderRadius: 14, padding: '16px 18px',
    boxShadow: '0 1px 2px rgba(14,27,44,.03)',
    display: 'flex', flexDirection: 'column', gap: 14,
    minWidth: 0,
  },
  chartHead: { display: 'flex', alignItems: 'center', gap: 10 },
  chartTitle: { fontSize: 13, fontWeight: 600, color: 'var(--ink)' },
  chartSub: { fontSize: 12, color: 'var(--ink-3)', fontFamily: 'JetBrains Mono, monospace', marginLeft: 'auto' },
  chartLink: { fontSize: 11.5, color: 'var(--ink-3)', marginLeft: 'auto', cursor: 'pointer' },
  chartLegend: { display: 'flex', gap: 10, marginLeft: 'auto', fontSize: 11, color: 'var(--ink-3)' },
  legItem: { display: 'inline-flex', alignItems: 'center', gap: 4 },
  legSwatch: { width: 10, height: 10, borderRadius: 2, display: 'inline-block' },

  barsWrap: { display: 'flex', alignItems: 'flex-end', gap: 6, height: 180, paddingBottom: 22, position: 'relative' },
  barCol: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'flex-end', gap: 6, height: '100%', position: 'relative' },
  barStack: { flex: 1, display: 'flex', alignItems: 'flex-end', position: 'relative', minHeight: 2 },
  bar: {
    width: '100%', borderRadius: '4px 4px 0 0',
    position: 'absolute', bottom: 0, left: 0,
    transformOrigin: 'bottom',
    animation: 'barGrow .5s cubic-bezier(.2,.9,.3,1.2) both',
  },
  barLabel: { position: 'absolute', bottom: -20, left: 0, right: 0, textAlign: 'center', fontSize: 10.5, color: 'var(--ink-3)', fontFamily: 'JetBrains Mono, monospace' },

  catRow: { display: 'grid', gridTemplateColumns: '10px 1fr auto auto', alignItems: 'center', gap: 8, fontSize: 12 },
  catSwatch: { width: 10, height: 10, borderRadius: 3 },
  catName: { color: 'var(--ink-2)' },
  catPct: { color: 'var(--ink-3)', fontFamily: 'JetBrains Mono, monospace', fontSize: 11 },
  catVal: { fontFamily: 'JetBrains Mono, monospace', fontWeight: 600, color: 'var(--ink)' },

  cmpGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 },
  cmpCell: {
    padding: '12px 14px',
    background: '#FBFAF7', borderRadius: 10,
    border: '1px solid var(--hairline-2)',
  },
  cmpLbl: { fontSize: 11, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: .3, fontWeight: 500 },
  cmpValRow: { display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 },
  cmpA: { fontSize: 22, fontWeight: 600, letterSpacing: -.3, color: 'var(--ink)', fontVariantNumeric: 'tabular-nums' },
  cmpDelta: { display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: 11.5, fontWeight: 600, fontFamily: 'JetBrains Mono, monospace' },
  cmpB: { fontSize: 11, color: 'var(--ink-3)', marginTop: 2 },

  dishHead: {
    display: 'grid', gridTemplateColumns: '1.8fr 60px 90px 80px 70px', gap: 10,
    fontSize: 10, textTransform: 'uppercase', letterSpacing: .5,
    color: 'var(--ink-3)', paddingBottom: 6, borderBottom: '1px solid var(--hairline-2)',
    fontWeight: 600,
  },
  dishRow: {
    display: 'grid', gridTemplateColumns: '1.8fr 60px 90px 80px 70px', gap: 10,
    alignItems: 'center', padding: '9px 0',
    borderBottom: '1px dashed var(--hairline-2)', fontSize: 12.5,
  },
  dishName: { display: 'flex', alignItems: 'center', gap: 10, color: 'var(--ink)', fontWeight: 500 },
  dishRank: {
    width: 22, height: 22, borderRadius: 6,
    background: '#F3F1EA', color: 'var(--ink-3)',
    display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 600,
    fontFamily: 'JetBrains Mono, monospace',
  },
  dishNum: { fontFamily: 'JetBrains Mono, monospace', textAlign: 'right', fontWeight: 500, color: 'var(--ink)' },

  countChip: {
    marginLeft: 'auto', fontSize: 11, fontWeight: 600,
    background: '#F3F1EA', color: 'var(--ink-2)',
    padding: '2px 8px', borderRadius: 99,
    fontFamily: 'JetBrains Mono, monospace',
  },

  probRow: {
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '10px 14px',
    background: '#FBFAF7', borderRadius: 8,
    border: '1px solid var(--hairline-2)',
  },
  probTitle: { fontSize: 13, fontWeight: 600, color: 'var(--ink)' },
  probMeta: { fontSize: 11.5, color: 'var(--ink-3)', marginTop: 2 },
  probAge: {
    fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 99,
    fontFamily: 'JetBrains Mono, monospace',
  },

  staffRow: {
    display: 'flex', alignItems: 'center', gap: 10,
    padding: '8px 0', borderBottom: '1px dashed var(--hairline-2)',
  },
  staffAvatar: {
    width: 30, height: 30, borderRadius: 99,
    background: '#F3F1EA', color: 'var(--ink-2)',
    fontWeight: 600, fontSize: 12,
    display: 'grid', placeItems: 'center',
  },
  staffName: { fontSize: 12.5, fontWeight: 500, color: 'var(--ink)' },
  staffRole: { fontSize: 11, color: 'var(--ink-3)', marginTop: 1 },
  staffOrders: { fontFamily: 'JetBrains Mono, monospace', fontSize: 11.5, color: 'var(--ink-2)', fontWeight: 500 },
  staffStatus: { fontSize: 10.5, fontWeight: 600, padding: '3px 8px', borderRadius: 99, textTransform: 'uppercase', letterSpacing: .3 },
};

Object.assign(window, { DashboardView, DASHBOARDS });
