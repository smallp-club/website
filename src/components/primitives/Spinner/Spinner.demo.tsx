import { Spinner } from './index';

export function SpinnerDemo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
      <Spinner size={18} label="Lädt" />
      <Spinner size={24} label="Lädt mittel" />
      <Spinner size={36} label="Lädt groß" />
    </div>
  );
}
