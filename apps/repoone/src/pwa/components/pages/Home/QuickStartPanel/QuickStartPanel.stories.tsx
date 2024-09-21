import React from 'react';
import Story from '../../../primitives/Story';
import Box from '../../../primitives/Box';
import QuickStartPanel from './index';

const QuickStartPanelStory = () => {
  return (
    <Box className="grid">
      <Story title="Basic" className="_12">
        <QuickStartPanel />
      </Story>
    </Box>
  );
};

export default QuickStartPanelStory;
