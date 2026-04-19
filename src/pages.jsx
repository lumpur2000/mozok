// Pages — Menu, Warehouse, Staff, Suppliers, Settings, Analytics

// ============ Shared ============
function PageHead({ title, sub, right }) {
  return (
    <div style={pgStyles.head}>
      <div>
        <div style={pgStyles.title}>{title}</div>
        <div style={pgStyles.sub}>{sub}</div>
      </div>
      {right}
    </div>
  );
}

// ============ MENU ============
function MenuPage() {
  const { t, money } = useI18n();
  const isEn = t === DICT.en;
  const initial = [
    { cat: t.cat_hot,   name: isEn ? 'Brain Burger' : 'Бургер «Мозок»',   price: 320, stop: false },
    { cat: t.cat_hot,   name: isEn ? 'Ribeye steak' : 'Стейк рібай',       price: 780, stop: false },
    { cat: t.cat_hot,   name: isEn ? 'Chicken Kyiv' : 'Котлета по-київськи', price: 285, stop: false },
    { cat: t.cat_hot,   name: isEn ? 'Salmon fillet' : 'Філе лосося',       price: 420, stop: true  },
    { cat: t.cat_cold,  name: isEn ? 'Beef tartare' : 'Тартар з яловичини', price: 340, stop: false },
    { cat: t.cat_cold,  name: isEn ? 'Burrata & tomatoes' : 'Буррата з томатами', price: 290, stop: false },
    { cat: t.cat_soup,  name: isEn ? 'Tom Yum' : 'Том Ям',                  price: 260, stop: false },
    { cat: t.cat_soup,  name: isEn ? 'Borsch' : 'Борщ',                      price: 190, stop: false },
    { cat: t.cat_soup,  name: isEn ? 'Mushroom cream' : 'Крем-суп грибний',  price: 175, stop: false },
    { cat: t.cat_dessert, name: isEn ? 'Cheesecake' : 'Чізкейк',            price: 160, stop: false },
    { cat: t.cat_dessert, name: isEn ? 'Napoleon' : 'Наполеон',             price: 145, stop: false },
    { cat: t.cat_drink, name: isEn ? 'Flat White' : 'Флет Вайт',            price: 75,  stop: false },
    { cat: t.cat_drink, name: isEn ? 'Lemonade' : 'Лимонад',                price: 95,  stop: false },
    { cat: t.cat_drink, name: isEn ? 'House wine, glass' : 'Вино дому, бокал', price: 180, stop: false },
  ];
  const [dishes, setDishes] = React.useState(initial);
  const [q, setQ] = React.useState('');
  React.useEffect(() => { setDishes(initial); }, [t]);

  const toggle = (i) => setDishes(ds => ds.map((d, j) => j === i ? { ...d, stop: !d.stop } : d));
  const filtered = dishes.map((d, i) => ({ d, i })).filter(({ d }) => !q || d.name.toLowerCase().includes(q.toLowerCase()));
  const cats = [...new Set(filtered.map(({ d }) => d.cat))];
  const stopCount = dishes.filter(d => d.stop).length;

  return (
    <div style={pgStyles.page}>
      <PageHead title={t.menu_title} sub={t.menu_sub}
        right={
          <div style={mnStyles.searchWrap}>
            <Icons.Search size={14} />
            <input style={mnStyles.search} placeholder={t.menu_search} value={q} onChange={e => setQ(e.target.value)} />
          </div>
        } />
      <div style={pgStyles.scroll}>
        {cats.map(cat => (
          <div key={cat} style={mnStyles.catBlock}>
            <div style={mnStyles.catHead}>
              <span>{cat}</span>
              <span style={mnStyles.catCount}>{filtered.filter(({d}) => d.cat === cat).length}</span>
            </div>
            <div style={mnStyles.rows}>
              {filtered.filter(({d}) => d.cat === cat).map(({ d, i }) => (
                <div key={i} style={{ ...mnStyles.row, opacity: d.stop ? 0.6 : 1 }}>
                  <span style={{ ...mnStyles.dishName, textDecoration: d.stop ? 'line-through' : 'none' }}>{d.name}</span>
                  <span style={mnStyles.price}>{money(d.price)}</span>
                  <span style={{ ...mnStyles.pill, ...(d.stop ? mnStyles.pillStop : mnStyles.pillOn) }}>
                    {d.stop ? t.menu_stop : t.menu_active}
                  </span>
                  <button onClick={() => toggle(i)} style={{ ...mnStyles.toggle, ...(d.stop ? mnStyles.toggleOn : {}) }}>
                    <span style={{ ...mnStyles.toggleKnob, transform: d.stop ? 'translateX(16px)' : 'translateX(0)' }} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div style={{ textAlign: 'center', color: 'var(--ink-3)', fontSize: 11.5, padding: '14px 0 4px' }}>
          {isEn ? `${dishes.length} dishes · ${stopCount} on stop-list` : `${dishes.length} страв · ${stopCount} у стоп-листі`}
        </div>
      </div>
    </div>
  );
}

// ============ WAREHOUSE ============
function WarehousePage() {
  const { t, money } = useI18n();
  const isEn = t === DICT.en;
  const stock = isEn ? [
    { name: 'Beef tenderloin', q: 8.2, u: t.wh_unit_kg },
    { name: 'Salmon fillet',   q: 0,   u: t.wh_unit_kg, out: true },
    { name: 'Chicken breast',  q: 12.5, u: t.wh_unit_kg },
    { name: 'Potatoes',        q: 34,  u: t.wh_unit_kg },
    { name: 'Cream 33%',       q: 6.0, u: t.wh_unit_l },
    { name: 'Olive oil',       q: 3.2, u: t.wh_unit_l },
    { name: 'Lemons',          q: 18, u: t.wh_unit_pc },
    { name: 'House wine',      q: 12, u: t.wh_unit_pc },
  ] : [
    { name: 'Вирізка яловичини', q: 8.2, u: t.wh_unit_kg },
    { name: 'Філе лосося',       q: 0,   u: t.wh_unit_kg, out: true },
    { name: 'Куряче філе',       q: 12.5, u: t.wh_unit_kg },
    { name: 'Картопля',          q: 34,  u: t.wh_unit_kg },
    { name: 'Вершки 33%',        q: 6.0, u: t.wh_unit_l },
    { name: 'Олія оливкова',     q: 3.2, u: t.wh_unit_l },
    { name: 'Лимони',            q: 18, u: t.wh_unit_pc },
    { name: 'Вино дому',         q: 12, u: t.wh_unit_pc },
  ];
  const exp = isEn ? [
    { name: 'Cream 33%',       q: 2.1, u: t.wh_unit_l,  when: t.wh_today, level: 'red' },
    { name: 'Burrata',         q: 4,   u: t.wh_unit_pc, when: t.wh_today, level: 'red' },
    { name: 'Fresh basil',     q: 0.3, u: t.wh_unit_kg, when: t.wh_tomorrow, level: 'amber' },
    { name: 'Arugula',         q: 0.8, u: t.wh_unit_kg, when: t.wh_tomorrow, level: 'amber' },
  ] : [
    { name: 'Вершки 33%',   q: 2.1, u: t.wh_unit_l,  when: t.wh_today, level: 'red' },
    { name: 'Буррата',      q: 4,   u: t.wh_unit_pc, when: t.wh_today, level: 'red' },
    { name: 'Базилік свіжий', q: 0.3, u: t.wh_unit_kg, when: t.wh_tomorrow, level: 'amber' },
    { name: 'Рукола',       q: 0.8, u: t.wh_unit_kg, when: t.wh_tomorrow, level: 'amber' },
  ];
  const reco = isEn ? [
    { name: 'Salmon fillet', q: 6, u: t.wh_unit_kg, cost: 7200, sup: 'Ocean Co.' },
    { name: 'Cream 33%',     q: 8, u: t.wh_unit_l,  cost: 960,  sup: 'Lactalis' },
    { name: 'Olive oil',     q: 5, u: t.wh_unit_l,  cost: 1450, sup: 'Agro+' },
    { name: 'Lemons',        q: 40, u: t.wh_unit_pc, cost: 480, sup: 'Fresh Market' },
  ] : [
    { name: 'Філе лосося',  q: 6, u: t.wh_unit_kg, cost: 7200, sup: 'Океан Ко.' },
    { name: 'Вершки 33%',   q: 8, u: t.wh_unit_l,  cost: 960,  sup: 'Лакталіс' },
    { name: 'Олія оливкова', q: 5, u: t.wh_unit_l,  cost: 1450, sup: 'Агро+' },
    { name: 'Лимони',       q: 40, u: t.wh_unit_pc, cost: 480, sup: 'Фреш Маркет' },
  ];
  const total = reco.reduce((s, r) => s + r.cost, 0);

  return (
    <div style={pgStyles.page}>
      <PageHead title={t.wh_title} sub={t.wh_sub} />
      <div style={pgStyles.scroll}>
        <div style={whStyles.grid}>
          {/* Stock */}
          <div style={whStyles.panel}>
            <div style={whStyles.panelHead}>{t.wh_stock}</div>
            <div>
              {stock.map((s, i) => (
                <div key={i} style={whStyles.stockRow}>
                  <span style={{ ...whStyles.stockName, color: s.out ? 'var(--red)' : 'var(--ink)' }}>{s.name}</span>
                  <span style={{ ...whStyles.stockQ, color: s.out ? 'var(--red)' : 'var(--ink-2)', fontWeight: s.out ? 700 : 500 }}>
                    {s.q} {s.u}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {/* Expiring */}
          <div style={whStyles.panel}>
            <div style={whStyles.panelHead}>{t.wh_expiring}</div>
            <div>
              {exp.map((e, i) => (
                <div key={i} style={{ ...whStyles.expRow, background: e.level === 'red' ? 'var(--red-soft)' : 'var(--amber-soft)' }}>
                  <span style={whStyles.expName}>{e.name}</span>
                  <span style={whStyles.expQ}>{e.q} {e.u}</span>
                  <span style={{ ...whStyles.expBadge, color: e.level === 'red' ? '#A93A37' : '#8C5A14', background: '#fff' }}>
                    {e.when}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ ...whStyles.panel, marginTop: 16 }}>
          <div style={whStyles.panelHead}>
            <span>{t.wh_reco}</span>
            <span style={whStyles.recoTotal}>Σ {money(total)}</span>
          </div>
          <div>
            {reco.map((r, i) => (
              <div key={i} style={whStyles.recoRow}>
                <span style={whStyles.recoName}>{r.name}</span>
                <span style={whStyles.recoQ}>{r.q} {r.u}</span>
                <span style={whStyles.recoSup}>{r.sup}</span>
                <span style={whStyles.recoCost}>{money(r.cost)}</span>
                <button style={whStyles.recoBtn}>{t.wh_order}</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ STAFF ============
function StaffPage() {
  const { t } = useI18n();
  const isEn = t === DICT.en;
  const list = isEn ? [
    { n: 'Iryna Kovalenko',    r: t.role_bar,     on: true, since: '10:00' },
    { n: 'Ihor Petrenko',      r: t.role_cook,    on: true, since: '10:30' },
    { n: 'Oleksandr Melnyk',   r: t.role_waiter,  on: true, since: '11:00' },
    { n: 'Olena Savchuk',      r: t.role_waiter,  on: true, since: '11:00' },
    { n: 'Dmytro Hrytsenko',   r: t.role_cook,    on: true, since: '10:00' },
    { n: 'Anna Lysenko',       r: t.role_host,    on: true, since: '11:30' },
    { n: 'Maryna Tkachenko',   r: t.role_waiter,  on: false },
    { n: 'Vasyl Shevchenko',   r: t.role_manager, on: false },
    { n: 'Kateryna Moroz',     r: t.role_waiter,  on: false },
  ] : [
    { n: 'Ірина Коваленко',    r: t.role_bar,     on: true, since: '10:00' },
    { n: 'Ігор Петренко',      r: t.role_cook,    on: true, since: '10:30' },
    { n: 'Олександр Мельник',  r: t.role_waiter,  on: true, since: '11:00' },
    { n: 'Олена Савчук',       r: t.role_waiter,  on: true, since: '11:00' },
    { n: 'Дмитро Гриценко',    r: t.role_cook,    on: true, since: '10:00' },
    { n: 'Анна Лисенко',       r: t.role_host,    on: true, since: '11:30' },
    { n: 'Марина Ткаченко',    r: t.role_waiter,  on: false },
    { n: 'Василь Шевченко',    r: t.role_manager, on: false },
    { n: 'Катерина Мороз',     r: t.role_waiter,  on: false },
  ];
  const on = list.filter(p => p.on);
  const off = list.filter(p => !p.on);
  return (
    <div style={pgStyles.page}>
      <PageHead title={t.staff_title} sub={t.staff_sub} />
      <div style={pgStyles.scroll}>
        <div style={stStyles.section}>
          <div style={stStyles.sectionHead}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: 99, background: 'var(--green)' }} />
              <span>{t.staff_on}</span>
              <span style={stStyles.count}>{on.length}</span>
            </span>
          </div>
          <div style={stStyles.list}>
            {on.map((p, i) => (
              <div key={i} style={stStyles.row}>
                <div style={stStyles.avatar}>{p.n[0]}</div>
                <div style={{ flex: 1 }}>
                  <div style={stStyles.name}>{p.n}</div>
                  <div style={stStyles.role}>{p.r}</div>
                </div>
                <div style={stStyles.since}>{isEn ? 'since ' : 'з '}{p.since}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ ...stStyles.section, marginTop: 16 }}>
          <div style={stStyles.sectionHead}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: 99, background: '#D6D2C8' }} />
              <span>{t.staff_off}</span>
              <span style={stStyles.count}>{off.length}</span>
            </span>
          </div>
          <div style={stStyles.list}>
            {off.map((p, i) => (
              <div key={i} style={{ ...stStyles.row, opacity: .55 }}>
                <div style={{ ...stStyles.avatar, background: '#E8E6DF', color: '#6B7A8F' }}>{p.n[0]}</div>
                <div style={{ flex: 1 }}>
                  <div style={stStyles.name}>{p.n}</div>
                  <div style={stStyles.role}>{p.r}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ SUPPLIERS ============
function SuppliersPage() {
  const { t, money } = useI18n();
  const isEn = t === DICT.en;
  const data = isEn ? [
    { n: 'Ocean Co.', cat: 'Fish & seafood', items: [
      { i: 'Salmon fillet', p: 1200, u: 'kg' },
      { i: 'Sea bass', p: 980, u: 'kg' },
      { i: 'Tiger shrimp', p: 1450, u: 'kg' },
    ], delivery: 'Mon / Thu', last: 'Apr 18', dev: '+8% on salmon last month' },
    { n: 'Meat Artisan', cat: 'Meat & poultry', items: [
      { i: 'Beef tenderloin', p: 860, u: 'kg' },
      { i: 'Chicken breast', p: 280, u: 'kg' },
      { i: 'Ribeye', p: 1100, u: 'kg' },
    ], delivery: 'Tue / Fri', last: 'Apr 16', dev: 'None' },
    { n: 'Lactalis', cat: 'Dairy', items: [
      { i: 'Cream 33%', p: 120, u: 'L' },
      { i: 'Burrata', p: 220, u: 'pc' },
    ], delivery: 'Daily', last: 'Apr 19 08:00', dev: 'Burrata -2 pcs on Apr 17' },
    { n: 'Fresh Market', cat: 'Vegetables', items: [
      { i: 'Tomatoes', p: 95, u: 'kg' },
      { i: 'Arugula', p: 340, u: 'kg' },
      { i: 'Lemons', p: 12, u: 'pc' },
    ], delivery: 'Mon / Wed / Fri', last: 'Apr 17', dev: 'None' },
  ] : [
    { n: 'Океан Ко.', cat: 'Риба та морепродукти', items: [
      { i: 'Філе лосося', p: 1200, u: 'кг' },
      { i: 'Сібас', p: 980, u: 'кг' },
      { i: 'Креветки тигрові', p: 1450, u: 'кг' },
    ], delivery: 'Пн / Чт', last: '18 квітня', dev: '+8% на лосося за місяць' },
    { n: 'Мʼясний ремісник', cat: 'Мʼясо та птиця', items: [
      { i: 'Вирізка яловичини', p: 860, u: 'кг' },
      { i: 'Куряче філе', p: 280, u: 'кг' },
      { i: 'Рібай', p: 1100, u: 'кг' },
    ], delivery: 'Вт / Пт', last: '16 квітня', dev: 'Немає' },
    { n: 'Лакталіс', cat: 'Молочні продукти', items: [
      { i: 'Вершки 33%', p: 120, u: 'л' },
      { i: 'Буррата', p: 220, u: 'шт' },
    ], delivery: 'Щодня', last: '19 квітня 08:00', dev: 'Недопостач. буррати −2 шт 17 кв.' },
    { n: 'Фреш Маркет', cat: 'Овочі та зелень', items: [
      { i: 'Томати', p: 95, u: 'кг' },
      { i: 'Рукола', p: 340, u: 'кг' },
      { i: 'Лимони', p: 12, u: 'шт' },
    ], delivery: 'Пн / Ср / Пт', last: '17 квітня', dev: 'Немає' },
  ];
  const [open, setOpen] = React.useState(0);
  const [recording, setRecording] = React.useState(null);

  return (
    <div style={pgStyles.page}>
      <PageHead title={t.sup_title} sub={t.sup_sub} />
      <div style={pgStyles.scroll}>
        <div style={spStyles.list}>
          {data.map((s, i) => {
            const isOpen = open === i;
            return (
              <div key={i} style={{ ...spStyles.card, ...(isOpen ? spStyles.cardOpen : {}) }}>
                <button style={spStyles.cardHead} onClick={() => setOpen(isOpen ? -1 : i)}>
                  <div>
                    <div style={spStyles.supName}>{s.n}</div>
                    <div style={spStyles.supCat}>{s.cat}</div>
                  </div>
                  <div style={spStyles.headMeta}>
                    <span style={spStyles.headLabel}>{t.sup_delivery}</span>
                    <span style={spStyles.headVal}>{s.delivery}</span>
                  </div>
                  <div style={spStyles.headMeta}>
                    <span style={spStyles.headLabel}>{t.sup_last}</span>
                    <span style={spStyles.headVal}>{s.last}</span>
                  </div>
                  <span style={spStyles.chev}>
                    <Icons.ChevronDown size={14} />
                  </span>
                </button>
                {isOpen && (
                  <div style={spStyles.expand}>
                    <div style={spStyles.priceTable}>
                      <div style={{ ...spStyles.prRow, ...spStyles.prHeadRow }}>
                        <span>{isEn ? 'Item' : 'Позиція'}</span>
                        <span style={{ textAlign: 'right' }}>{t.sup_price}</span>
                      </div>
                      {s.items.map((it, j) => (
                        <div key={j} style={spStyles.prRow}>
                          <span>{it.i}</span>
                          <span style={{ textAlign: 'right', fontFamily: 'JetBrains Mono, monospace' }}>{money(it.p)} / {it.u}</span>
                        </div>
                      ))}
                    </div>
                    <div style={spStyles.devBlock}>
                      <div style={spStyles.devLabel}>{t.sup_dev}</div>
                      <div style={{ ...spStyles.devVal, color: s.dev === 'Немає' || s.dev === 'None' ? 'var(--ink-3)' : '#8C5A14' }}>{s.dev}</div>
                    </div>
                    <div style={spStyles.noteRow}>
                      {recording === i ? (
                        <div style={spStyles.recording}>
                          <span style={{ width: 8, height: 8, borderRadius: 99, background: 'var(--red)', animation: 'pulseDot 1.2s infinite' }} />
                          <span>{t.sup_new_note}</span>
                          <button style={spStyles.stopBtn} onClick={() => setRecording(null)}>{isEn ? 'Stop' : 'Зупинити'}</button>
                        </div>
                      ) : (
                        <button style={spStyles.noteBtn} onClick={() => setRecording(i)}>
                          <Icons.Mic size={12} />
                          <span>{t.sup_add_note}</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============ SETTINGS ============
function SettingsPage() {
  const { t, lang, setLang, currency, setCurrency } = useI18n();
  const isEn = t === DICT.en;
  const equipment = isEn ? [
    { n: 'POS terminal #1', ok: true },
    { n: 'POS terminal #2', ok: false, note: 'Offline 14 min' },
    { n: 'Kitchen printer', ok: true },
    { n: 'Bar printer', ok: true },
    { n: 'Fiscal printer', ok: true },
    { n: 'Payment terminal', ok: true },
  ] : [
    { n: 'POS-термінал №1', ok: true },
    { n: 'POS-термінал №2', ok: false, note: 'Оффлайн 14 хв' },
    { n: 'Принтер кухні', ok: true },
    { n: 'Принтер бару', ok: true },
    { n: 'Фіскальний принтер', ok: true },
    { n: 'Платіжний термінал', ok: true },
  ];
  const roles = isEn ? [
    { r: 'Owner',    scope: 'Full access' },
    { r: 'Manager',  scope: 'Dashboards, staff, suppliers' },
    { r: 'Waiter',   scope: 'POS, orders, tables' },
    { r: 'Cook',     scope: 'KDS, stop-list' },
  ] : [
    { r: 'Власник',   scope: 'Повний доступ' },
    { r: 'Менеджер',  scope: 'Дашборди, персонал, постачальники' },
    { r: 'Офіціант',  scope: 'POS, замовлення, столики' },
    { r: 'Кухар',     scope: 'KDS, стоп-лист' },
  ];

  return (
    <div style={pgStyles.page}>
      <PageHead title={t.set_title} sub={t.set_sub} />
      <div style={pgStyles.scroll}>
        <div style={seStyles.grid}>
          {/* Profile */}
          <div style={seStyles.card}>
            <div style={seStyles.cardHead}>{t.set_profile}</div>
            <div style={seStyles.fields}>
              <div style={seStyles.field}>
                <span style={seStyles.fieldLabel}>{t.set_name}</span>
                <input style={seStyles.input} defaultValue={isEn ? 'Braiv Kitchen' : 'Браів Кітчен'} />
              </div>
              <div style={seStyles.field}>
                <span style={seStyles.fieldLabel}>{t.set_addr}</span>
                <input style={seStyles.input} defaultValue={isEn ? '14 Reitarska St, Kyiv' : 'вул. Рейтарська, 14, Київ'} />
              </div>
              <div style={seStyles.field}>
                <span style={seStyles.fieldLabel}>{t.set_tables}</span>
                <input style={seStyles.input} defaultValue="12" />
              </div>
            </div>
          </div>

          {/* Locale */}
          <div style={seStyles.card}>
            <div style={seStyles.cardHead}>{t.set_locale}</div>
            <div style={seStyles.fields}>
              <div style={seStyles.field}>
                <span style={seStyles.fieldLabel}>{t.set_lang}</span>
                <select style={seStyles.select} value={lang} onChange={e => setLang(e.target.value)}>
                  <option value="uk">Українська</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div style={seStyles.field}>
                <span style={seStyles.fieldLabel}>{t.set_cur}</span>
                <select style={seStyles.select} value={currency} onChange={e => setCurrency(e.target.value)}>
                  <option value="UAH">{isEn ? CUR.UAH.nameEn : CUR.UAH.name}</option>
                  <option value="USD">{isEn ? CUR.USD.nameEn : CUR.USD.name}</option>
                  <option value="EUR">{isEn ? CUR.EUR.nameEn : CUR.EUR.name}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Equipment */}
          <div style={seStyles.card}>
            <div style={seStyles.cardHead}>{t.set_equipment}</div>
            <div style={seStyles.eqList}>
              {equipment.map((e, i) => (
                <div key={i} style={seStyles.eqRow}>
                  <span style={{
                    width: 8, height: 8, borderRadius: 99,
                    background: e.ok ? 'var(--green)' : 'var(--red)',
                    boxShadow: e.ok ? '0 0 0 3px rgba(46,204,113,.12)' : '0 0 0 3px rgba(232,80,76,.12)',
                  }} />
                  <span style={seStyles.eqName}>{e.n}</span>
                  {e.note && <span style={seStyles.eqNote}>{e.note}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* Roles */}
          <div style={seStyles.card}>
            <div style={seStyles.cardHead}>{t.set_roles}</div>
            <div style={seStyles.roleList}>
              {roles.map((r, i) => (
                <div key={i} style={seStyles.roleRow}>
                  <span style={seStyles.roleName}>{r.r}</span>
                  <span style={seStyles.roleScope}>{r.scope}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ STYLES ============
const pgStyles = {
  page: { display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0, gap: 16, animation: 'fadeIn .25s ease-out' },
  head: { display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16 },
  title: { fontSize: 24, fontWeight: 600, letterSpacing: -.4, color: 'var(--ink)' },
  sub: { fontSize: 12.5, color: 'var(--ink-3)', marginTop: 2 },
  scroll: { flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: 2, paddingBottom: 4 },
};

const mnStyles = {
  searchWrap: { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: '#fff', border: '1px solid var(--hairline)', borderRadius: 10, width: 260, color: 'var(--ink-3)' },
  search: { border: 'none', outline: 'none', background: 'transparent', fontSize: 13, fontFamily: 'inherit', flex: 1, color: 'var(--ink)' },
  catBlock: { marginBottom: 18 },
  catHead: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: .5, color: 'var(--ink-3)', padding: '6px 2px 8px' },
  catCount: { fontFamily: 'JetBrains Mono, monospace', fontSize: 10, fontWeight: 700, background: '#fff', color: 'var(--ink-3)', padding: '1px 6px', borderRadius: 99, border: '1px solid var(--hairline)' },
  rows: { background: 'var(--card)', border: '1px solid var(--hairline)', borderRadius: 12, overflow: 'hidden' },
  row: { display: 'grid', gridTemplateColumns: '1fr auto auto auto', alignItems: 'center', gap: 14, padding: '11px 16px', borderBottom: '1px solid var(--hairline-2)' },
  dishName: { fontSize: 13.5, color: 'var(--ink)', fontWeight: 500 },
  price: { fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: 'var(--ink-2)', fontWeight: 600 },
  pill: { fontSize: 10, fontWeight: 700, letterSpacing: .4, padding: '2px 8px', borderRadius: 99, textTransform: 'uppercase' },
  pillOn: { background: 'var(--green-soft)', color: 'var(--green-deep)' },
  pillStop: { background: 'var(--red-soft)', color: '#A93A37' },
  toggle: { position: 'relative', width: 36, height: 20, borderRadius: 99, border: 'none', background: '#E8E6DF', cursor: 'pointer', padding: 0 },
  toggleOn: { background: 'var(--red)' },
  toggleKnob: { position: 'absolute', top: 2, left: 2, width: 16, height: 16, borderRadius: 99, background: '#fff', transition: 'transform .18s', boxShadow: '0 1px 2px rgba(0,0,0,.2)' },
};

const whStyles = {
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 },
  panel: { background: 'var(--card)', border: '1px solid var(--hairline)', borderRadius: 12, overflow: 'hidden' },
  panelHead: { padding: '12px 16px', borderBottom: '1px solid var(--hairline-2)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: .5, color: 'var(--ink-2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  stockRow: { display: 'flex', justifyContent: 'space-between', padding: '9px 16px', borderBottom: '1px solid var(--hairline-2)', fontSize: 13 },
  stockName: { fontWeight: 500 },
  stockQ: { fontFamily: 'JetBrains Mono, monospace' },
  expRow: { display: 'grid', gridTemplateColumns: '1fr auto auto', alignItems: 'center', gap: 12, padding: '9px 16px', marginBottom: 1, fontSize: 13 },
  expName: { fontWeight: 500, color: 'var(--ink)' },
  expQ: { fontFamily: 'JetBrains Mono, monospace', color: 'var(--ink-2)', fontSize: 12 },
  expBadge: { fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: .4, padding: '2px 8px', borderRadius: 99 },
  recoTotal: { fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: 'var(--navy)', fontWeight: 700, textTransform: 'none', letterSpacing: 0 },
  recoRow: { display: 'grid', gridTemplateColumns: '1.4fr auto 1fr auto auto', alignItems: 'center', gap: 14, padding: '12px 16px', borderBottom: '1px solid var(--hairline-2)', fontSize: 13 },
  recoName: { fontWeight: 500, color: 'var(--ink)' },
  recoQ: { fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--ink-2)' },
  recoSup: { fontSize: 11.5, color: 'var(--ink-3)' },
  recoCost: { fontFamily: 'JetBrains Mono, monospace', fontSize: 13, fontWeight: 600, color: 'var(--ink)' },
  recoBtn: { padding: '6px 12px', fontSize: 11.5, fontWeight: 600, border: 'none', borderRadius: 6, background: 'var(--navy)', color: '#fff', cursor: 'pointer', fontFamily: 'inherit' },
};

const stStyles = {
  section: { background: 'var(--card)', border: '1px solid var(--hairline)', borderRadius: 12, overflow: 'hidden' },
  sectionHead: { padding: '12px 16px', borderBottom: '1px solid var(--hairline-2)', fontSize: 13, fontWeight: 600, color: 'var(--ink)' },
  count: { fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 700, background: '#F0EEE7', color: 'var(--ink-2)', padding: '1px 7px', borderRadius: 99, marginLeft: 4 },
  list: {},
  row: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderBottom: '1px solid var(--hairline-2)' },
  avatar: { width: 32, height: 32, borderRadius: 99, background: 'var(--navy)', color: '#fff', fontWeight: 700, fontSize: 13, display: 'grid', placeItems: 'center' },
  name: { fontSize: 13.5, fontWeight: 500, color: 'var(--ink)' },
  role: { fontSize: 11.5, color: 'var(--ink-3)', marginTop: 1 },
  since: { fontFamily: 'JetBrains Mono, monospace', fontSize: 11.5, color: 'var(--ink-3)' },
};

const spStyles = {
  list: { display: 'flex', flexDirection: 'column', gap: 8 },
  card: { background: 'var(--card)', border: '1px solid var(--hairline)', borderRadius: 12, overflow: 'hidden' },
  cardOpen: { boxShadow: '0 4px 12px rgba(14,27,44,.06)', borderColor: 'var(--hairline)' },
  cardHead: { width: '100%', display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 24px', alignItems: 'center', gap: 16, padding: '14px 18px', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' },
  supName: { fontSize: 14, fontWeight: 600, color: 'var(--ink)' },
  supCat: { fontSize: 11.5, color: 'var(--ink-3)', marginTop: 1 },
  headMeta: { display: 'flex', flexDirection: 'column', gap: 2 },
  headLabel: { fontSize: 10, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: .5, fontWeight: 600 },
  headVal: { fontSize: 12.5, color: 'var(--ink-2)', fontWeight: 500 },
  chev: { color: 'var(--ink-3)', display: 'grid', placeItems: 'center' },
  expand: { padding: '4px 18px 18px', borderTop: '1px solid var(--hairline-2)' },
  priceTable: { background: '#FBFAF7', border: '1px solid var(--hairline-2)', borderRadius: 8, overflow: 'hidden', margin: '12px 0' },
  prRow: { display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, padding: '8px 12px', borderBottom: '1px solid var(--hairline-2)', fontSize: 12.5, color: 'var(--ink)' },
  prHeadRow: { fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: .5, color: 'var(--ink-3)', background: '#F0EEE7' },
  devBlock: { padding: '8px 2px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  devLabel: { fontSize: 11, fontWeight: 600, color: 'var(--ink-3)', textTransform: 'uppercase', letterSpacing: .4 },
  devVal: { fontSize: 12.5 },
  noteRow: { paddingTop: 10, borderTop: '1px solid var(--hairline-2)' },
  noteBtn: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 12px', background: '#FBFAF7', border: '1px dashed var(--hairline)', borderRadius: 8, fontSize: 12, fontWeight: 500, color: 'var(--ink-2)', cursor: 'pointer', fontFamily: 'inherit' },
  recording: { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 12px', background: 'var(--red-soft)', borderRadius: 8, fontSize: 12, color: '#A93A37', fontWeight: 500 },
  stopBtn: { marginLeft: 6, padding: '3px 10px', background: 'var(--red)', color: '#fff', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
};

const seStyles = {
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 },
  card: { background: 'var(--card)', border: '1px solid var(--hairline)', borderRadius: 12, overflow: 'hidden' },
  cardHead: { padding: '12px 16px', borderBottom: '1px solid var(--hairline-2)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: .5, color: 'var(--ink-2)' },
  fields: { padding: 14, display: 'flex', flexDirection: 'column', gap: 10 },
  field: { display: 'flex', flexDirection: 'column', gap: 5 },
  fieldLabel: { fontSize: 11, color: 'var(--ink-3)', fontWeight: 500 },
  input: { padding: '8px 10px', fontSize: 13, border: '1px solid var(--hairline)', borderRadius: 8, background: '#FBFAF7', fontFamily: 'inherit', outline: 'none', color: 'var(--ink)' },
  select: { padding: '8px 10px', fontSize: 13, border: '1px solid var(--hairline)', borderRadius: 8, background: '#FBFAF7', fontFamily: 'inherit', outline: 'none', color: 'var(--ink)', cursor: 'pointer' },
  eqList: { padding: '6px 0' },
  eqRow: { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px', fontSize: 13 },
  eqName: { flex: 1, color: 'var(--ink)' },
  eqNote: { fontSize: 11.5, color: 'var(--red)', fontWeight: 500 },
  roleList: { padding: '6px 0' },
  roleRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '10px 16px', borderBottom: '1px solid var(--hairline-2)' },
  roleName: { fontSize: 13, fontWeight: 600, color: 'var(--ink)' },
  roleScope: { fontSize: 12, color: 'var(--ink-3)' },
};

Object.assign(window, { MenuPage, WarehousePage, StaffPage, SuppliersPage, SettingsPage });
