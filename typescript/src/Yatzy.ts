type YatzyFn = (...dices: number[]) => number;

function chance(...dices: number[]): number {
  return dices.reduce((acc, dice) => acc + dice, 0);
}

function getStats(dices: number[]): { face: number; count: number }[] {
  return dices
    .reduce((stats, dice) => {
      stats[6 - dice] += 1;
      return stats;
    }, Array(6).fill(0))
    .map((count, face) => ({ face: 6 - face, count }));
}

function single(face: number): YatzyFn {
  return (...dices: number[]): number =>
    dices.filter((dice) => dice === face).reduce((acc, dice) => acc + dice, 0);
}

function straight(compareWith: string): YatzyFn {
  return (...dices: number[]): number =>
    dices.sort().toString() === compareWith ? chance(...dices) : 0;
}

function sumMultiples(
  multiple: number,
  limitSameOfAKind = 1,
  strictFilter = false
): YatzyFn {
  return (...dices: number[]): number => {
    const pairs = getStats(dices)
      .filter(({ count }) => strictFilter ? count === multiple : count >= multiple)
      .slice(0, limitSameOfAKind);

    return limitSameOfAKind && pairs.length !== limitSameOfAKind
      ? 0
      : pairs.reduce((acc, pair) => acc + pair.face * multiple, 0);
  };
}

module.exports = {
  chance,

  ones: single(1),
  twos: single(2),
  threes: single(3),
  fours: single(4),
  fives: single(5),
  sixes: single(6),

  pair: sumMultiples(2),
  twoPairs: sumMultiples(2, 2),
  threeOfAKind: sumMultiples(3),
  fourOfAKind: sumMultiples(4),
  fullHouse: (...dices: number[]): number => {
    const sum2 = sumMultiples(2, 1, true)(...dices);
    if (!sum2) return 0;

    const sum3 = sumMultiples(3, 1, true)(...dices);
    if (!sum3) return 0;

    return sum2 + sum3;
  },

  smallStraight: straight('1,2,3,4,5'),
  largeStraight: straight('2,3,4,5,6'),

  yatzy: (...dices: number[]) => ([...new Set(dices)].length === 1 ? 50 : 0),
};
