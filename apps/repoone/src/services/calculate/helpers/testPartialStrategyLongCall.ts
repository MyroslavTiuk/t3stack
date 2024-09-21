export const testPartialStrategyLongCall = {
  id: null,
  timeFrame: null,
  underlyingElement: 'underlying',
  legsById: {
    option: {
      type: 'option',
      name: 'Option',
      underlying: 'underlying',
      act: 'buy',
      opType: 'call',
      expiry: '2020-04-25',
      strike: 50,
      iv: 50.73,
      num: 1,
      price: 2,
    },
    underlying: {
      type: 'stock',
      contractsPerShare: 100,
      price: 50,
    },
  },
  legs: ['option'],
};
