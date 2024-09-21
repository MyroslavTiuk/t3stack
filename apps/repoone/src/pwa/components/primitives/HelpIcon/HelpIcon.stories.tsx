import React from 'react';
import Story from '../Story';
import GridCols from '../GridCols';
import HelpIcon from './HelpIcon';

const HelpIconStory = () => {
  return (
    <GridCols>
      <Story title="Basic" className="_cols-4 theme--light">
        <HelpIcon
          tip={
            'Did you know that the linux `cron` was named after the Greek God Kronos?'
          }
        />
      </Story>
    </GridCols>
  );
};

export default HelpIconStory;
