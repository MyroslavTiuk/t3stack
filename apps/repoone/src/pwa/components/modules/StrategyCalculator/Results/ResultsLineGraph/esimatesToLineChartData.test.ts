import estimatesToLineChartData from './estimatesToLineChartData';

const testData = {
  initial: {
    contractsPerShare: 100,
    gross: -540,
    legs: {
      option: {
        value: 5.4,
        act: 'buy',
        num: 1,
      },
    },
  },
  theoPoints: {
    '103': {
      '20200924_0930': {
        gross: 227.09,
        legs: {
          option: {
            value: 2.2709,
          },
        },
      },
      '20200925_0930': {
        gross: 119.97,
        legs: {
          option: {
            value: 1.1997,
          },
        },
      },
      '20200925_1600': {
        gross: 50,
        legs: {
          option: {
            value: 0.5,
          },
        },
      },
    },
    '104': {
      '20200924_0930': {
        gross: 285.89,
        legs: {
          option: {
            value: 2.8589,
          },
        },
      },
      '20200925_0930': {
        gross: 186.85,
        legs: {
          option: {
            value: 1.8685,
          },
        },
      },
      '20200925_1600': {
        gross: 150,
        legs: {
          option: {
            value: 1.5,
          },
        },
      },
    },
    '105': {
      '20200924_0930': {
        gross: 352.09,
        legs: {
          option: {
            value: 3.5209,
          },
        },
      },
      '20200925_0930': {
        gross: 267.31,
        legs: {
          option: {
            value: 2.6731,
          },
        },
      },
      '20200925_1600': {
        gross: 250,
        legs: {
          option: {
            value: 2.5,
          },
        },
      },
    },
    '106': {
      '20200924_0930': {
        gross: 425.06,
        legs: {
          option: {
            value: 4.2506,
          },
        },
      },
      '20200925_0930': {
        gross: 357.22,
        legs: {
          option: {
            value: 3.5722,
          },
        },
      },
      '20200925_1600': {
        gross: 350,
        legs: {
          option: {
            value: 3.5,
          },
        },
      },
    },
  },
  summary: {
    maxReturn: null,
    maxReturnPrice: null,
    maxRisk: -540,
    maxRiskPrice: 102.5,
    maxRisk1SD: -79.94,
    maxRisk2SD: -540,
    maxRisk1SDprice: 107.10063191551771,
    prices1SD: {
      '107.10063191551771': 460.06,
      '117.45936808448228': 1495.94,
    },
    maxRisk1SDpriceRel: -1,
    maxRisk2SDprice: 101.92126383103542,
    prices2SD: {
      '101.92126383103542': 0,
      '122.63873616896458': 2013.87,
    },
    maxRisk2SDpriceRel: -1,
    breakevens: [107.9],
    collateral: null,
    roiCollateral: null,
  },
};

describe('estimatesToLineChartData', () => {
  it('should return the formatted lineChartData', () => {
    const lineChartData = estimatesToLineChartData({
      // @ts-ignore
      estimate: testData,
      displayValueType: 'ROI_MAX_RISK',
      strategyScale: 100,
      isPercentageUnit: true,
    });

    expect(lineChartData).toEqual({
      dataSet: [
        {
          xValue: 103,
          '24th Sep 2020': -57.946296296296296,
          '25th Sep 2020': -90.74074074074075,
        },
        {
          xValue: 104,
          '24th Sep 2020': -47.05740740740741,
          '25th Sep 2020': -72.22222222222221,
        },
        {
          xValue: 105,
          '24th Sep 2020': -34.79814814814815,
          '25th Sep 2020': -53.70370370370371,
        },
        {
          xValue: 106,
          '24th Sep 2020': -21.285185185185185,
          '25th Sep 2020': -35.18518518518518,
        },
      ],
      legends: [
        { label: '24th Sep 2020', color: '#478AEF' },
        { label: '25th Sep 2020', color: '#8AA6D1' },
      ],
    });
  });

  it('should return 2 decimal places if the isPercantageUni is false for the other data values', () => {
    const lineChartData = estimatesToLineChartData({
      // @ts-ignore
      estimate: testData,
      displayValueType: 'ROI_MAX_RISK',
      strategyScale: 100,
      isPercentageUnit: false,
    });

    expect(lineChartData).toEqual({
      dataSet: [
        {
          xValue: 103,
          '24th Sep 2020': -57.946296296296296,
          '25th Sep 2020': -90.74074074074075,
        },
        {
          xValue: 104,
          '24th Sep 2020': -47.05740740740741,
          '25th Sep 2020': -72.22222222222221,
        },
        {
          xValue: 105,
          '24th Sep 2020': -34.79814814814815,
          '25th Sep 2020': -53.70370370370371,
        },
        {
          xValue: 106,
          '24th Sep 2020': -21.285185185185185,
          '25th Sep 2020': -35.18518518518518,
        },
      ],
      legends: [
        { label: '24th Sep 2020', color: '#478AEF' },
        { label: '25th Sep 2020', color: '#8AA6D1' },
      ],
    });
  });
});
