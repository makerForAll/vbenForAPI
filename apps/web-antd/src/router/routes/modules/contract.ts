import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'streamline-ultimate-color:common-file-text',
      order: 103,
      title: "合同",
    },
    name: 'contract',
    path: '/contract',
    children: [
      {
        name: 'contract-dashboard',
        path: '/contract-dashboard',
        component: () => import('#/views/contract/contract-dashboard/index.vue'),
        meta: {
          // affixTab: true,
          icon: 'streamline-ultimate-color:car-dashboard-speed',
          // title: $t('page.dashboard.analytics'),
          title: "合同仪表盘",
        },
      },
      {
        name: 'contract-management',
        path: '/contract-management',
        component: () => import('#/views/contract/contract-management/index.vue'),
        meta: {
          icon: 'icon-park:data',
          title: "合同管理",
        },
      },{
        name: 'contract-logs',
        path: '/contract-logs',
        component: () => import('#/views/contract/contract-logs/index.vue'),
        meta: {
          icon: 'icon-park:data',
          title: "合同日志",
        },
      },
    ],
  },
];

export default routes;
