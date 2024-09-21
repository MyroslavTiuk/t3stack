import { Errable } from 'errable';
import { ErrorData } from './api/ErrorData';

export type Outcome<A> = Errable<ErrorData, A>;
