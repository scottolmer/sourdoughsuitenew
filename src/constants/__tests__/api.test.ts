describe('API configuration', () => {
  const originalEnv = process.env;

  afterEach(() => {
    process.env = originalEnv;
    jest.resetModules();
  });

  it('uses the production Photo Rescue API when no EAS public URL is configured', () => {
    process.env = {
      ...originalEnv,
      NODE_ENV: 'production',
      EXPO_PUBLIC_API_BASE_URL: '',
    };

    jest.isolateModules(() => {
      const { API_BASE_URL } = require('../api');

      expect(API_BASE_URL).toBe('https://api-production-0161c.up.railway.app/api');
    });
  });
});
