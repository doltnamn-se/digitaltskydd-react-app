import { Translations } from './types';
import { authSv } from './categories/auth';
import { navigationSv } from './categories/navigation';
import { errorsSv } from './categories/errors';
import { guidesSv } from './categories/guides';
import { settingsSv } from './categories/settings';

export const sv: Translations = {
  ...authSv,
  ...navigationSv,
  ...errorsSv,
  ...guidesSv,
  ...settingsSv,
} as const;