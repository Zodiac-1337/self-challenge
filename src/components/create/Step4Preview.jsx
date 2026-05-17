import Input from '../ui/Input'
import ChallengePreview from './ChallengePreview'

export default function Step4Preview({ form, set }) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="step-title">Ставка (необязательно)</h2>
        <p className="step-sub">Что ты теряешь при провале — моральное обязательство</p>
      </div>

      <Input
        value={form.stake}
        onChange={e => set('stake', e.target.value)}
        placeholder="Расскажу другу о провале / куплю кофе коллеге..."
      />

      <ChallengePreview form={form} />
    </div>
  )
}
