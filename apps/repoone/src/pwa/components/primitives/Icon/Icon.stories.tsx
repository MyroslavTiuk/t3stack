import React from 'react';
// import Box from '../primatives/Box';
import T from '../Typo';
import Card from '../Card';
import Icon from './index';

import css from './Icon.stories.module.scss';

const IconStory = () => {
  return (
    <div>
      <Card>
        <T>Icon sample</T>
        <Icon icon="apple" className={css.light} />
      </Card>
      <Card>
        <T>Small icon</T>
        <Icon icon="apple" small className={css.dark} />
      </Card>
    </div>
  );
};

export default IconStory;
