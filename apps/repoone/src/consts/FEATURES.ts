import { type ObjRecord } from "opc-types/lib/util/ObjRecord";

// by using featureNotDisabled(), you can remove records from here
// to safely enable the feature permanently
const FEATURES: ObjRecord<boolean> = {};

export default FEATURES;
