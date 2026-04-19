// i18n — lang + currency context

const DICT = {
  uk: {
    greet: 'Добрий день, Андрію',
    dateLine: 'Вівторок · 19 квітня · зміна триває 4 год',
    notifications: 'Сповіщення',

    // Sidebar
    brand1: 'Мозок', brand2: 'Ресторану',
    nav_dashboard: 'Дашборд',
    nav_analytics: 'Аналітика',
    nav_menu: 'Меню',
    nav_warehouse: 'Склад',
    nav_staff: 'Персонал',
    nav_suppliers: 'Постачальники',
    nav_settings: 'Налаштування',
    owner: 'Власник',

    // KPIs
    kpi_revenue: 'Виручка сьогодні',
    kpi_orders: 'Замовлень',
    kpi_check: 'Середній чек',
    kpi_tables: 'Столиків зайнято',
    kpi_vs: 'vs. минулий вівторок',
    kpi_orders_sub: 'активні: 9 · закриті: 38',
    kpi_check_goal: 'ціль',
    kpi_wait: 'ср. очікування 14 хв',

    // Feed
    feed_title: 'Жива стрічка',
    feed_online: 'Онлайн',
    feed_count: (n) => `${n} подій сьогодні`,
    feed_empty: 'Немає подій цього типу',
    f_all: 'Все', f_order: 'Замовлення', f_kitchen: 'Кухня', f_pay: 'Оплати', f_stop: 'Стоп-лист', f_brain: 'Мозок',
    ev: {
      order_new: (n, t, w) => ({ title: `Замовлення #${n} підтверджено`, meta: `Столик ${t} · офіціант ${w}` }),
      stop: 'Стоп-лист: Лосось с/с',
      stop_meta: 'Оновила Ірина · залишилось 0 порцій',
      ready: 'Страва готова · Том Ям',
      ready_meta: 'Столик 7 · очікує офіціанта вже 4 хв',
      kitchen: 'Нове замовлення на кухні',
      kitchen_meta: 'Столик 9 · 4 позиції · пріоритет нормальний',
      pay: 'Оплата · картка',
      pay_meta: 'Столик 2 · закрито · чайові',
      staff: 'Ірина відкрила зміну',
      staff_meta: 'Бар · планова тривалість 8 год',
      brain: 'Мозок: прогноз трафіку',
      brain_meta: 'Пік очікується о 13:15 · +24% до середи',
      // Critical
      crit_terminal: 'Термінал офлайн',
      crit_terminal_meta: 'Гості не можуть платити карткою',
      crit_printer: 'Фіскальний принтер не відповідає',
      crit_printer_meta: 'Закриття столів неможливе',
      crit_kitchen: 'Кухня не отримує замовлення',
      crit_kitchen_meta: 'Звʼязок втрачено',
      crit_conflict: 'Конфлікт стоп-листа',
      crit_conflict_meta: 'Лосось замовлено на столик 4, але його немає',
      crit_table11: 'Столик 11 · 27 хвилин без обслуговування',
      crit_table11_meta: 'Гості не отримали меню після посадки',
      crit_norev: '0 замовлень за останню годину',
      crit_norev_meta: 'Заклад відкритий, але пусто',
    },
    tag_stop: 'СТОП', tag_ai: 'AI', tag_attention: 'УВАГА', tag_critical: 'КРИТИЧНО',

    // Chat
    chat_name: 'Мозок',
    chat_status: 'AI-асистент · онлайн',
    chat_placeholder: 'Запитай Мозок…',
    chat_listening: 'Слухаю…',
    chat_hello: 'Привіт, Андрію 👋',
    chat_hello_body: 'Я готова відповісти на питання про ресторан. Спробуй кнопки нижче або напиши голосом.',
    q_day: 'Як пройшов день',
    q_recs: 'Рекомендації мозку',
    q_revenue: 'Моя виручка',
    q_top: 'Топ страв',
    q_problems: 'Проблеми',
    q_staff: 'Персонал',
    open_analytics: 'Відкрити в аналітиці',
    back_to_live: '← До стрічки',

    // Analytics
    a_title: 'Аналітика',
    a_sub: 'Стандартні звіти · оновлено щойно',
    a_ai_label: 'Створено Мозком · щойно',
    a_rev_hour: 'Виручка по годинах',
    a_top_margin: 'Топ страв — продажі та маржа',
    a_turnover: 'Обертання столиків',
    a_check_dyn: 'Динаміка середнього чеку',
    a_kitchen_speed: 'Швидкість кухні',

    // Menu
    menu_title: 'Меню',
    menu_sub: 'Операційний вигляд · стоп-лист одним кліком',
    menu_search: 'Пошук страви…',
    menu_active: 'активна',
    menu_stop: 'стоп-лист',
    cat_hot: 'Гарячі страви', cat_cold: 'Холодні закуски', cat_soup: 'Супи', cat_dessert: 'Десерти', cat_drink: 'Напої',

    // Warehouse
    wh_title: 'Склад',
    wh_sub: 'Залишки, терміни, рекомендовані закупки',
    wh_stock: 'Залишки',
    wh_expiring: 'Скоро закінчиться термін',
    wh_reco: 'Рекомендована закупка',
    wh_unit_kg: 'кг', wh_unit_l: 'л', wh_unit_pc: 'шт',
    wh_today: 'сьогодні', wh_tomorrow: 'завтра',
    wh_order: 'Замовити',

    // Staff
    staff_title: 'Персонал',
    staff_sub: 'Хто зараз працює',
    staff_on: 'На зміні', staff_off: 'Не на зміні',
    role_waiter: 'Офіціант', role_cook: 'Кухар', role_bar: 'Бар', role_manager: 'Менеджер', role_host: 'Хостес',

    // Suppliers
    sup_title: 'Постачальники',
    sup_sub: 'Умови, поставки, відхилення',
    sup_price: 'Ціна за одиницю',
    sup_delivery: 'День поставки',
    sup_last: 'Остання поставка',
    sup_dev: 'Відхилення',
    sup_add_note: '+ Додати нотатку',
    sup_new_note: 'Запис розмови…',

    // Settings
    set_title: 'Налаштування',
    set_sub: 'Профіль закладу, обладнання, мова, валюта',
    set_profile: 'Профіль ресторану',
    set_name: 'Назва', set_addr: 'Адреса', set_tables: 'Кількість столиків',
    set_equipment: 'Обладнання',
    set_roles: 'Ролі та доступи',
    set_locale: 'Мова та валюта',
    set_lang: 'Мова інтерфейсу',
    set_cur: 'Валюта',

    today: 'Сьогодні', export: 'Експорт',
  },
  en: {
    greet: 'Good afternoon, Andrii',
    dateLine: 'Tuesday · April 19 · shift running 4 h',
    notifications: 'Notifications',

    brand1: 'Brain', brand2: 'Restaurant',
    nav_dashboard: 'Dashboard',
    nav_analytics: 'Analytics',
    nav_menu: 'Menu',
    nav_warehouse: 'Warehouse',
    nav_staff: 'Staff',
    nav_suppliers: 'Suppliers',
    nav_settings: 'Settings',
    owner: 'Owner',

    kpi_revenue: 'Revenue today',
    kpi_orders: 'Orders',
    kpi_check: 'Avg. check',
    kpi_tables: 'Tables occupied',
    kpi_vs: 'vs. last Tuesday',
    kpi_orders_sub: 'active: 9 · closed: 38',
    kpi_check_goal: 'goal',
    kpi_wait: 'avg. wait 14 min',

    feed_title: 'Live Feed',
    feed_online: 'Online',
    feed_count: (n) => `${n} events today`,
    feed_empty: 'No events of this type',
    f_all: 'All', f_order: 'Orders', f_kitchen: 'Kitchen', f_pay: 'Payments', f_stop: 'Stop-list', f_brain: 'Brain',
    ev: {
      order_new: (n, t, w) => ({ title: `Order #${n} confirmed`, meta: `Table ${t} · waiter ${w}` }),
      stop: 'Stop-list: Salmon',
      stop_meta: 'Updated by Iryna · 0 portions left',
      ready: 'Dish ready · Tom Yum',
      ready_meta: 'Table 7 · waiting for waiter 4 min',
      kitchen: 'New order in kitchen',
      kitchen_meta: 'Table 9 · 4 items · normal priority',
      pay: 'Payment · card',
      pay_meta: 'Table 2 · closed · tip',
      staff: 'Iryna opened her shift',
      staff_meta: 'Bar · planned duration 8 h',
      brain: 'Brain: traffic forecast',
      brain_meta: 'Peak expected at 13:15 · +24% vs Wednesday',
      crit_terminal: 'Terminal offline',
      crit_terminal_meta: 'Guests cannot pay by card',
      crit_printer: 'Fiscal printer not responding',
      crit_printer_meta: 'Cannot close tables',
      crit_kitchen: 'Kitchen not receiving orders',
      crit_kitchen_meta: 'Connection lost',
      crit_conflict: 'Stop-list conflict',
      crit_conflict_meta: 'Salmon ordered for table 4, but it is out',
      crit_table11: 'Table 11 · 27 minutes without service',
      crit_table11_meta: 'Guests did not receive menus after seating',
      crit_norev: '0 orders in the last hour',
      crit_norev_meta: 'Restaurant open, but empty',
    },
    tag_stop: 'STOP', tag_ai: 'AI', tag_attention: 'ATTENTION', tag_critical: 'CRITICAL',

    chat_name: 'Brain',
    chat_status: 'AI assistant · online',
    chat_placeholder: 'Ask Brain…',
    chat_listening: 'Listening…',
    chat_hello: 'Hi, Andrii 👋',
    chat_hello_body: 'I can answer questions about the restaurant. Try the buttons below or type a query.',
    q_day: 'How was the day',
    q_recs: 'Brain recommendations',
    q_revenue: 'My revenue',
    q_top: 'Top dishes',
    q_problems: 'Issues',
    q_staff: 'Staff',
    open_analytics: 'Open in Analytics',
    back_to_live: '← Back to feed',

    a_title: 'Analytics',
    a_sub: 'Standard reports · updated just now',
    a_ai_label: 'Generated by Brain · just now',
    a_rev_hour: 'Revenue by hour',
    a_top_margin: 'Top dishes — sales & margin',
    a_turnover: 'Tables turnover',
    a_check_dyn: 'Average check dynamics',
    a_kitchen_speed: 'Kitchen speed',

    menu_title: 'Menu',
    menu_sub: 'Operational view · one-click stop-list',
    menu_search: 'Search dish…',
    menu_active: 'active',
    menu_stop: 'stop-list',
    cat_hot: 'Hot dishes', cat_cold: 'Cold starters', cat_soup: 'Soups', cat_dessert: 'Desserts', cat_drink: 'Drinks',

    wh_title: 'Warehouse',
    wh_sub: 'Stock, expiries, recommended purchases',
    wh_stock: 'Stock',
    wh_expiring: 'Expiring soon',
    wh_reco: 'Recommended purchase',
    wh_unit_kg: 'kg', wh_unit_l: 'L', wh_unit_pc: 'pcs',
    wh_today: 'today', wh_tomorrow: 'tomorrow',
    wh_order: 'Order',

    staff_title: 'Staff',
    staff_sub: 'Who is working right now',
    staff_on: 'On shift', staff_off: 'Off shift',
    role_waiter: 'Waiter', role_cook: 'Cook', role_bar: 'Bartender', role_manager: 'Manager', role_host: 'Host',

    sup_title: 'Suppliers',
    sup_sub: 'Terms, deliveries, deviations',
    sup_price: 'Price per unit',
    sup_delivery: 'Delivery day',
    sup_last: 'Last delivery',
    sup_dev: 'Deviations',
    sup_add_note: '+ Add note',
    sup_new_note: 'Recording…',

    set_title: 'Settings',
    set_sub: 'Profile, equipment, language, currency',
    set_profile: 'Restaurant profile',
    set_name: 'Name', set_addr: 'Address', set_tables: 'Number of tables',
    set_equipment: 'Equipment',
    set_roles: 'Roles & access',
    set_locale: 'Language & currency',
    set_lang: 'Interface language',
    set_cur: 'Currency',

    today: 'Today', export: 'Export',
  },
};

