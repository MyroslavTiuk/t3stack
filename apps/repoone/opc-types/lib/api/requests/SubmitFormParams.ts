import { ObjRecord } from '../../util/ObjRecord';

export type SubmitFormParams = {
  body: {
    formType?: string;
    name?: string;
    email?: string;
    message?: string;
  } & ObjRecord<string>;
};
