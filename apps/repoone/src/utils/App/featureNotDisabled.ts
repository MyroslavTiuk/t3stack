import FEATURES from '../../consts/FEATURES';

export default function featureNotDisabled(featName: string) {
  // if the feature has been removed from FEATURES, or it has been set to `true`
  //  it is notDisabled
  return FEATURES[featName] === undefined || FEATURES[featName] === true;
}
