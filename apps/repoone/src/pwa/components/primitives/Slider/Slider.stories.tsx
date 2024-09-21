import React from 'react';

import noop from '../../../../utils/Functional/noop';

import Story from '../Story';
import Box from '../Box';
import PriceSlider from './PriceSlider';
import IVSlider from './IVSlider';

const SliderStory = () => {
  const [priceValue, setPriceValue] = React.useState(5);
  const [ivValue, setIVValue] = React.useState(0);
  return (
    <Box>
      <Story title="Price Slider">
        <PriceSlider
          mode={1}
          step={0.01}
          domain={[4, 6]}
          values={[priceValue]}
          onChange={(v: number) => setPriceValue(v)}
        />
      </Story>

      <Story title="IV Slider">
        <IVSlider
          mode={1}
          step={1}
          domain={[-100, 100]}
          values={[ivValue]}
          onChange={(v: number) => setIVValue(v)}
          onUpdate={noop}
        />
      </Story>
    </Box>
  );
};

export default SliderStory;
