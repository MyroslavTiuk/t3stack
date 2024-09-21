import React from 'react';
import Story from '../Story';
import GridCols from '../GridCols';
import ToggleButtonPair from './ToggleButtonPair';

const ToggleButtonPairStory = () => {
  const options = {
    op1: 'Option 1',
    op2: 'Option 2',
  };
  const [value, setValue] = React.useState('op1');
  return (
    <GridCols>
      <Story title="Basic" className="_cols-4">
        <ToggleButtonPair value={value} setValue={setValue} options={options} />
      </Story>
    </GridCols>
  );
};

export default ToggleButtonPairStory;
