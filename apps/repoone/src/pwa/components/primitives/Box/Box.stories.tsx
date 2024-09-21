import React from 'react';
import Story from '../Story';
import GridCols from '../GridCols';
import Box from './index';
import T from '../Typo';

import css from './Box.stories.module.scss';

const BoxStory = () => {
  return (
    <Box>
      <GridCols>
        <Story title="Basic" className="_cols-4">
          <Box className={css.exampleBox}>
            <T>In the box</T>
          </Box>
        </Story>
        <Story
          title="with padding"
          className="_cols-4"
          desc={`ph={1} pv={1 / 2}`}
        >
          <Box className={css.exampleBox} ph={1} pv={1 / 2}>
            <T>Padding amounts relate to $pad in _variables.scss</T>
          </Box>
        </Story>
        <Story
          title="with margin"
          className="_cols-4"
          desc={`mh={1} mv={1 / 2}`}
        >
          <Box className={css.exampleBox} mh={1} mv={1 / 2}>
            <T>Margin amounts relate to $pad in _variables.scss</T>
          </Box>
        </Story>
        <Story title="Flex container" className="_cols-4">
          <Box className={css.exampleBox} flex>
            <T flex-1 className={css._child}>
              1
            </T>
            <T className={css._child}>2</T>
            <T className={css._child}>3</T>
          </Box>
        </Story>
        <Story title="Flex with centered content" className="_cols-4">
          <Box
            flex-center
            className={[css.exampleBox]}
            style={{ minHeight: '50px' }}
          >
            <T className={css._child}>1</T>
            <T className={css._child}>2</T>
            <T className={css._child}>3</T>
          </Box>
        </Story>
        <Story title="Flex with wrapped content" className="_cols-4">
          <Box flex-wrap className={[css.exampleBox]}>
            <T className={css._child}>1</T>
            <T className={css._child}>2</T>
            <T className={css._child}>3</T>
            <T className={css._child}>1</T>
            <T className={css._child}>2</T>
            <T className={css._child}>3</T>
            <T className={css._child}>1</T>
            <T className={css._child}>2</T>
            <T className={css._child}>3</T>
          </Box>
        </Story>
        <Story
          title="Flex with primary alignment"
          className="_cols-4"
          desc={'On Primary axis (operates on justify-content)'}
        >
          <Box flexPri={'space-between'} className={[css.exampleBox]}>
            <T className={css._child}>1</T>
            <T className={css._child}>2</T>
            <T className={css._child}>3</T>
          </Box>
        </Story>
        <Story
          title="Flex with secondary alignment"
          className="_cols-4"
          desc={'On SECondary axis (operates on align-items)'}
        >
          <Box
            flexSec={'end'}
            flexPri={'space-between'}
            className={[css.exampleBox]}
          >
            <T className={css._child}>
              1a
              <br />
              1b
            </T>
            <T className={css._child}>2</T>
            <T className={css._child}>3</T>
          </Box>
        </Story>
        <Story title="Takes any html attribute" className="_cols-4">
          <Box className={css.exampleBox} aria-role="button">
            I could be a button (I have an aria-role)
          </Box>
        </Story>
        <Story title="Can take array for className" className="_cols-4">
          <Box
            className={[
              css.exampleBox,
              css.someClassName,
              css.someOtherClassName,
              false && css.neverAppliedClass,
            ]}
          >
            Has classes, and can accept undefined | false for ease of use in
            conditionals
          </Box>
        </Story>
        <Story title="As inline-blocks" className="_cols-4">
          <Box className={css.exampleBox} inline-block>
            Box 1
          </Box>
          <Box className={css.exampleBox} inline-block>
            Box 2
          </Box>
        </Story>
      </GridCols>
    </Box>
  );
};

export default BoxStory;
