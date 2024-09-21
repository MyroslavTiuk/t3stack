const SummaryStory = () => {
  return null;
  // <Box className="grid">
  //   <Story title="Long Call" className="_4">
  //     <Summary
  //       isCalculating={false}
  //       stratEst={{
  //         initial: {
  //           contractsPerShare: 100,
  //           gross: -857.4999999999998,
  //           legs: {
  //             option: {
  //               value: 8.575,
  //               act: 'buy' as 'buy',
  //               num: 1,
  //             },
  //           },
  //         },
  //         theoPoints: {},
  //         summary: {
  //           collateral: 0,
  //           roiCollateral: 0,
  //           maxReturn: Infinity,
  //           maxReturnPrice: Infinity,
  //           maxRisk: -857.4999999999997,
  //           maxRiskPrice: 0,
  //           maxRisk1SD: -857.4999999999997,
  //           maxRisk2SD: -857.4999999999997,
  //           maxRisk1SDprice: 302.0677487898226,
  //           prices1SD: {
  //             '302.0677487898226': 0,
  //             '340.2122512101774': 2021.23,
  //           },
  //           maxRisk1SDpriceRel: -1,
  //           maxRisk2SDprice: 282.9954975796452,
  //           prices2SD: {
  //             '282.9954975796452': 0,
  //             '359.2845024203548': 3928.45,
  //           },
  //           maxRisk2SDpriceRel: -1,
  //           breakevens: [328.58],
  //         },
  //       }}
  //     />
  //   </Story>
  //   <Story title="Short Call" className="_4">
  //     <Summary
  //       isCalculating={false}
  //       stratEst={{
  //         initial: {
  //           contractsPerShare: 100,
  //           gross: 857.4999999999998,
  //           legs: {
  //             option: {
  //               value: 8.575,
  //               act: 'sell' as 'sell',
  //               num: 1,
  //             },
  //           },
  //         },
  //         theoPoints: {},
  //         summary: {
  //           collateral: 0,
  //           roiCollateral: 0,
  //           maxReturn: 857.4999999999997,
  //           maxReturnPrice: 0,
  //           maxRisk: Infinity,
  //           maxRiskPrice: Infinity,
  //           maxRisk1SD: -1164.1200000000003,
  //           maxRisk2SD: -3071.74,
  //           maxRisk1SDprice: 340.2161811712581,
  //           prices1SD: {
  //             '302.0638188287419': 0,
  //             '340.2161811712581': -2021.62,
  //           },
  //           maxRisk1SDpriceRel: 1,
  //           maxRisk2SDprice: 359.2923623425161,
  //           prices2SD: {
  //             '282.9876376574839': 0,
  //             '359.2923623425161': -3929.24,
  //           },
  //           maxRisk2SDpriceRel: 1,
  //           breakevens: [328.58],
  //         },
  //       }}
  //     />
  //   </Story>
  //   <Story title="Long Put" className="_4">
  //     <Summary
  //       isCalculating={false}
  //       stratEst={{
  //         initial: {
  //           contractsPerShare: 100,
  //           gross: -677.4999999999998,
  //           legs: {
  //             option: {
  //               value: 6.774999999999999,
  //               act: 'buy' as 'buy',
  //               num: 1,
  //             },
  //           },
  //         },
  //         theoPoints: {},
  //         summary: {
  //           collateral: 0,
  //           roiCollateral: 0,
  //           maxReturn: 31322.5,
  //           maxReturnPrice: 0,
  //           maxRisk: -677.4999999999997,
  //           maxRiskPrice: 320,
  //           maxRisk1SD: -677.4999999999997,
  //           maxRisk2SD: -677.4999999999997,
  //           maxRisk1SDprice: 340.21593301749954,
  //           prices1SD: {
  //             '302.06406698250044': 1793.59,
  //             '340.21593301749954': 0,
  //           },
  //           maxRisk1SDpriceRel: 1,
  //           maxRisk2SDprice: 359.29186603499903,
  //           prices2SD: {
  //             '282.98813396500094': 3701.19,
  //             '359.29186603499903': 0,
  //           },
  //           maxRisk2SDpriceRel: 1,
  //           breakevens: [313.23],
  //         },
  //       }}
  //     />
  //   </Story>
  //   <Story title="Short Put" className="_4">
  //     <Summary
  //       isCalculating={true}
  //       stratEst={{
  //         initial: {
  //           contractsPerShare: 100,
  //           gross: 677.4999999999998,
  //           legs: {
  //             option: {
  //               value: 6.774999999999999,
  //               act: 'sell' as 'sell',
  //               num: 1,
  //             },
  //           },
  //         },
  //         theoPoints: {},
  //         summary: {
  //           collateral: 0,
  //           roiCollateral: 0,
  //           maxReturn: 677.4999999999997,
  //           maxReturnPrice: 320,
  //           maxRisk: -31322.5,
  //           maxRiskPrice: 0,
  //           maxRisk1SD: -1116.0700000000004,
  //           maxRisk2SD: -3023.64,
  //           maxRisk1SDprice: 302.0642771019873,
  //           prices1SD: {
  //             '302.0642771019873': -1793.57,
  //             '340.2157228980127': 0,
  //           },
  //           maxRisk1SDpriceRel: -1,
  //           maxRisk2SDprice: 282.9885542039745,
  //           prices2SD: {
  //             '282.9885542039745': -3701.14,
  //             '359.2914457960254': 0,
  //           },
  //           maxRisk2SDpriceRel: -1,
  //           breakevens: [313.23],
  //         },
  //       }}
  //     />
  //   </Story>
  //   <Story title="Call debit spread" className="_4">
  //     <Summary
  //       isCalculating={false}
  //       stratEst={{
  //         initial: {
  //           contractsPerShare: 100,
  //           gross: 2280,
  //           legs: {
  //             long: {
  //               value: 0.05,
  //               act: 'buy' as 'buy',
  //               num: 1,
  //             },
  //             short: {
  //               value: 22.85,
  //               act: 'sell' as 'sell',
  //               num: 1,
  //             },
  //           },
  //         },
  //         theoPoints: {},
  //         summary: {
  //           collateral: 0,
  //           roiCollateral: 0,
  //           maxReturn: 2280,
  //           maxReturnPrice: 300,
  //           maxRisk: -12720,
  //           maxRiskPrice: 0,
  //           maxRisk1SD: 0,
  //           maxRisk2SD: 0,
  //           maxRisk1SDprice: 306.1351637267906,
  //           prices1SD: {
  //             '306.1351637267906': 0,
  //             '336.14483627320936': 0,
  //           },
  //           maxRisk1SDpriceRel: -1,
  //           maxRisk2SDprice: 291.1303274535812,
  //           prices2SD: {
  //             '291.1303274535812': -886.97,
  //             '351.1496725464188': 0,
  //           },
  //           maxRisk2SDpriceRel: -1,
  //           breakevens: [277.2],
  //         },
  //       }}
  //     />
  //   </Story>
  //   {/*
  //   <Story title="Call credit spread" className="_4">
  //     <Summary stratEst={
  //       {
  //         'initial': {
  //           'contractsPerShare': 100,
  //           'gross': 155,
  //           'legs': {
  //             'long': { 'value': 3.95, 'act': 'sell', 'num': 1 },
  //             'short': { 'value': 2.4, 'act': 'buy', 'num': 1 },
  //           },
  //         }, 'theoPoints': {}, 'summary': { 'maxReturn': 155, 'maxRisk': 45, 'maxRisk1SD': 45, 'maxRisk2SD': 45 },
  //       }
  //     } />
  //   </Story>
  //   <Story title="Put debit spread" className="_4">
  //     <Summary stratEst={
  //       {
  //         'initial': {
  //           'contractsPerShare': 100,
  //           'gross': -46,
  //           'legs': {
  //             'long': { 'value': 0.27, 'act': 'sell', 'num': 1 },
  //             'short': { 'value': 0.73, 'act': 'buy', 'num': 1 },
  //           },
  //         }, 'theoPoints': {}, 'summary': { 'maxReturn': 154, 'maxRisk': 46, 'maxRisk1SD': 46, 'maxRisk2SD': 46 },
  //       }
  //     } />
  //   </Story>
  //   <Story title="Put credit spread" className="_4">
  //     <Summary stratEst={
  //       {
  //         'initial': {
  //           'contractsPerShare': 100,
  //           'gross': 46,
  //           'legs': {
  //             'long': { 'value': 0.27, 'act': 'buy', 'num': 1 },
  //             'short': { 'value': 0.73, 'act': 'sell', 'num': 1 },
  //           },
  //         }, 'theoPoints': {}, 'summary': { 'maxReturn': 46, 'maxRisk': 154, 'maxRisk1SD': 138.61, 'maxRisk2SD': 154 },
  //       }
  //     } />
  //   </Story>
  //   <Story title="Covered Call" className="_4">
  //     <Summary stratEst={
  //       {
  //         'initial': {
  //           'contractsPerShare': 100,
  //           'gross': -12279,
  //           'legs': {
  //             'underlying': { 'value': 123.69, 'act': 'buy', 'num': 100 },
  //             'option': { 'value': 0.9, 'act': 'sell', 'num': 1 },
  //           },
  //         },
  //         'theoPoints': {},
  //         'summary': {
  //           'maxReturn': 221,
  //           'maxRisk': 12279,
  //           'maxRisk1SD': 261.58439280046383,
  //           'maxRisk2SD': 613.1687856009253,
  //         },
  //       }
  //     } />
  //   </Story>
  //   <Story title="No profit" className="_4">
  //     <Summary stratEst={{
  //       initial: {
  //         gross: -100,
  //         contractsPerShare: 100,
  //         legs: {}
  //       },
  //       theoPoints: {},
  //       summary: {
  //         maxReturn: -50,
  //         maxRisk: 100,
  //         maxRisk1SD: 67.3,
  //         maxRisk2SD: 100,
  //       }
  //     }} />
  //   </Story>
  //   <Story title="No Risk" className="_4">
  //     <Summary stratEst={{
  //       initial: {
  //         gross: -100,
  //         contractsPerShare: 100,
  //         legs: {}
  //       },
  //       theoPoints: {},
  //       summary: {
  //         maxReturn: 50,
  //         maxRisk: -100,
  //         maxRisk1SD: 67.3,
  //         maxRisk2SD: 100,
  //       }
  //     }} />
  //   </Story> */}
  // </Box>
};

export default SummaryStory;
