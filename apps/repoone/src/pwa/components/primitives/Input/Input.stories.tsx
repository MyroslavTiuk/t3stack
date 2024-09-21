import React from 'react';
import Story from '../Story';
import Box from '../Box';

import Input from './Input.view';
import Icon from '../Icon';

const InputStory = () => {
  return (
    <>
      <Box className="grid theme--light">
        <Story title="Basic" className=" _6">
          <Input placeholder="My input" />
        </Story>
        <Story title="Inline" className="_6">
          <Input inline />
        </Story>
      </Box>
      <Box className="grid theme--dark">
        <Story title="Basic dark" className="_6">
          <Input placeholder="My input" />
        </Story>
        <Story title="Inline" className="_6">
          <Input inline />
        </Story>
      </Box>
      <Box className="grid theme--light">
        <Story title="Prefixed" className="_6">
          <label>
            <Input placeholder="My input" prefix="$" prefixWidthRem={1} />
          </label>
        </Story>
        <Story title="Error state" className="_6">
          <label>
            <Input placeholder="My input" error="Didn't quite get that" />
          </label>
        </Story>
        <Story title="PreIcon" className="_6">
          <label>
            <Input
              preIcon={<Icon icon="search" small />}
              prefixWidthRem={1.8}
              placeholder="My input"
            />
          </label>
        </Story>
        <Story title="Highlighted" className="_6">
          <label>
            <Input
              preIcon={<Icon icon="search" small />}
              prefixWidthRem={1.8}
              placeholder="My input"
              highlight
            />
          </label>
        </Story>
        <Story title="Highlighted" className="_6">
          <label>
            <Input
              preIcon={<Icon icon="search" small />}
              prefixWidthRem={1.8}
              placeholder="My input"
              highlight={'WARNING'}
            />
          </label>
        </Story>
      </Box>
    </>
  );
};

export default InputStory;
