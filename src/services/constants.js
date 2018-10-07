export const activities = [
  {
    id: 'registration',
    name: 'Registration',
    limit: 1,
    tokens: 1,
    data: web3.toHex('registration')
  },
  {
    id: 'question',
    name: 'Question',
    limit: 3,
    tokens: 1,
    data: web3.toHex('question')
  },
  {
    id: 'speaker',
    name: 'Speaker',
    limit: 4,
    tokens: 2,
    data: web3.toHex('speaker')
  }
];

export const activitiesMap = activities.reduce((res, cur) => ({...res, [cur.id]: cur}), {});