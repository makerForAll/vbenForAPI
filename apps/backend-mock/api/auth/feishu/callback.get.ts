import { setRefreshTokenCookie } from '~/utils/cookie-utils';
import { generateAccessToken, generateRefreshToken } from '~/utils/jwt-utils';
import { MOCK_USERS } from '~/utils/mock-data';

export default defineEventHandler(async (event) => {
  const query = getQuery(event) as Record<string, any>;
  const code = (query.code as string) || '';
  if (!code) {
    setResponseStatus(event, 400);
    return useResponseError('BadRequestException', 'Missing code');
  }

  const appId = process.env.FEISHU_APP_ID;
  const appSecret = process.env.FEISHU_APP_SECRET;

  console.log('callback-appId', appId);
  console.log('callback-appSecret', appSecret);

  // 如果没有真实凭证，使用模拟用户
  if (!appId || !appSecret) {
    const findUser = MOCK_USERS.find((u) => u.username === 'jack');
    if (!findUser) {
      setResponseStatus(event, 500);
      return useResponseError('InternalServerError', 'Mock user not found');
    }
    const accessToken = generateAccessToken(findUser);
    const refreshToken = generateRefreshToken(findUser);
    setRefreshTokenCookie(event, refreshToken);
    return useResponseSuccess({ accessToken });
  }

  // 真实流程：用 code 换 user_access_token（使用 App Access Token 作为 Bearer 鉴权）
  const id = String(appId || '').trim();
  const sec = String(appSecret || '').trim();
  if (!id || !sec) {
    setResponseStatus(event, 401);
    return useResponseError(
      'Unauthorized',
      `feishu env invalid: idLen=${id.length}, secLen=${sec.length}`,
    );
  }

  // 1) 获取 app_access_token
  let appTokenResp: any;
  try {
    appTokenResp = await $fetch(
      'https://open.feishu.cn/open-apis/auth/v3/app_access_token/internal',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { app_id: id, app_secret: sec },
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
  if (!appTokenResp || (appTokenResp as any).code !== 0) {
    setResponseStatus(event, 401);
    return useResponseError(
      'Unauthorized',
      `feishu app_access_token failed: ${JSON.stringify(appTokenResp)}`,
    );
  }
  const appAccessToken = (appTokenResp as any).app_access_token || (appTokenResp as any).tenant_access_token;

  // 2) 用 app_access_token 作为 Bearer 鉴权，换 user_access_token
  let tokenResp: any;
  try {
    tokenResp = await $fetch(
      'https://open.feishu.cn/open-apis/authen/v1/access_token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: `Bearer ${appAccessToken}`,
        },
        body: { grant_type: 'authorization_code', code },
      },
    );
  } catch (err: any) {
    tokenResp = {
      code: -1,
      msg: err?.message || 'request error',
      raw: err?.data || err?.response?._data,
      status: err?.response?.status,
    };
  }
  if (!tokenResp || (tokenResp as any).code !== 0) {
    setResponseStatus(event, 401);
    return useResponseError(
      'Unauthorized',
      `feishu access_token failed: ${JSON.stringify(tokenResp)}`,
    );
  }

  const userAccessToken = (tokenResp as any).data?.access_token || (tokenResp as any).data?.user_access_token;

  // 2) 获取用户信息
  let userResp: any;
  try {
    userResp = await $fetch(
    'https://open.feishu.cn/open-apis/authen/v1/user_info',
    {
      headers: {
        Authorization: `Bearer ${userAccessToken}`,
      },
    },
  );
  } catch (err: any) {
    userResp = {
      code: -1,
      msg: err?.message || 'request error',
      raw: err?.data || err?.response?._data,
      status: err?.response?.status,
    };
  }

  if (!userResp || (userResp as any).code !== 0) {
    setResponseStatus(event, 401);
    return useResponseError(
      'Unauthorized',
      `feishu user_info failed: ${JSON.stringify(userResp)}`,
    );
  }

  const userInfo = (userResp as any).data;
  // 映射系统用户与角色：这里先全部映射为 user，可按需接入通讯录映射
  const systemUser = {
    id: userInfo.user_id || userInfo.open_id || 0,
    realName: userInfo.name || 'FeishuUser',
    roles: ['user'],
    username: userInfo.user_id || userInfo.open_id || 'feishu',
    homePath: '/analytics',
  } as any;

  const accessToken = generateAccessToken(systemUser);
  const refreshToken = generateRefreshToken(systemUser);
  setRefreshTokenCookie(event, refreshToken);
  return useResponseSuccess({ accessToken });
});


