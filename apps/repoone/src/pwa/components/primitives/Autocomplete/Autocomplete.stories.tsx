import React from 'react';
import { flatten } from 'ramda';
import Autocomplete from './Autocomplete.view';
import StoryView from '../Story';

const ITEMS = ['apples', 'oranges', 'pears'];

const LONG_ITEMS = flatten(
  ITEMS.map((fruit) =>
    Array(15)
      .fill(0)
      .map((z, i) => `${fruit}${i}`),
  ),
);

const AutocompleteStory = () => {
  const [value, setValue] = React.useState('apples');
  const setValueFromTarget = setValue;

  return (
    <div className={'grid theme--light'}>
      <StoryView title={'Basic'} className={'_4'}>
        <Autocomplete
          items={ITEMS}
          value={value}
          onChange={setValueFromTarget}
          onSelect={console.log}
        />
      </StoryView>
      <StoryView title={'Basic'} className={'_4'}>
        <Autocomplete
          items={LONG_ITEMS}
          value={value}
          onChange={setValueFromTarget}
          onSelect={console.log}
        />
      </StoryView>
      <StoryView title={'Error'} className={'_4'}>
        <Autocomplete
          items={LONG_ITEMS}
          value={value}
          onChange={setValueFromTarget}
          onSelect={console.log}
          inputProps={{
            error: "I can't do that dave",
          }}
        />
      </StoryView>
    </div>
  );
};

export default AutocompleteStory;
