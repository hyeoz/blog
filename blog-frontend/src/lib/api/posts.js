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

// 포스트 수정 API 사용하는 기능
export const updatePost = ({id, title, body, tags}) => client.patch(`/api/posts/${id}`, {
  title, body, tags,
});

// 포스트 삭제 기능
export const removePost = (id) => client.delete(`/api/posts/${id}`);