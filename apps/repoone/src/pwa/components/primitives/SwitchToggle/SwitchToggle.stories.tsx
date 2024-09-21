import React from 'react';
import Story from '../Story';
import Box from '../Box';
import SwitchToggle from '.';

const SwitchToggleStory = () => {
  const [status, setStatus] = React.useState(false);
  return (
    <Box className="grid">
      <Story title="Basic">
        <SwitchToggle state={status} onChange={setStatus} />
      </Story>
    </Box>
  );
};

export default SwitchToggleStory;
