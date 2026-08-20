export interface ValueItem {
  title: string;
  description: string;
  icon: string;
}

export const aboutValues: ValueItem[] = [
  {
    title: 'Strategic Rigor',
    description: 'We base decisions on empirical performance data and high-conviction market research.',
    icon: '🎯',
  },
  {
    title: 'Velocity & Agility',
    description: 'Rapid creative iteration and continuous optimization sprints to outperform the market.',
    icon: '⚡',
  },
  {
    title: 'Radical Transparency',
    description: 'Direct Slack communication, live metrics dashboards, and no hidden agency markups.',
    icon: '🔍',
  },
  {
    title: 'Net-Profitable Scale',
    description: 'Every dirham, dollar, or euro spent is measured against true bottom-line contribution.',
    icon: '📈',
  },
];

export function getAboutValues(): ValueItem[] {
  return aboutValues;
}
