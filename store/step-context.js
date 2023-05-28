import { createContext, useReducer } from 'react';

export const CountStepContext = createContext({
  stepData: 0,
  retrieveStepData: ({ stepData }) => {},
});

function stepCountReducer(state, action) {
  switch (action.type) {
    case 'SET_STEP_COUNT':
      return action.payload;
    default:
      return state;
  }
}

function ExpensesContextProvider({ children }) {
  const [stepCount, dispatch] = useReducer(stepCountReducer, 0);

  function retrieveStepData(stepData) {
    dispatch({ type: 'SET_STEP_COUNT', payload: stepData });
  }

  const value = {
    expenses: stepData,
    retrieveStepData: retrieveStepData,
  };

  return (
    <CountStepContext.Provider value={value}>
      {children}
    </CountStepContext.Provider>
  );
}

export default ExpensesContextProvider;
