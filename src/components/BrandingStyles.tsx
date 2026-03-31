import { useOnboarding } from '@/context/OnboardingContext'

function hexToHSL(hex: string): string | null {
  if (!hex || !hex.startsWith('#')) return null
  const r = parseInt(hex.slice(1, 3), 16) / 255
  const g = parseInt(hex.slice(3, 5), 16) / 255
  const b = parseInt(hex.slice(5, 7), 16) / 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return `0 0% ${Math.round(l * 100)}%`
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max - min)
  let h = 0
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
}

export function BrandingStyles() {
  const { branding } = useOnboarding()
  const primaryHSL = hexToHSL(branding.primaryColor)
  const accentHSL = hexToHSL(branding.accentColor)

  if (!primaryHSL && !accentHSL) return null

  const css = `
    :root, .dark {
      ${primaryHSL ? `--primary: ${primaryHSL}; --ring: ${primaryHSL}; --sidebar-primary: ${primaryHSL}; --teal-glow: ${primaryHSL};` : ''}
      ${accentHSL ? `--accent: ${accentHSL}; --sidebar-accent: ${accentHSL};` : ''}
    }
    ${branding.primaryColor && branding.accentColor ? `
    .gradient-teal { background: linear-gradient(135deg, ${branding.primaryColor}, ${branding.accentColor}) !important; }
    .text-gradient-teal { background: linear-gradient(135deg, ${branding.primaryColor}, ${branding.accentColor}) !important; -webkit-background-clip: text !important; -webkit-text-fill-color: transparent !important; background-clip: text !important; }
    ` : ''}
  `

  return <style dangerouslySetInnerHTML={{ __html: css }} />
}
