import getBestNumContracts from './getBestNumContracts';

describe('api/routes/finder/get/helpers/getBestNumContracts', () => {
  const strat = '';

  test('Finds closest number, above budget up to 120%', () => {
    const budget = 100;
    const optionPrice = 0.55;
    const expected = 2;

    const result: number = getBestNumContracts(strat, budget, optionPrice);

    expect(result).toEqual(expected);
  });

  test('Finds closest number, below budget', () => {
    const budget = 100;
    const optionPrice = 0.45;
    const expected = 2;

    const result: number = getBestNumContracts(strat, budget, optionPrice);

    expect(result).toEqual(expected);
  });

  test('Finds closest number, below budget (higher num expected)', () => {
    const budget = 100;
    const optionPrice = 0.07;
    const expected = 14;

    const result: number = getBestNumContracts(strat, budget, optionPrice);

    expect(result).toEqual(expected);
  });

  test('Finds closest number, above budget (higher num expected)', () => {
    const budget = 100;
    const optionPrice = 0.06;
    const expected = 17;

    const result: number = getBestNumContracts(strat, budget, optionPrice);

    expect(result).toEqual(expected);
  });

  test('Finds closest number below budget, where above 120% would have been closer', () => {
    const budget = 100;
    const optionPrice = 0.65;
    const expected = 1;

    const result: number = getBestNumContracts(strat, budget, optionPrice);

    expect(result).toEqual(expected);
  });

  test('Budget undefined returns 1', () => {
    const budget = undefined;
    const optionPrice = 0.1;
    const expected = 1;

    const result: number = getBestNumContracts(strat, budget, optionPrice);

    expect(result).toEqual(expected);
  });

  test('Budget exceeded 120% but cant reduce num returns 1', () => {
    const budget = 100;
    const optionPrice = 1.3;
    const expected = 1;

    const result: number = getBestNumContracts(strat, budget, optionPrice);

    expect(result).toEqual(expected);
  });
});
