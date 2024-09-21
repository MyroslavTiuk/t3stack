import React from 'react';
import StoryView from '../Story';
import ExpandableGroupView from './ExpandableGroup.view';
// import Box from '../primitives/Box';
import T from '../Typo';

const ExpandableGroupStory = () => {
  return (
    <div className={'grid'}>
      <StoryView title={'Basic'} className={'_4 _tab-6 _mob-12'}>
        <ExpandableGroupView
          groups={{
            Details: (
              <div>
                <T>Hi these are details</T>
              </div>
            ),
            'Group 2': (
              <div>
                <T>Hi these are group</T>
                <T>Hi these are 2</T>
              </div>
            ),
          }}
          defaultShowing={{ Details: true }}
        />
      </StoryView>
    </div>
  );
};

export default ExpandableGroupStory;
