import { useCallback, useMemo, useEffect, useState } from 'react'
import Particles from 'react-tsparticles'
import { loadSlim } from 'tsparticles-slim'

export default function ParticleBackground() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Check if dark mode is active
    const isDark = document.body.classList.contains('dark-theme')
    setIsDarkMode(isDark)

    // Watch for theme changes
    const observer = new MutationObserver(() => {
      const isDarkNow = document.body.classList.contains('dark-theme')
      setIsDarkMode(isDarkNow)
    })

    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine)
  }, [])

  const particlesLoaded = useCallback(() => {}, [])

  // Dynamic color based on theme - using unique vibrant colors
  const particleColor = isDarkMode ? '#7c3aed' : '#7c3aed'
  const linkColor = isDarkMode ? '#a78bfa' : '#8b5cf6'
  const linkOpacity = isDarkMode ? 0.4 : 0.35

  const options = useMemo(() => ({
    background: {
      color: {
        value: 'transparent'
      }
    },
    fpsLimit: 60,
    particles: {
      color: {
        value: particleColor
      },
      links: {
        color: linkColor,
        distance: 150,
        enable: true,
        opacity: linkOpacity,
        width: 2.5
      },
      move: {
        direction: 'none',
        enable: true,
        outModes: {
          default: 'bounce'
        },
        random: false,
        speed: 1,
        straight: false
      },
      number: {
        density: {
          enable: true,
          area: 800
        },
        value: 55
      },
      opacity: {
        value: 0.4
      },
      shape: {
        type: 'circle'
      },
      size: {
        value: { min: 2.5, max: 5.5 }
      }
    },
    detectRetina: true
  }), [particleColor, linkColor, linkOpacity])

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={options}
      key={isDarkMode ? 'dark' : 'light'}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  )
}
