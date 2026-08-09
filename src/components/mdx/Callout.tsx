import styles from './Callout.module.css';

type CalloutType = 'info' | 'tip' | 'warning' | 'error';

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
}

const ICONS: Record<CalloutType, string> = {
  info: 'ℹ️',
  tip: '💡',
  warning: '⚠️',
  error: '🚨',
};

export default function Callout({ type = 'info', title, children }: CalloutProps) {
  return (
    <div className={`${styles.callout} ${styles[type]}`}>
      <div className={styles.header}>
        <span className={styles.icon}>{ICONS[type]}</span>
        {title && <span className={styles.title}>{title}</span>}
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
