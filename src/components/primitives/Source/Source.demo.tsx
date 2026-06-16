import { Source } from './index';

export function SourceDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <Source
        author="Veale et al."
        publication="BJU International"
        year={2015}
        n={15521}
      />

      <Source
        author="Lever et al."
        publication="Psychology of Men & Masculinity"
        year={2006}
        n={52031}
      />

      <Source
        author="Sharp & Oates"
        publication="Aesthetic Surgery Journal"
        year={2019}
        doi="10.1093/asj/sjz039"
      />

      <Source
        author="Veale et al."
        publication="BJU International"
        year={2015}
        n={15521}
        locale="en"
      />
    </div>
  );
}
