export default defineEventHandler(async (event) => {
  const query = getQuery(event) as Record<string, any>;
  const redirect = (query.redirect as string) || '';
  const state = (query.state as string) || '';

  if (!redirect) {
    setResponseStatus(event, 400);
    return useResponseError('BadRequestException', 'Missing redirect');
  }

  // 模拟授权，直接回跳并附带一个 mock code
  const mockCode = `mock-${Date.now()}`;
  const url = new URL(redirect);
  url.searchParams.set('code', mockCode);
  if (state) url.searchParams.set('state', state);
  return sendRedirect(event, url.toString());
});


