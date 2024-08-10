import { axiosBackendUrl } from './getAxios';

export default async function getAccessToken(token: any) {
  try {
    const { data } = await axiosBackendUrl.get('/api/web/refresh-token', {
      headers: {
        Authorization: `Bearer ${token.refreshToken}`,
      },
    });

    if (data?.status) {
      return {
        ...token,
        accessToken: data?.data?.accessToken,
        refreshToken: data?.data?.refreshToken,
        expiresIn: data?.data?.expiresIn,
      };
    }
  } catch (error) {
    console.error('Something went wrong on refreshToken!');
  }
}
