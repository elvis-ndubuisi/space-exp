# Space Explorer

import { createMocks } from 'node-mocks-http';
import handler from '../../pages/api/launches';

jest.mock('@apollo/client', () => ({
ApolloClient: jest.fn(() => ({
query: jest.fn(() => ({
data: {
launches: [
{
id: '1',
mission_name: 'Test Mission',
launch_date_local: '2023-05-01T12:00:00Z',
rocket: { rocket_name: 'Falcon 9' },
launch_site: null,
},
],
},
})),
})),
InMemoryCache: jest.fn(),
}));

describe('/api/launches', () => {
it('returns transformed launches data', async () => {
const { req, res } = createMocks({
method: 'GET',
});

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      launches: [
        {
          id: '1',
          mission_name: 'Test Mission',
          launch_date_local: '2023-05-01T12:00:00Z',
          rocket: { rocket_name: 'Falcon 9' },
          launch_site: { site_name_long: 'To Be Announced' },
        },
      ],
    });

});
});
