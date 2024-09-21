const optionLegDesc =
  "an option by clicking the 'Select from chain' button, or by using the 'expiry' and 'strike' dropdown menus";

export default {
  STOCK_LEG:
    'Search for optionable stocks and indexes by stock symbol or company name',
  SPREAD_DETAILS_LEG:
    'Enter the details for your spread.  These will be used for all options legs in this strategy.',
  OPTION_LEG_MULTI: `For each leg in the options strategy, select ${optionLegDesc}`,
  OPTION_LEG_SINGLE: `Select ${optionLegDesc}`,
  SPREAD_DETAILS_LINK_BTN_UNLINK:
    'Unlock all fields in the options panel (below), to edit details independent of other legs. This allows you to customize the strategy outside of what is traditional for the current strategy.',
  SPREAD_DETAILS_LINK_BTN_LINK:
    'Re-link fields in the options panel (below), based on the traditional implementation of the current strategy.',
  TOTALS_LEG:
    'Adjust the overall entry price for the spread, and view net greeks of all legs combined.',
  ESTIMATES_HEADING: 'Statistics for the estimates of your trade.',
};
