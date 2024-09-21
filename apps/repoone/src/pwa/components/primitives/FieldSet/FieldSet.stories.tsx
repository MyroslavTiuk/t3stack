import React from 'react';
import Story from '../Story';
import GridCols from '../GridCols';
import FieldSet from './FieldSet';
import T from '../Typo';

const FieldSetStory = () => {
  return (
    <GridCols>
      <Story title="Basic" className="_cols-4 theme--light">
        <FieldSet title={'Underlying element'}>
          <T>children here</T>
        </FieldSet>
      </Story>
    </GridCols>
  );
};

export default FieldSetStory;
