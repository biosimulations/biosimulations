import { apiClient } from './api-client';

describe('apiClient', () => {
  it('should work', () => {
    expect(apiClient()).toEqual('api-client');
  });
});
