export const colors = {
  background: '#0D0F0D',
  surface: '#1A1D1A',
  surfaceElevated: '#22261F',
  border: '#2E332C',
  primary: '#3FA34D',
  primaryDark: '#2E7D32',
  primaryMuted: 'rgba(63, 163, 77, 0.15)',
  text: '#FFFFFF',
  textMuted: '#9AA39A',
  textFaint: '#6E766E',
  danger: '#E5484D',
  dangerMuted: 'rgba(229, 72, 77, 0.15)',
  warning: '#F5A524',
  warningMuted: 'rgba(245, 165, 36, 0.15)',
  info: '#2196F3',
};

export function statusColor(score: number) {
  if (score >= 70) return colors.primary;
  if (score >= 40) return colors.warning;
  return colors.danger;
}

export function statusMutedColor(score: number) {
  if (score >= 70) return colors.primaryMuted;
  if (score >= 40) return colors.warningMuted;
  return colors.dangerMuted;
}
