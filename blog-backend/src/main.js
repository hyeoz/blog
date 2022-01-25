require('dotenv').config();
const Koa = require('koa');
const Router = require('koa-router');
const mongoose = require('mongoose');

const { PORT, MONGO_URI } = process.env;

import createFakeData from './createFakeData';

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to MongoDB');
    createFakeData();
  })
  .catch((e) => {
    console.error(e);
  });

// 컨트롤러 파일 작성
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new Router();

app.use(bodyParser());

// 라우터 모듈 불러오기
const api = require('./api').default;
router.use('/api', api.routes());

// 토큰
import jwtMiddleware from './lib/jwtMiddleware';
app.use(jwtMiddleware);
// app.use(async (ctx, next) => {
//   console.log(ctx.url);
//   console.log(1);
//   // console.log(ctx.query);
//   if (ctx.query.authorized !== '1') {
//     ctx.status = 401; // Unauthorized -> 이후 미들웨어 처리하지 않음
//     return;
//   }
//   await next();
//   console.log('END');
// });

// app.use((ctx, next) => {
//   console.log(2);
//   next();
// });

// app.use((ctx) => {
//   ctx.body = 'hello world';
// });

// 라우터 설정
router.get('/', (ctx) => {
  ctx.body = '홈';
});

// 파라미터
router.get('/about/:name?', (ctx) => {
  // ? 는 있을지 없을지 모를 때
  const { name } = ctx.params;
  ctx.body = name ? `${name} 의 소개` : '소개';
});
// 쿼리
router.get('/posts', (ctx) => {
  const { id } = ctx.query;
  // id의 존재유무에 따라 다른 결과 출력
  ctx.body = id ? `포스트 #${id}` : '포스트 아이디가 없습니다.';
});

// app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

const port = PORT || 4000;
app.listen(port, () => {
  console.log('Listening on port', port);
});
