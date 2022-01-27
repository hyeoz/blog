import client from "./client";
import qs from 'qs';

export const writePost = ({title, body, tags}) => client.post('/api/posts', {title, body, tags});

export const readPost = (id) => client.get(`/api/posts/${id}`);

// 파라미터에 값 넣어주면 쿼리로 주소 생성해주는 함수
export const listPosts = ({page, username, tag}) => {
  const queryString = qs.stringify({
    page,
    username, 
    tag,
  });
  return client.get(`/api/posts?${queryString}`);
};