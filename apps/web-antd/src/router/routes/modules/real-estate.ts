import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'streamline-ultimate-color:building-2',
      order: 101,
      title: "不动产",
    },
    name: 'real-estate',
    path: '/real-estate',
    children: [
      {
        name: 'unit-list',
        path: '/unit-list',
        component: () => import('#/views/real-estate/unit-list/index.vue'),
        meta: {
          // affixTab: true,
          icon: 'icon-park:data',
          // title: $t('page.dashboard.analytics'),
          title: "单元列表",
        },
      },
      {
        name: 'area-list',
        path: '/area-list',
        component: () => import('#/views/real-estate/area-list/index.vue'),
        meta: {
          icon: 'icon-park:data',
          title: "区域列表",
        },
      },
    ],
  },
];

export default routes;
