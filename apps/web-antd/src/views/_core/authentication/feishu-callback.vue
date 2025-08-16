<script lang="ts" setup>
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { useAuthStore } from '#/store';
import { feishuOAuthCallback } from '#/api/core/auth';
import { useAccessStore, useUserStore } from '@vben/stores';
import { preferences } from '@vben/preferences';

const authStore = useAuthStore();
const router = useRouter();

onMounted(async () => {
  const route = useRoute();
  const code = (route.query.code as string) || '';
  const state = (route.query.state as string) || '';
  if (!code) return;

  const { accessToken } = await feishuOAuthCallback({ code, state });
  if (accessToken) {
    const accessStore = useAccessStore();
    accessStore.setAccessToken(accessToken);
    await authStore.fetchUserInfo();
    const userStore = useUserStore();
    await router.replace(
      userStore.userInfo?.homePath || preferences.app.defaultHomePath,
    );
  }
});
</script>

<template>
  <div class="p-4">正在登录中...</div>
</template>


