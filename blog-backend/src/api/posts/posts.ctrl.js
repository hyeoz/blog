// let postId = 1; // 초기값

// // posts 배열 초기 데이터
// const posts = [
//   {
//     id: 1,
//     title: '제목',
//     body: '내용',
//   },
// ];

// /* 포스트 작성
// POST /api/posts
// {title, body} */
// export function write(ctx) {
//   //REST API 의 request body 조회
//   // console.log(ctx);
//   const { title, body } = ctx.request.body;
//   postId += 1; // id 증가
//   const post = { id: postId, title, body };
//   posts.push(post);
//   ctx.body = post;
// }

// /* 포스트 목록 조회
// GET /api/posts */
// export function list(ctx) {
//   ctx.body = posts;
// }

// /* 특정 포스트 조회
// GET /api/posts/:id */
// export function read(ctx) {
//   const { id } = ctx.params;
//   // 주어진 id 값으로 포스트 조회
//   // 받아온 값은 문자로 인식하기 때문에 숫자로 변환하거나 비교할 p.id 값을 문자로 변환해야 함
//   const post = posts.find((p) => p.id.toString() === id);
//   if (!post) {
//     ctx.status = 404;
//     ctx.body = {
//       message: '포스트가 존재하지 않습니다.',
//     };
//     return;
//   }
//   ctx.body = post;
// }

// /* 특정 포스트 제거
// DELETE /api/posts/:id */
// export function remove(ctx) {
//   const { id } = ctx.params;
//   // 해당 id를 가진 post 가 몇번째인지 확인
//   const index = posts.findIndex((p) => p.id.toString() === id);
//   // 포스트가 없으면 오류를 반환
//   if (index === -1) {
//     ctx.status = 404;
//     ctx.body = {
//       message: '포스트가 존재하지 않습니다.',
//     };
//     return;
//   }
//   // index 번째 아이템 제거
//   posts.splice(index, 1);
//   ctx.status = 204; // no content
// }

// /* 특정 포스트 수정(교체)
// PUT /api/posts/:id */
// export function replace(ctx) {
//   // PUT 메서드는 전체 포스트 정보를 입력하여 데이터를 통째로 교체할 때
//   const { id } = ctx.params;
//   // 해당 id를 가진 post 가 몇번째인지 확인
//   const index = posts.findIndex((p) => p.id.toString() === id);
//   // 포스트가 없으면 오류를 반환
//   if (index === -1) {
//     ctx.status = 404;
//     ctx.body = {
//       message: '포스트가 존재하지 않습니다.',
//     };
//     return;
//   }
//   // 전체 객체를 덮어씌웁니다
//   // 따라서 id를 제외한 기존 정보를 날리고 객체를 새로 만듬
//   posts[index] = {
//     id,
//     ...ctx.request.body,
//   };
//   ctx.body = posts[index];
// }

// /* 특정 포스트 수정(특정 필드 변경)
// PATCH /api/posts/:id
// {title, body} */
// export function update(ctx) {
//   // patch 메서드는 주어진 필드만 교페
//   const { id } = ctx.params;
//   // 해당 id를 가진 post 가 몇번째인지 확인
//   const index = posts.findIndex((p) => p.id.toString() === id);
//   // 포스트가 없으면 오류를 반환
//   if (index === -1) {
//     ctx.status = 404;
//     ctx.body = {
//       message: '포스트가 존재하지 않습니다.',
//     };
//     return;
//   }
//   // 기존값에 정보를 덮어씌움
//   posts[index] = {
//     ...posts[index],
//     ...ctx.request.body,
//   };
//   ctx.body = posts[index];
// }

// mogoDB 사용 후 다시 작성
import Post from '../../models/post';
import mongoose from 'mongoose';
import Joi from 'joi';

// object id 검증
const { ObjectId } = mongoose.Types;

// checkObjectId -> getPostById
export const getPostById = async (ctx, next) => {
  const { id } = ctx.params;
  if (!ObjectId.isValid(id)) {
    ctx.status = 400; // Bad request
    return;
  }
  try {
    const post = await Post.findById(id);
    // 포스트 존재하지 않을 때
    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.state.post = post;
    return next();
  } catch (e) {
    ctx.throw(500, e);
  }
};

