export const testPartialStrategyCoveredCall = {
  id: null,
  timeFrame: null,
  underlyingElement: 'underlying',
  legsById: {
    underlying: {
      type: 'stock',
      name: 'Underlying',
      act: 'buy',
      price: 52,
      num: 100,
      settings: {
        allowPurchase: true,
      },
    },
    option: {
      type: 'option',
      name: 'Option',
      underlying: 'underlying',
      act: 'sell',
      opType: 'call',
      expiry: '2020-04-25',
      strike: 50,
      iv: 25,
      num: 1,
      price: 2.33,
    },
  },
  legs: ['underlying', 'option'],
};
