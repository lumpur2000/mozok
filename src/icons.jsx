// Lucide-style line icons, stroke 1.75 for clarity
const Ic = ({ d, size = 18, stroke = 1.75, fill = 'none' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">
    {typeof d === 'string' ? <path d={d} /> : d}
  </svg>
);

const Icons = {
  Brain: (p) => <Ic {...p} d={<g>
    <path d="M9.5 3.5a2.5 2.5 0 0 0-2.5 2.5v0a2.5 2.5 0 0 0-2 4 2.5 2.5 0 0 0 0 4 2.5 2.5 0 0 0 2 4 2.5 2.5 0 0 0 4.5 1.5V4a2.5 2.5 0 0 0-2-0.5Z"/>
    <path d="M14.5 3.5A2.5 2.5 0 0 1 17 6v0a2.5 2.5 0 0 1 2 4 2.5 2.5 0 0 1 0 4 2.5 2.5 0 0 1-2 4 2.5 2.5 0 0 1-4.5 1.5V4a2.5 2.5 0 0 1 2-0.5Z"/>
    <path d="M9 10h1M14 10h1M9 14h1M14 14h1"/>
  </g>}/>,
  Home: (p) => <Ic {...p} d="M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>,
  Pulse: (p) => <Ic {...p} d="M3 12h3l2-5 4 10 2-5h7"/>,
  Chart: (p) => <Ic {...p} d={<g><path d="M3 3v18h18"/><path d="M7 15V9M12 15V5M17 15v-4"/></g>}/>,
  Menu: (p) => <Ic {...p} d={<g><path d="M4 6h16M4 12h16M4 18h10"/></g>}/>,
  Users: (p) => <Ic {...p} d={<g><circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.6"/><path d="M15 14.5c1-0.3 2-0.5 3-0.5 2.5 0 4 1.5 4 4"/></g>}/>,
  Truck: (p) => <Ic {...p} d={<g><path d="M2 7h11v9H2zM13 10h5l3 3v3h-8z"/><circle cx="6" cy="18" r="1.8"/><circle cx="17" cy="18" r="1.8"/></g>}/>,
  Gear: (p) => <Ic {...p} d={<g><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></g>}/>,
  ArrowUp: (p) => <Ic {...p} d="M7 17 17 7M9 7h8v8"/>,
  ArrowDown: (p) => <Ic {...p} d="M7 7l10 10M17 9v8H9"/>,
  Mic: (p) => <Ic {...p} d={<g><rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8"/></g>}/>,
  Send: (p) => <Ic {...p} d="M4 12 21 4l-7 17-3-7z"/>,
  Search: (p) => <Ic {...p} d={<g><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></g>}/>,
  Bell: (p) => <Ic {...p} d={<g><path d="M6 16a2 2 0 0 1-2-2c1 0 2-3 2-6a6 6 0 0 1 12 0c0 3 1 6 2 6a2 2 0 0 1-2 2z"/><path d="M10 20a2 2 0 0 0 4 0"/></g>}/>,
  Receipt: (p) => <Ic {...p} d="M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6M9 16h4"/>,
  Clock: (p) => <Ic {...p} d={<g><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></g>}/>,
  CircleCheck: (p) => <Ic {...p} d={<g><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></g>}/>,
  Stop: (p) => <Ic {...p} d={<g><circle cx="12" cy="12" r="9"/><path d="M8 8l8 8M16 8l-8 8"/></g>}/>,
  Ready: (p) => <Ic {...p} d={<g><path d="M4 10h16v2a8 8 0 0 1-16 0zM3 10h18M8 6V4M12 6V4M16 6V4"/></g>}/>,
  Card: (p) => <Ic {...p} d={<g><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h3"/></g>}/>,
  User: (p) => <Ic {...p} d={<g><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8"/></g>}/>,
  Sparkle: (p) => <Ic {...p} d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>,
  Plus: (p) => <Ic {...p} d="M12 5v14M5 12h14"/>,
  Filter: (p) => <Ic {...p} d="M3 5h18l-7 9v5l-4 2v-7z"/>,
  ChevronRight: (p) => <Ic {...p} d="m9 6 6 6-6 6"/>,
  Dot: (p) => <Ic {...p} fill="currentColor" stroke="none" d="M12 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/>,
  Box: (p) => <Ic {...p} d={<g><path d="M3 7l9-4 9 4v10l-9 4-9-4z"/><path d="M3 7l9 4 9-4M12 11v10"/></g>}/>,
  Alert: (p) => <Ic {...p} d={<g><path d="M12 3 2 20h20z"/><path d="M12 10v4M12 17v.01"/></g>}/>,
  ChevronDown: (p) => <Ic {...p} d="m6 9 6 6 6-6"/>,
};

window.Icons = Icons;
