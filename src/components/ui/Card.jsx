/**
 * Базовая карточка — bg-surface + border + rounded-2xl.
 * className — доп. классы (padding, gap и т.д.)
 * style     — инлайн-стили (например, динамический border-color)
 */

export default function Card({ className = '', style, children }) {
  return (
    <div className={`card ${className}`.trim()} style={style}>
      {children}
    </div>
  )
}
