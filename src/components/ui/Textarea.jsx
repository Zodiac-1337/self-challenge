/**
 * variant: 'default' | 'danger' | 'success'
 * Прокидывает все стандартные props в <textarea>
 */

const VARIANT_CLS = {
  default: '',
  danger:  'field-danger',
  success: 'field-success',
}

export default function Textarea({ variant = 'default', className = '', ...props }) {
  return (
    <textarea
      className={`field resize-none ${VARIANT_CLS[variant]} ${className}`.trim()}
      {...props}
    />
  )
}
