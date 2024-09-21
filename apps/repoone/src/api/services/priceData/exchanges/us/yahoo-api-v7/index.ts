import * as E from 'errable';

import getMonthOptionsAndExpiries from './getMonthOptionsAndExpiries';
import { orchestrateMonthRequests } from './orchestrateMonthRequests';
import { transformCombinedResult } from './transformCombinedResult';

import { errorFactory } from '../../../../../infrastructure/errorHanding';

const getPriceData = (symb: string, _month: any) => {
  return Promise.resolve(symb)
    .then(getMonthOptionsAndExpiries)
    .then((x) => {
      return x;
    })
    .then(
      E.withErr((s) => {
        return [s];
      }),
    )
    .then(
      E.ifNotErrAsync((curResult) => {
        return orchestrateMonthRequests(symb, curResult);
      }),
    )
    .then(
      E.ifValElse(transformCombinedResult, (errors) =>
        errorFactory(
          errors.map((e) => (typeof e === 'string' ? e : '')).join(),
        ),
      ),
    );
};

export default getPriceData;