// Currency — no symbols in KPI numbers; symbol used only where explicit money labels are shown
const CUR = {
  UAH: { sym: '₴', rate: 1, name: 'Гривня (₴)', nameEn: 'Hryvnia (₴)' },
  USD: { sym: '$', rate: 1/40, name: 'Долар ($)', nameEn: 'US Dollar ($)' },
  EUR: { sym: '€', rate: 1/44, name: 'Євро (€)', nameEn: 'Euro (€)' },
};

function fmtNum(n, lang) {
  return n.toLocaleString(lang === 'en' ? 'en-US' : 'uk-UA');
}

// Plain number in current currency (no symbol) — for KPIs and inline values
function fmtMoneyPlain(amountUah, currency, lang) {
  const v = amountUah * CUR[currency].rate;
  return Math.round(v).toLocaleString(lang === 'en' ? 'en-US' : 'uk-UA');
}

// With symbol — used only where a money label is explicitly needed
function fmtMoney(amountUah, currency, lang) {
  const n = fmtMoneyPlain(amountUah, currency, lang);
  if (currency === 'USD') return '$' + n;
  if (currency === 'EUR') return '€' + n;
  return n + '\u00A0₴';
}

function fmtMoneyCompact(amountUah, currency) {
  const v = amountUah * CUR[currency].rate;
  if (v >= 1000) return (v / 1000).toFixed(1) + 'k';
  return Math.round(v).toString();
}

const I18nCtx = React.createContext(null);

function I18nProvider({ children }) {
  const [lang, setLang] = React.useState(() => localStorage.getItem('mozok_lang') || 'uk');
  const [currency, setCurrency] = React.useState(() => localStorage.getItem('mozok_cur') || 'UAH');
  React.useEffect(() => { localStorage.setItem('mozok_lang', lang); }, [lang]);
  React.useEffect(() => { localStorage.setItem('mozok_cur', currency); }, [currency]);
  const t = DICT[lang];
  const value = {
    lang, setLang, currency, setCurrency, t,
    money: (n) => fmtMoney(n, currency, lang),
    moneyPlain: (n) => fmtMoneyPlain(n, currency, lang),
    moneyK: (n) => fmtMoneyCompact(n, currency),
    num: (n) => fmtNum(n, lang),
    sym: CUR[currency].sym,
  };
  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

const useI18n = () => React.useContext(I18nCtx);

Object.assign(window, { I18nProvider, useI18n, DICT, CUR });
