const Reducer = (state, action) => {
  switch (action.type) {
    case "SET_AUTH":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      };
    case "CLEAR_AUTH":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    case "SET_USER":
      return {
        ...state,
        user: action.payload,
      };
    case "SET_SITES":
      return {
        ...state,
        sites: action.payload,
      };
    case "SET_TEAMS":
      return {
        ...state,
        teams: action.payload,
      };
    case "SET_DAILY_RECORDS":
      return {
        ...state,
        dailyRecords: {
          ...state.dailyRecords,
          log: action.payload,
        },
      };
    case "SET_ALL_ATTENDANCE":
      return {
        ...state,
        allAttendance: action.payload,
      };
    case "SET_USERS": {
      const users = action.payload || [];
      const maliks = users.filter(u => (u.role || '').toLowerCase() === 'malik');
      const mistris = users.filter(u => (u.role || '').toLowerCase() === 'mistri');
      const labours = users.filter(u => (u.role || '').toLowerCase() === 'labour');

      return {
        ...state,
        users: users,
        sites: maliks,
        teams: [...mistris, ...labours]
      };
    }
    default:
      return state;
  }
};

export default Reducer;
