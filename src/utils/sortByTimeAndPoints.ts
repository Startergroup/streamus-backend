// @ts-ignore
export default (a: any, b: any): number => {
  if (a.time && b.time) {
    const [minutesA, secondsA] = a.time.split(':')
    const [minutesB, secondsB] = b.time.split(':')
    const secondsTotalA = (parseInt(minutesA) * 60) + parseInt(secondsA)
    const secondsTotalB = (parseInt(minutesB) * 60) + parseInt(secondsB)

    if (a.points > b.points) return -1
    if (a.points < b.points) return 1
    // при равных score сортируем по time
    if (secondsTotalA < secondsTotalB) return -1
    if (secondsTotalA > secondsTotalB) return 1

    return 0
  } else {
    if (a.points > b.points) return -1
  }
}
