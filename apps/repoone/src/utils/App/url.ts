import { SITE } from '../../config/Site';

export const getFullUrl = (path: string) => `${SITE.ORIGIN}/${path}`;
