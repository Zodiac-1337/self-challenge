import ConditionCard from '../ui/ConditionCard'

export default function ConditionsList({ challenge }) {
  return (
    <div className="flex flex-col gap-3">
      {challenge.failureCondition && (
        <ConditionCard icon="💀" label="Провал"  text={challenge.failureCondition} color="#ff3d3d" />
      )}
      {challenge.reward && (
        <ConditionCard icon="🏆" label="Награда" text={challenge.reward}           color="#00c851" />
      )}
      {challenge.stake && (
        <ConditionCard icon="⚠️" label="Ставка"  text={challenge.stake}            color="#ff9500" />
      )}
    </div>
  )
}
