import React from 'react';
import Story from '../Story';
import Box from '../Box';
import GridCols from './index';
import T from '../Typo';
import Card from '../Card';

const GridColsStory = () => {
  return (
    <>
      <T>
        See _grid.scss for more information on the global classnames that the
        GridCols immediate children can use to specify their width
      </T>
      <GridCols>
        <Story title="4 Column" className="_cols-12" desc="className='_cols-4'">
          <Box p={1 / 4}>
            <GridCols dont-hide-content>
              <Card className="_cols-4">4</Card>
              <Card className="_cols-4">4</Card>
              <Card className="_cols-4">4</Card>
            </GridCols>
          </Box>
        </Story>
        <Story title="3 Column" className="_cols-12" desc="className='_cols-3'">
          <GridCols>
            <Box className="_cols-3" style={{ border: '1px solid red' }}>
              3
            </Box>
            <Box className="_cols-3" style={{ border: '1px solid red' }}>
              3
            </Box>
            <Box className="_cols-3" style={{ border: '1px solid red' }}>
              3
            </Box>
            <Box className="_cols-3" style={{ border: '1px solid red' }}>
              3
            </Box>
          </GridCols>
        </Story>
        <Story title="Mixed columns" className="_cols-12">
          <GridCols>
            <Box className="_cols-4" style={{ border: '1px solid red' }}>
              4
            </Box>
            <Box className="_cols-3" style={{ border: '1px solid red' }}>
              3
            </Box>
            <Box className="_cols-5" style={{ border: '1px solid red' }}>
              5
            </Box>
          </GridCols>
        </Story>
        <Story
          title="Responsive"
          className="_cols-12"
          desc="className='_cols-mob-12 _cols-tab-6 _cols-dsk-4'"
        >
          <GridCols>
            <Box
              className="_cols-mob-12 _cols-tab-12 _cols-dsk-4"
              style={{ border: '1px solid red' }}
            >
              12/12/4
            </Box>
            <Box
              className="_cols-mob-12 _cols-tab-6 _cols-dsk-4"
              style={{ border: '1px solid red' }}
            >
              12/6/4
            </Box>
            <Box
              className="_cols-mob-12 _cols-tab-6 _cols-dsk-4"
              style={{ border: '1px solid red' }}
            >
              12/6/4
            </Box>
          </GridCols>
        </Story>
      </GridCols>
    </>
  );
};

export default GridColsStory;
