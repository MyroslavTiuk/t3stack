import React from 'react';
import Story from '../Story';
import GridCols from '../GridCols';
import Tooltip from './Tooltip';
import T from '../Typo';

const DemoT = ({ children }: { children: string }) => (
  <T style={{ display: 'inline-block' }}>{children}</T>
);

const TooltipStory = () => {
  return (
    <GridCols className={'theme--light'}>
      <Story title="Basic" className="_cols-4">
        <Tooltip tip={'Tooltip text here'}>
          <DemoT>Some text</DemoT>
        </Tooltip>
      </Story>
      <Story title="Right" className="_cols-4" desc={''}>
        <Tooltip right tip={'Tooltip text here'}>
          <DemoT>Some text</DemoT>
        </Tooltip>
      </Story>
      <Story title="Bottom" className="_cols-4" desc={''}>
        <Tooltip bottom tip={'Tooltip text here'}>
          <DemoT>Some text</DemoT>
        </Tooltip>
      </Story>
      <Story title="Left" className="_cols-4" desc={''}>
        <Tooltip left tip={'Tooltip text here'}>
          <DemoT>Some text</DemoT>
        </Tooltip>
      </Story>
    </GridCols>
  );
};

export default TooltipStory;
