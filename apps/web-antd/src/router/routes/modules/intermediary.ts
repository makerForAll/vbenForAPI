import type { RouteRecordRaw } from 'vue-router';

// import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:layout-dashboard',
      order: 100,
      title: "中介中心",
    },
    name: 'Intermediary',
    path: '/intermediary',
    children: [
      {
        name: 'intermediary-dashboard',
        path: '/intermediary-dashboard',
        component: () => import('#/views/intermediary/intermediary-dashboard/index.vue'),
        meta: {
          // affixTab: true,
          icon: 'streamline-ultimate-color:car-dashboard-speed',
          // title: $t('page.dashboard.analytics'),
          title: "中介仪表盘",
        },
      },
      {
        name: 'intermediary-management',
        path: '/intermediary-management',
        component: () => import('#/views/intermediary/intermediary-management/index.vue'),
        meta: {
          icon: 'icon-park:view-grid-detail',
          title: "中介管理",
        },
      },
    ],
  },
];

export default routes;
