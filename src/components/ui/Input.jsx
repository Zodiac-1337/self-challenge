/**
 * variant: 'default' | 'danger' | 'success'
 * Прокидывает все стандартные props в <input>
 */

const VARIANT_CLS = {
  default: '',
  danger:  'field-danger',
  success: 'field-success',
}

export default function Input({ variant = 'default', className = '', ...props }) {
  return (
    <input
      className={`field ${VARIANT_CLS[variant]} ${className}`.trim()}
      {...props}
    />
  )
}
