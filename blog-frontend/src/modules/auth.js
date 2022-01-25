import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';
import createRequestSaga, { createRequestActionTypes } from '../lib/createRequestSaga';
import * as authAPI from '../lib/api/auth';
import {takeLatest} from 'redux-saga/effects';

// const SAMPLE_ACTION = 'auth/SAMPLE_ACTION';
const CHANGE_FIELD = 'auth/CHANGE_FIELD'
const INITIALIZE_FORM = 'auth/INITIALIZE_FORM'

const [REGISTER, REGISTER_SUCCESS, REGISTER_FAILURE] = createRequestActionTypes('auth/REGISTER');
const [LOGIN, LOGIN_SUCCESS, LOGIN_FAILURE] = createRequestActionTypes('auth/LOGIN');

// export const sampleAction = createAction(SAMPLE_ACTION);
export const changeField = createAction(
  CHANGE_FIELD,
  ({form, key, value}) => ({
    form, // register, login
    key, // username, password, passwordConfirm
    value // 실제 바꾸려는 값
  }),
);
export const initializeFrom = createAction(INITIALIZE_FORM, form => form ); // register / login
export const register = createAction(REGISTER, ({username, password}) => ({
  username, password,
}));
export const login = createAction(LOGIN, ({username, password}) => ({
  username, password,
}));

// 사가 생성
const registerSaga = createRequestSaga(REGISTER, authAPI.register);
const loginSaga = createRequestSaga(LOGIN, authAPI.login);
export function* authSaga() {
  yield takeLatest(REGISTER, registerSaga);
  yield takeLatest(LOGIN, loginSaga);
}

const initialState = {
  register: {
    username: '',
    password: '',
    passwordConfirm: '',
  },
  login: {
    username: '',
    password: '',
  },
};

const auth = handleActions(
  {
    [CHANGE_FIELD]: (state, {payload: {form, key, value}}) => 
      produce(state, draft => {
        // console.log(state, "handle action state");
        // console.log(draft, "handle action draft");
        // console.log(value, "handle action value");
        draft[form][key] = value; // state.register.username 바꿈
        // console.log(draft[form], "handle action draft");
      }),
    [INITIALIZE_FORM]: (state, {payload: form}) => ({
      ...state,
      [form]: initialState[form],
      authError: null, // 폼 전환 시 회원 인증 에서 초기화
    }),
    // 회원가입 성공
    [REGISTER_SUCCESS]: (state, {payload: auth}) => ({
      ...state,
      authError: null,
      auth
    }),
    // 회원가입 실패
    [REGISTER_FAILURE]: (state, {payload: error}) => ({
      ...state,
      authError: error,
    }),
    // 로그인 성공
    [LOGIN_SUCCESS]: (state, {payload: auth}) => ({
      ...state,
      authError: null,
      auth,
    }),
    // 로그인 실패
    [LOGIN_FAILURE]: (state, {payload: error}) => ({
      ...state,
      authError: error,
    }),
  },
  initialState,
);

export default auth;