// checkOwnPost
export const checkOwnPost = (ctx, next) => {
  const { user, post } = ctx.state;
  if (post.user._id.toString() !== user._id) {
    ctx.status = 403;
    return;
  }
  return next();
};

/* POST /api/posts
{
  title: 제목,
  body: 내용,
  tags: 태그
} */
export const write = async (ctx) => {
  const schema = Joi.object().keys({
    // 객체가 다음 필드를 가지고 있음을 검증
    title: Joi.string().required(),
    body: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).required(), // 문자열로 이루어진 배열
  });
  // 검증하고나서 실패인 경우 에러 처리
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  const { title, body, tags } = ctx.request.body;
  const post = new Post({
    title,
    body,
    tags,
    user: ctx.state.user,
  });
  try {
    await post.save();
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};
/* GET /api/posts */
export const list = async (ctx) => {
  // 쿼리는 문자열이기 때문에 숫자로 변환해주어야 함
  // 값이 주어지지 않았다면 1을 기본으로
  const page = parseInt(ctx.query.page || 1, 10);
  if (page < 1) {
    ctx.status = 400;
    return;
  }

  // 필터링
  const { tag, username } = ctx.query;
  // console.log(tag, username);
  // 값이 유효하면 객체에 넣고, 그렇지않으면 넣지 않음
  const query = {
    ...(username ? { 'user.username': username } : {}),
    ...(tag ? { tags: tag } : {}),
  };

  try {
    // exec 을 붙여줘야 서버에 쿼리를 요청함.
    // api/posts?page=2 로 지정하여 조회 가능
    const posts = await Post.find(query)
      // 순서를 역순으로 하여 최신글부터 불러오게.
      .sort({ _id: -1 })
      // 10개만 보이게.
      .limit(10)
      // 10개마다 페이지네이션
      .skip((page - 1) * 10)
      .exec();
    // 마지막 페이지 번호 알려주기
    const postCount = await Post.countDocuments(query).exec();
    // 헤더에 Last-Page 나타남
    ctx.set('Last-Page', Math.ceil(postCount / 10));
    // 본문 글자수 200자 제한
    ctx.body = posts
      .map((post) => post.toJSON())
      .map((post) => ({
        ...post,
        body:
          post.body.length < 200 ? post.body : `${post.body.slice(0, 200)}...`,
      }));
  } catch (e) {
    ctx.throw(500, e);
  }
};
/* GET /api/posts/:id */
// export const read = async (ctx) => {
//   const { id } = ctx.params;
//   try {
//     const post = await Post.findById(id).exec();
//     if (!post) {
//       // 해당 아이디가 없으면 404 에러
//       ctx.status = 404; // not found
//       return;
//     }
//     ctx.body = post;
//   } catch (e) {
//     // ObjectId 형태가 아니면 500 에러
//     ctx.throw(500, e); // Internal server error
//   }
// };
export const read = (ctx) => {
  ctx.body = ctx.state.post;
};
/* DELETE /api/posts/:id 
remove() : 다 지우기
findByIdAndRemove() : 아이디 찾아서 지우기
findOneAndRemove() : 특정 조건 만족하는 데이터 하나 찾아서 제거
*/
export const remove = async (ctx) => {
  const { id } = ctx.params;
  try {
    await Post.findByIdAndRemove(id).exec();
    ctx.status = 204; // No content (응답은 성공했지만 데이터는 없음)
  } catch (e) {
    ctx.throw(500, e);
  }
};
/* PATCH /api/posts/:id 
{
  title: 수정,
  body: 수정,
  tags: ['수정', '태그']
}
*/
export const update = async (ctx) => {
  const { id } = ctx.params;
  // write 와 비슷하지만 required 가 없음
  const schema = Joi.object().keys({
    title: Joi.string(),
    body: Joi.string(),
    tags: Joi.array().items(Joi.string()), // 문자열로 이루어진 배열
  });
  // 검증하고나서 실패인 경우 에러 처리
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }

  try {
    const post = await Post.findByIdAndUpdate(id, ctx.request.body, {
      new: true, // true이면 업데이트된 데이터 반환, false 이면 업데이트 전 반환
    }).exec();
    if (!post) {
      ctx.status = 404;
      return;
    }
    ctx.body = post;
  } catch (e) {
    ctx.throw(500, e);
  }
};
