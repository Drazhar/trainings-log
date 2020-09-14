const { getMovingAverage } = require('./movingAverage');

test('01', () => {
  inputArray = [
    {
      date: new Date('2020-06-03T22:00:00.000Z'),
      weight: 68,
    },
    {
      date: new Date('2020-07-01T22:00:00.000Z'),
      weight: 68,
    },
    {
      date: new Date('2020-07-15T22:00:00.000Z'),
      weight: 68,
    },
    {
      date: new Date('2020-07-31T22:00:00.000Z'),
      weight: 68,
    },
    {
      date: new Date('2020-08-18T22:00:00.000Z'),
      weight: 69,
    },
    {
      date: new Date('2020-09-03T22:00:00.000Z'),
      weight: 72,
    },
    {
      date: new Date('2020-09-04T22:00:00.000Z'),
      weight: 73,
    },
    {
      date: new Date('2020-09-06T22:00:00.000Z'),
      weight: 75,
    },
    {
      date: new Date('2020-09-08T22:00:00.000Z'),
      weight: 80,
    },
    {
      date: new Date('2020-09-09T22:00:00.000Z'),
      weight: 70,
    },
    {
      date: new Date('2020-09-10T22:00:00.000Z'),
      weight: 71,
    },
    {
      date: new Date('2020-09-11T22:00:00.000Z'),
      weight: 76,
    },
    {
      date: new Date('2020-09-12T22:00:00.000Z'),
      weight: 50,
    },
    {
      date: new Date('2020-09-13T22:00:00.000Z'),
      weight: 73,
    },
  ];

  expect(getMovingAverage(inputArray, 7)[13].weight).toBe(67.5);
});
