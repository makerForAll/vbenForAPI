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

  // 模拟用 code 换用户，这里固定为 jack
  const findUser = MOCK_USERS.find((u) => u.username === 'jack');
  if (!findUser) {
    setResponseStatus(event, 500);
    return useResponseError('InternalServerError', 'Mock user not found');
  }

  const accessToken = generateAccessToken(findUser);
  const refreshToken = generateRefreshToken(findUser);
  setRefreshTokenCookie(event, refreshToken);

  return useResponseSuccess({ accessToken });
});


