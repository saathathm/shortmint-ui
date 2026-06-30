import { Check } from 'lucide-react'

const STYLES = [
  {
    id: 'blur',
    label: 'Blur Background',
    description: 'Your video centred on a blurred version of itself',
    icon: '🎬',
  },
  {
    id: 'crop',
    label: '9:16 Crop',
    description: 'Smart centre-crop to portrait format',
    icon: '✂️',
  },
  {
    id: 'custom',
    label: 'Custom Background',
    description: 'Add your own after clipping or keep it as is',
    icon: '🖼️',
  },
]

export default function StylePicker({ value, onChange }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {STYLES.map((style) => {
        const active = value === style.id
        return (
          <button
            key={style.id}
            type="button"
            onClick={() => onChange(style.id)}
            className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 ${
              active
                ? 'border-primary bg-bg-secondary'
                : 'border-border bg-bg-surface hover:border-gray-300'
            }`}
          >
            {active && (
              <span className="absolute top-3 right-3 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                <Check size={12} className="text-white" />
              </span>
            )}
            <span className="text-2xl mb-2 block">{style.icon}</span>
            <p className={`font-semibold text-sm ${active ? 'text-primary' : 'text-text-primary'}`}>
              {style.label}
            </p>
            <p className="text-xs text-text-muted mt-0.5 leading-relaxed">{style.description}</p>
          </button>
        )
      })}
    </div>
  )
}
