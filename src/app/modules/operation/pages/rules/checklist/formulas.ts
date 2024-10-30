export function getPotentialDirection(checklist: any) {
  if (checklist.context) {
    return checklist.volume && (checklist.shakeout || checklist.jac)
      ? 'ACCUMULATION'
      : 'EQUILIBRIUM';
  } else if (checklist.context === false) {
    return checklist.volume === false &&
      (checklist.shakeout === false || checklist.jac === false)
      ? 'DISTRIBUTION'
      : 'EQUILIBRIUM';
  }
  return 'EQUILIBRIUM';
}

export function isAccumulation(state: string) {
  return state === 'ACCUMULATION';
}
export function isDistribution(state: string) {
  return state === 'DISTRIBUTION';
}
export function isEquilibrium(state: string) {
  return state === 'EQUILIBRIUM';
}
