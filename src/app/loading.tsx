import { ProgressSpinner } from 'primereact/progressspinner';

export default function Loading() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <ProgressSpinner strokeWidth="5" fill="var(--surface-ground)" animationDuration=".5s" style={{ margin: 'auto' }} />
        </div>
      );
}
