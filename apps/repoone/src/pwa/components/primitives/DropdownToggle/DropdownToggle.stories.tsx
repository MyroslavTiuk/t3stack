import React from 'react';
import Story from '../Story';
import GridCols from '../GridCols';
import DropdownToggle from './DropdownToggle';
import Button from '../Button';
import T from '../Typo';

const DropdownToggleStory = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggle = React.useCallback(() => setIsOpen((v) => !v), [setIsOpen]);

  return (
    <GridCols>
      <Story title="Basic" className="_cols-4">
        <>
          <Button text={'Toggle'} onClick={toggle} />
          <DropdownToggle open={isOpen}>
            <T>Some text to</T>
            <T>hide and show</T>
          </DropdownToggle>
        </>
      </Story>
    </GridCols>
  );
};

export default DropdownToggleStory;
