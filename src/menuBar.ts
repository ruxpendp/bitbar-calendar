import bitbar from 'bitbar';

import { getEvents, Event } from './calendarApis';
import { renderViewsMenu, renderCalendarConfigMenu, MenuItem } from './menus';
import { getActiveView, CustomConfig, CalculatedActiveView, Calendar } from './activeView';
import { renderEventBuckets } from './eventBuckets';
const config = require('../config.json');
const iconActive = require('../iconActive.json');
const iconInactive = require('../iconInactive.json');

const { calendars = [] }: CustomConfig = config;

const renderIcon = (icon: string): MenuItem[] => [
  { text: '', templateImage: icon },
  bitbar.separator
];

export const renderMenuBar = async (): Promise<MenuItem[]> => {
  try {
    const { buckets, multiBucketEvents, timeMin, timeMax }: CalculatedActiveView = getActiveView();

    const events: Event[] = await getEvents({
      calendarIds: calendars.reduce(
        (ids: string[], { active, id }: Calendar) => active ? [...ids, id] : ids,
        []
      ),
      timeMin,
      timeMax
    });

    return [
      ...renderIcon(iconActive),
      ...renderEventBuckets({ buckets, events, multiBucketEvents }),
      renderViewsMenu(),
      renderCalendarConfigMenu()
    ];
  } catch (error) {
    return [
      ...renderIcon(iconInactive),
      { text: 'Could Not Fetch Agenda' },
      bitbar.separator,
      { text: 'Debug', submenu: [{ text: error.stack }] }
    ];
  }
};
