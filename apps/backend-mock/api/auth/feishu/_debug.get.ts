export default defineEventHandler(async () => {
  const appId = String(process.env.FEISHU_APP_ID || '').trim();
  const appSecret = String(process.env.FEISHU_APP_SECRET || '').trim();

  let appTokenResp: any = null;
  try {
    appTokenResp = await $fetch(
      'https://open.feishu.cn/open-apis/auth/v3/app_access_token/internal',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          app_id: appId,
          app_secret: appSecret,
        },
      },
    );
  } catch (err: any) {
    appTokenResp = {
      code: -1,
      msg: err?.message || 'request error',
      raw: err?.data || err?.response?._data,
      status: err?.response?.status,
    };
  }

  return useResponseSuccess({
    idLen: appId.length,
    secLen: appSecret.length,
    appTokenResp,
  });
});


