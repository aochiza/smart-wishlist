import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts';
import { useApp } from '../hooks/useApp';
import { STATUS_LABELS, PRIORITY_LABELS, WishStatus, WishPriority } from '../types';
import { calcProgress } from '../utils';
import styles from './Statistics.module.css';

const STATUS_COLORS: Record<WishStatus, string> = {
  want: '#6c47ff',
  planning: '#3b82f6',
  saving: '#f59e0b',
  bought: '#22c55e',
};

const PRIORITY_COLORS: Record<WishPriority, string> = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#22c55e',
};

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 8,
      padding: '8px 12px',
      fontSize: 13,
      color: 'var(--text)',
      boxShadow: 'var(--shadow)',
    }}>
      <strong>{payload[0].name}</strong>: {payload[0].value}
    </div>
  );
};

export default function StatisticsPage() {
  const { state } = useApp();
  const wishes = state.wishes;

  // by status
  const statusData = (['want', 'planning', 'saving', 'bought'] as WishStatus[]).map(s => ({
    name: STATUS_LABELS[s],
    value: wishes.filter(w => w.status === s).length,
    color: STATUS_COLORS[s],
  })).filter(d => d.value > 0);

  // by priority
  const priorityData = (['high', 'medium', 'low'] as WishPriority[]).map(p => ({
    name: PRIORITY_LABELS[p],
    value: wishes.filter(w => w.priority === p).length,
    color: PRIORITY_COLORS[p],
  })).filter(d => d.value > 0);

  // by category
  const catMap: Record<string, number> = {};
  wishes.forEach(w => { catMap[w.category] = (catMap[w.category] || 0) + 1; });
  const categoryData = Object.entries(catMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // progress goals
  const savingWishes = wishes.filter(w => w.status === 'saving' && w.price > 0);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.heading}>Аналитика</h1>
        <p className={styles.sub}>Визуализация ваших целей и накоплений</p>
      </div>

      <div className={styles.chartsGrid}>
        {/* Status pie */}
        <div className={styles.chart}>
          <h2 className={styles.chartTitle}>По статусам</h2>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={90}
                  dataKey="value" paddingAngle={3} nameKey="name">
                  {statusData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : <div className={styles.empty}>Нет данных</div>}
          <div className={styles.legend}>
            {statusData.map(d => (
              <div key={d.name} className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: d.color }} />
                <span>{d.name}</span>
                <span className={styles.legendVal}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Priority pie */}
        <div className={styles.chart}>
          <h2 className={styles.chartTitle}>По приоритету</h2>
          {priorityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={priorityData} cx="50%" cy="50%" innerRadius={55} outerRadius={90}
                  dataKey="value" paddingAngle={3} nameKey="name">
                  {priorityData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : <div className={styles.empty}>Нет данных</div>}
          <div className={styles.legend}>
            {priorityData.map(d => (
              <div key={d.name} className={styles.legendItem}>
                <span className={styles.legendDot} style={{ background: d.color }} />
                <span>{d.name}</span>
                <span className={styles.legendVal}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category bar */}
        {categoryData.length > 0 && (
          <div className={`${styles.chart} ${styles.wide}`}>
            <h2 className={styles.chartTitle}>По категориям</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={categoryData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--text-2)' }} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-2)' }} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" fill="var(--accent)" radius={[4, 4, 0, 0]} name="Количество" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Savings progress */}
        {savingWishes.length > 0 && (
          <div className={`${styles.chart} ${styles.wide}`}>
            <h2 className={styles.chartTitle}>Прогресс накоплений</h2>
            <div className={styles.progressList}>
              {savingWishes.map(w => {
                const pct = calcProgress(w);
                return (
                  <div key={w.id} className={styles.progressItem}>
                    <div className={styles.progMeta}>
                      <span className={styles.progName}>{w.title}</span>
                      <span className={styles.progPct}>{pct}%</span>
                    </div>
                    <div className={styles.progBar}>
                      <div className={styles.progFill} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
