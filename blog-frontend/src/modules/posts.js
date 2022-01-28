import { createAction, handleActions } from "redux-actions";
import createRequestSaga, {createRequestActionTypes} from "../lib/createRequestSaga";
import * as postsAPI from '../lib/api/posts';
import {takeLatest} from 'redux-saga/effects';

const [LIST_POSTS, LIST_POSTS_SUCCESS, LIST_POSTS_FAILURE] = createRequestActionTypes('posts/LIST_POST');

export const listPosts = createAction(
  LIST_POSTS,
  ({tag, username, page}) => ({tag, username, page}),
);
const listPostsSaga = createRequestSaga(LIST_POSTS, postsAPI.listPosts);
export function* postsSaga() {
  yield takeLatest(LIST_POSTS, listPostsSaga)
}

const initialState = {
  posts: null,
  error: null,
  lastPage: 1,
};

const posts = handleActions(
  {
    [LIST_POSTS_SUCCESS]: (state, {payload: posts, meta: res}) => ({
      ...state,
      posts,
      lastPage: parseInt(res.headers['last-page'], 10) // 문자형인 페이지 숫자로 바꿔 페이지네이션
    }),
    [LIST_POSTS_FAILURE]: (state, {payload: error}) => ({
      ...state,
      error,
    }),
  },
  initialState,
);

export default posts;

