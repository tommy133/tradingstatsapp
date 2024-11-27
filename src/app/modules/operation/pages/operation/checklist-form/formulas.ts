export function getPotentialDirection(checklist: any) {
  //if is minor timeframe we dont check the context
  if (checklist.minorTimeframe) {
    if (isAccumulation(checkAccumulation(checklist)))
      return checkAccumulation(checklist);
    else if (isDistribution(checkDistribution(checklist)))
      return checkDistribution(checklist);
  } else if (checklist.context) {
    return checkAccumulation(checklist);
  } else if (checklist.context === false) {
    return checkDistribution(checklist);
  }
  return '';
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

function checkAccumulation(checklist: any) {
  return checklist.volume && (checklist.shakeout || checklist.jac)
    ? 'ACCUMULATION'
    : 'EQUILIBRIUM';
}

function checkDistribution(checklist: any) {
  return checklist.volume === false &&
    (checklist.shakeout === false || checklist.jac === false)
    ? 'DISTRIBUTION'
    : 'EQUILIBRIUM';
}
