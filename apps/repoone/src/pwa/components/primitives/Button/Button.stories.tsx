import React from 'react';

import Button from './index';
import Box from '../Box';
import Story from '../Story';

const ButtonStory = () => {
  return (
    <Box className="grid theme--light">
      <Story title="Vanilla button" className="_4">
        <Button>This is a button</Button>
      </Story>
      <Story title="Large button" className="_4">
        <Button large>Large button</Button>
      </Story>
      <Story title="Small button" className="_4">
        <Button small>Small button</Button>
      </Story>
      <Story title="Loading" className="_4">
        <Button>Loading below</Button>
        <Button loading>Loading below</Button>
      </Story>
      <Story title="Full width" className="_4">
        <Button full-width>Wide button</Button>
      </Story>
      <Story title="Secondary button" className="_4">
        <Button secondary>Secondary button</Button>
      </Story>
      <Story title="Tertiary button" className="_4">
        <Button tertiary>Tertiary button</Button>
      </Story>
      <Story title="Outline" className="_4">
        <Button outline>Outline button</Button>
      </Story>
      <Story title="Outline secondary" className="_4">
        <Button outline secondary>
          Outline secondary
        </Button>
      </Story>
      <Story title="Disabled" className="_4">
        <Button disabled>Disabled</Button>
      </Story>
      <Story title="Disabled outline" className="_4">
        <Button disabled outline>
          Disabled outline
        </Button>
      </Story>
      <Story title="Rendered as a link" className="_4">
        <Button
          link={'/some/[pathToken]'}
          linkPayload={{ pathToken: 'path' }}
          text={'Linkey'}
        />
      </Story>
    </Box>
  );
};

export default ButtonStory;
