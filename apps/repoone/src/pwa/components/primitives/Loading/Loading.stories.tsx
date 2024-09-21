import React from 'react';
import Story from '../Story';
import Box from '../Box';
import Loading from './Loading.view';

const LoadingStory = () => {
  return (
    <Box className="grid">
      <Story title="Basic">
        <Loading />
      </Story>
    </Box>
  );
};

export default LoadingStory;
