import React from 'react';
import Story from '../../../../primitives/Story';
import GridCols from '../../../../primitives/GridCols';
import IVChanger from './IVChanger';
import Box from '../../../../primitives/Box';

const IVChangerStory = () => {
  return (
    <GridCols>
      <Story title="Basic" className="_cols-4 theme--light">
        <Box p={4}>
          <Box p={4}>
            <IVChanger atmIV={34.5} ivShift={0} disabled={false} />
          </Box>
        </Box>
      </Story>
    </GridCols>
  );
};

export default IVChangerStory;
