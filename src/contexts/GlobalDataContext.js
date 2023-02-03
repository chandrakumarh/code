import { createContext, useEffect, useReducer } from 'react';

const initialState = {
    companyList: []
};

const handlers = {
    COMPANY_LIST: (state, action) => {
      const { data } = action.payload;
      return {
        ...state,
        companyList: data
      };
    }
};

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

const GlobalDataContext = createContext(initialState);
  
GlobalDataContext.propTypes = {
    children: PropTypes.node
};

function GlobalDataProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState)
}