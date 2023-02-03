import { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
// utils
import axios from '../axios';
// import axios from '../utils/axios';
import { isValidToken, setSession } from '../utils/jwt';
import ApiConstants from 'src/_apis_/ApiConstants';
import useAuth from 'src/hooks/useAuth';

// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
  access_token: null
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user, access_token } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
      access_token
    };
  },
  LOGIN: (state, action) => {
    const { user, access_token } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
      access_token
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
    access_token: null
  }),
  REGISTER: (state, action) => {
    const { user, access_token } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
      access_token
    };
  }
};

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

const AuthContext = createContext({
  ...initialState,
  method: 'jwt',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve()
});

AuthProvider.propTypes = {
  children: PropTypes.node
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem('accessToken');

        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);
          const response = await axios.get(ApiConstants.MY_ACCOUNT, { headers: { Authorization: accessToken } });
          const { user } = response.data;

          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user,
              access_token: accessToken
            }
          });
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null,
              access_token: null
            }
          });
        }
      } catch (err) {
        console.log(err.message);
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null,
            access_token: null
          }
        });
      }
    };

    initialize();
  }, []);

  const login = async (email, password) => {
    // console.log('login func called');
    const response = await axios.post(ApiConstants.LOGIN, {
      email,
      password
    });
    const { accessToken, user } = response.data;
    console.log(response);

    // const { accessToken, user } = response.data;

    setSession(accessToken);
    dispatch({
      type: 'LOGIN',
      payload: {
        user,
        access_token: accessToken
      }
    });
  };

  const register = async (email, password, firstName, lastName) => {
    const response = await axios.post('/api/account/register', {
      email,
      password,
      firstName,
      lastName
    });
    const { accessToken, user } = response.data;

    window.localStorage.setItem('accessToken', accessToken);
    dispatch({
      type: 'REGISTER',
      payload: {
        user,
        access_token: accessToken
      }
    });
  };

  const logout = async () => {
    setSession(null);
    dispatch({ type: 'LOGOUT' });
  };

  const changePassword = async(payload) => { 
    try {
      const accessToken = window.localStorage.getItem('accessToken');
      const response = await axios.put(ApiConstants.UPDATE_PASSWORD, payload, { headers: { Authorization: accessToken } })
      return response
    } catch (error) {
      return error
    }
  };

  const updateProfile = async (userId, profile) => {
    try {
      const dict = profile
      const bodyFormData = new FormData();
      delete dict["email"]
      const keys = Object.keys(dict);
      for (let i = 0; i < keys.length; i += 1) {
        const key = keys[i]
        if (key === "photoURL") {
          bodyFormData.append("profileImage", dict[key]?.file);
        }
        else {
          bodyFormData.append(key, dict[key]);
        }
      }
      console.log(bodyFormData)
      const accessToken = window.localStorage.getItem('accessToken');
      const response = await axios.post(ApiConstants.UPDATE_ACCOUNT(userId), bodyFormData, { headers: { Authorization: accessToken, "Content-Type": "multipart/form-data" } });
      const userResponse = await axios.get(ApiConstants.MY_ACCOUNT, { headers: { Authorization: accessToken } });
      const { user } = userResponse.data;
      dispatch({
        type: 'INITIALIZE',
        payload: {
          isAuthenticated: true,
          user,
          access_token: accessToken
        }
      });
      console.log('Response', response.data);
      return response
    } catch (error) {
      return error
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
        register,
        changePassword,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
