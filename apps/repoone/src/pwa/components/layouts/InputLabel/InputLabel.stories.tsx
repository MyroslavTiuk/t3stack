import React from 'react';
import Story from '../../primitives/Story';
import GridCols from '../../primitives/GridCols';
import InputLabel from './InputLabel';
import Input from '../../primitives/Input/Input.view';

import css from './InputLabel.stories.module.scss';

const InputLabelStory = () => {
  return (
    <GridCols>
      <Story title="Basic" className="_cols-6">
        <InputLabel label={'My label:'}>
          <Input />
        </InputLabel>
      </Story>
      <Story title="Inline" className="_cols-6">
        <InputLabel label={'My inline label'} inline>
          <Input />
        </InputLabel>
      </Story>
      <Story title="Inline-fullsize" className="_cols-6">
        <InputLabel label={'Fullsize inline label:'} inline-fullsize>
          <Input />
        </InputLabel>
      </Story>
      <Story title="Custom width via classNameInjection" className="_cols-6">
        <InputLabel
          label={'Much longer label:'}
          labelClassName={css.label}
          inputClassName={css.input}
        >
          <Input />
        </InputLabel>
      </Story>
    </GridCols>
  );
};

export default InputLabelStory;
