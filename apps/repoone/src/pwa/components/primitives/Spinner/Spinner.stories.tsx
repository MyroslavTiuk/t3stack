import React from 'react';
import Story from '../Story';
import Box from '../Box';
import Spinner from './Spinner.view';

const SpinnerStory = () => {
  return (
    <Box className="grid">
      <Story className={'_4'} title="Basic">
        <Spinner />
      </Story>
    </Box>
  );
};

export default SpinnerStory;
