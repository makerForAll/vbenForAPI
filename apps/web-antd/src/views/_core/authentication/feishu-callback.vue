<script lang="ts" setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { feishuOAuthCallback } from '#/api/core/auth';
import { useAccessStore, useUserStore } from '@vben/stores';
import { useAuthStore } from '#/store';
import { preferences } from '@vben/preferences';

const router = useRouter();

onMounted(async () => {
  const route = useRoute();
  const code = (route.query.code as string) || '';
  const state = (route.query.state as string) || '';
  if (!code) return;

  const resp = await feishuOAuthCallback({ code, state });
  console.log('resp', resp)
  // 兼容多种响应形态：raw axios、已拦截解包、再次嵌套 data
  const accessToken =
    (resp as any)?.accessToken ??
    (resp as any)?.data?.accessToken ??
    (resp as any)?.data?.data?.accessToken ??
    (typeof (resp as any)?.data === 'string' ? (resp as any).data : undefined);
  if (accessToken) {
    const accessStore = useAccessStore();
    accessStore.setAccessToken(accessToken);
    // 主动拉取用户信息，确保 /api/user/info 发生，并拿到 homePath
    const authStore = useAuthStore();
    const userInfo = await authStore.fetchUserInfo();
    const home = userInfo?.homePath || preferences.app.defaultHomePath || '/';
    await router.replace(home);
  }
});
</script>

<template>
  <div class="p-4">正在登录中...</div>
</template>


