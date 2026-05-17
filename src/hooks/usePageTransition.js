// Базовые варианты для обычных страниц (slide up)
export const pageVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
  exit:    { opacity: 0, y: -16, transition: { duration: 0.18, ease: 'easeIn' } },
}

// Для Accept — драматичный zoom-in (контракт "появляется")
export const contractVariants = {
  initial: { opacity: 0, scale: 0.92, y: 40 },
  animate: { opacity: 1, scale: 1,    y: 0,  transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit:    { opacity: 0, scale: 1.04, y: -30, transition: { duration: 0.22, ease: 'easeIn' } },
}

// Для Result — fade (не отвлекает от эмоции)
export const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit:    { opacity: 0, transition: { duration: 0.2 } },
}
