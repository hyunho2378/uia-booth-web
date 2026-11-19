import { asset } from '../../utils/asset'

export default function UiaMark({ className = '', title = 'UIA', height = '1.4rem' }) {
  return (
    <img
      className={className}
      src={asset('/brand/uia-logo-official.svg')}
      alt={title}
      style={{ height, width: 'auto', aspectRatio: '288 / 132', flex: 'none' }}
    />
  )
}
