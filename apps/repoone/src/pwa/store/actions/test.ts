import { type TestState } from "opc-types/lib/store/TestState";

import { makeTxfnActionCreator } from "../../../utils/Redux/ReduxTxfn/redux-txfn";
import { NS } from "../reducers/test";

const txfn = makeTxfnActionCreator<TestState>(NS);

export default { txfn };
