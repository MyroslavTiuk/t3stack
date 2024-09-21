// import Box from '../primitives/Box';

// function stateSelected(state: any) {
//   return {
//     ...state,
//     expiry: "2020-06-18",
//     strike: 140.5,
//     opType: "call",
//   };
// }

// function settingsRestricted(set: any) {
//   return {
//     ...set,
//     changeAct: false,
//     changeOpType: false,
//   };
// }

const OptionLegStory = () => {
  /*
  const { update, state } = useReducerLocalSetter({
    act: '',
    price: '',
    name: '',
    opType: '',
    expiry: '',
    strike: '',
    iv: null,
    num: '',
    showDetails: false,
    showGreeks: false,
    showExitPrice: false,
    underlying: '',
    inputStyle: null,
    linkNum: true,
    linkExpiries: true,
    linkOpTypes: false,
    linkStrikes: false,
  });

  const settings = {
    renamable: false,
    changeAct: true,
    changeOpType: true,
    showUnderlying: false,
    // todo: tidy suggestions
    suggestedNum: [1],
  };

  const baseProps = {
    ofLegs: 2,
    inputMethod: 'stacked' as 'stacked',
    actOnChange: console.log,
    actOnSelect: console.log,
    expiryChoices: [],
    expiryOnChange: console.log,
    expiryOnSelect: console.log,
    linkNumOnChange: console.log,
    linkNumOnSelect: console.log,
    linkOpTypesOnChange: console.log,
    linkOpTypesOnSelect: console.log,
    linkStrikesOnChange: console.log,
    linkStrikesOnSelect: console.log,
    linkExpiriesOnChange: console.log,
    linkExpiriesOnSelect: console.log,
    numOnChange: console.log,
    numOnSelect: console.log,
    opTypeOnChange: console.log,
    opTypeOnSelect: console.log,
    optionCode: '1 Apr 2020',
    priceChoices: [],
    priceOnChange: console.log,
    priceOnSelect: console.log,
    strikeChoices: [],
    strikeOnChange: console.log,
    strikeOnSelect: console.log,
    toggleOptionChain: console.log,
    disableChainBtn: false,
    curCalc: {} as Strategy,
    optPrice: null,
  };

  const cardClass = '_dsk-plus-4 _tab-6 _mob-12';

  return (
    <div className="theme--light grid">
      <div className={cardClass}>
        <StoryView title="Basic" desc={'Should show "Select from chain"'}>
          <OptionLeg
            legId={'basic'}
            leg={state}
            legSettings={settings}
            name={'Option leg name'}
            {...baseProps}
          />
        </StoryView>
      </div>

      <div className={cardClass}>
        <StoryView title="Selected" desc={'Should show option details'}>
          <OptionLeg
            legId={'basic'}
            leg={stateSelected(state)}
            legSettings={settings}
            name={'Option leg name'}
            {...baseProps}
          />
        </StoryView>
      </div>

      <div className={cardClass}>
        <StoryView
          title="Restricted"
          desc={'Should not show act or option type'}
        >
          <OptionLeg
            legId={'basic'}
            leg={state}
            legSettings={settingsRestricted(settings)}
            name={'Option leg name'}
            {...baseProps}
          />
        </StoryView>
      </div>

      <div className={cardClass}>
        <StoryView
          title="Restricted - selected"
          desc={'Should not show act or option type'}
        >
          <OptionLeg
            legId={'basic'}
            leg={stateSelected(state)}
            legSettings={settingsRestricted(settings)}
            name={'Option leg name'}
            {...baseProps}
          />
        </StoryView>
      </div>
    </div>
  );
  */
};

export default OptionLegStory;
