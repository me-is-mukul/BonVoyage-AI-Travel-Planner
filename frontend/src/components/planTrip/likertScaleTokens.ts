/** Outer circles largest, center smallest — five points (px diameter). */
export const LIKERT_CIRCLE_DIAMETERS_PX = [46, 36, 26, 36, 46] as const;

/** Tuned for dark surfaces (slightly brighter than print mock). */
export const LIKERT_COLORS = {
  agree: {
    label: '#2dd4bf',
    ring: 'rgb(45 212 191)',
    fill: 'rgb(20 184 166)',
  },
  neutral: {
    ring: 'rgb(148 163 184)',
    fill: 'rgb(148 163 184)',
  },
  disagree: {
    label: '#c4b5fd',
    ring: 'rgb(196 181 253)',
    fill: 'rgb(167 139 250)',
  },
} as const;
