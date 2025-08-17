export default defineEventHandler(async (event) => {
  const query = getQuery(event) as Record<string, any>;
  const redirect = (query.redirect as string) || '';
  const state = (query.state as string) || '';

  if (!redirect) {
    setResponseStatus(event, 400);
    return useResponseError('BadRequestException', 'Missing redirect');
  }

  const appId = process.env.FEISHU_APP_ID;
  const appSecret = process.env.FEISHU_APP_SECRET;
  console.log('login-appId', appId);
  console.log('login-appSecret', appSecret);

  // 若已配置真实凭证，则跳转飞书授权页；否则回退为模拟回跳
  if (appId && appSecret) {
    const authorizeUrl = new URL(
      'https://open.feishu.cn/open-apis/authen/v1/index',
    );
    authorizeUrl.searchParams.set('app_id', appId);
    authorizeUrl.searchParams.set('redirect_uri', redirect);
    if (state) authorizeUrl.searchParams.set('state', state);
    return sendRedirect(event, authorizeUrl.toString());
  }

  // 模拟授权，直接回跳并附带一个 mock code
  const mockCode = `mock-${Date.now()}`;
  const url = new URL(redirect);
  url.searchParams.set('code', mockCode);
  if (state) url.searchParams.set('state', state);
  return sendRedirect(event, url.toString());
});


