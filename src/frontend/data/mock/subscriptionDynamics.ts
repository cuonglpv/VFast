export const months = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];
export const seatStatuses = [
  { name: 'Active', color: '#8bbce9', values: [15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15] },
  { name: 'Inactive', color: '#2e7ac7', values: [65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65, 65] },
  { name: 'No activity', color: '#d8b7ef', values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 0] },
  { name: 'Not monitored', color: '#9179bb', values: [40, 15, 15, 40, 22, 24, 26, 24, 40, 40, 0, 40] },
];
export const unassigned = { name: 'Unassigned', color: '#f6e6a0', values: [90, 60, 0, 90, 72, 60, 90, 80, 54, 90, 80, 90] };

export const subscriptionDynamics = { months, seatStatuses, unassigned };
