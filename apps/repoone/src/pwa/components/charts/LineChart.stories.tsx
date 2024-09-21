import React from 'react';
import Story from '../primitives/Story';
import LineChart from './LineChart.view';
import Box from '../primitives/Box';

const dataSet = [
  {
    xValue: 800,
    date1: -100,
    date2: -100,
    date3: -100,
    date4: -100,
    date5: -100,
  },
  {
    xValue: 900,
    date1: -50,
    date2: -40,
    date3: -30,
    date4: -20,
    date5: -10,
  },
  {
    xValue: 912,
    date1: 10,
    date2: 22,
    date3: 34,
    date4: 46,
    date5: 58,
  },
  {
    xValue: 935,
    date1: 60,
    date2: 70,
    date3: 80,
    date4: 90,
    date5: 100,
  },
  {
    xValue: 1000,
    date1: 110,
    date2: 110,
    date3: 120,
    date4: 130,
    date5: 140,
  },
  {
    xValue: 1351,
    date1: 140,
    date2: 150,
    date3: 160,
    date4: 170,
    date5: 180,
  },
];

const randomColor = () =>
  `#${Math.floor(Math.random() * 16777215).toString(16)}`;

const LineChartStories = () => {
  return (
    <Box>
      <Story title="LineChart">
        <LineChart
          xAxisProps={{
            allowDuplicatedCategory: false,
          }}
          dataSet={dataSet}
          legends={[
            {
              label: 'date1',
              color: randomColor(),
            },
            {
              label: 'date2',
              color: randomColor(),
            },
            {
              label: 'date3',
              color: randomColor(),
            },
            {
              label: 'date4',
              color: randomColor(),
            },
            {
              label: 'date5',
              color: randomColor(),
            },
          ]}
          referenceLines={[
            {
              xValue: 1200,
              label: () => 'ATNT 1200',
            },
            {
              yValue: 80,
              label: () => 'ATNT 200',
            },
          ]}
        />
      </Story>
    </Box>
  );
};

export default LineChartStories;
