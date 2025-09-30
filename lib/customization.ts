export const AVATARS = [
  'person',
  'smart_toy',
  'psychology',
  'rocket_launch',
  'emoji_objects',
  'emoji_nature',
  'emoji_people',
  'school',
  'face',
  'pets',
  'sports_esports',
  'travel',
];

export interface Theme {
  name: string;
  colors: Record<string, string>;
}

export const THEMES: Record<string, Theme> = {
  default: {
    name: 'Padrão (Escuro)',
    colors: {
      '--primary-blue': '#1E3A8A',
      '--primary-light': '#3B82F6',
      '--accent-green': '#10B981',
      '--bg-primary': '#0F172A',
      '--bg-secondary': '#1E293B',
      '--bg-card': '#334155',
      '--text-primary': '#F8FAFC',
      '--text-secondary': '#CBD5E1',
      '--border-color': '#475569',
    },
  },
  forest: {
    name: 'Floresta',
    colors: {
      '--primary-blue': '#166534',
      '--primary-light': '#22C55E',
      '--accent-green': '#F59E0B',
      '--bg-primary': '#1C1917',
      '--bg-secondary': '#292524',
      '--bg-card': '#44403C',
      '--text-primary': '#FAFAF9',
      '--text-secondary': '#D6D3D1',
      '--border-color': '#57534E',
    },
  },
  ocean: {
    name: 'Oceano',
    colors: {
      '--primary-blue': '#0891B2',
      '--primary-light': '#06B6D4',
      '--accent-green': '#A3E635',
      '--bg-primary': '#0C2431',
      '--bg-secondary': '#153243',
      '--bg-card': '#1E4959',
      '--text-primary': '#F0F9FF',
      '--text-secondary': '#C9D6DF',
      '--border-color': '#275D6D',
    },
  },
  rose: {
    name: 'Rosa',
    colors: {
      '--primary-blue': '#BE185D',
      '--primary-light': '#EC4899',
      '--accent-green': '#F472B6',
      '--bg-primary': '#2D0F21',
      '--bg-secondary': '#4A1534',
      '--bg-card': '#642046',
      '--text-primary': '#FFF1F2',
      '--text-secondary': '#FFE4E6',
      '--border-color': '#7D2A58',
    },
  },
  light: {
    name: 'Claro',
    colors: {
      '--primary-blue': '#1E40AF',
      '--primary-light': '#3B82F6',
      '--accent-green': '#16A34A',
      '--bg-primary': '#F1F5F9',
      '--bg-secondary': '#FFFFFF',
      '--bg-card': '#E2E8F0',
      '--text-primary': '#1E293B',
      '--text-secondary': '#475569',
      '--border-color': '#CBD5E1',
    },
  },
};
