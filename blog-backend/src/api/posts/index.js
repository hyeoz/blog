import Router from 'koa-router';
import checkedLoggedIn from '../../lib/chekcedLoggedIn';
import {
  list,
  write,
  read,
  remove,
  update,
  getPostById,
  checkOwnPost,
} from './posts.ctrl';

const posts = new Router();

// const printInfo = (ctx) => {
//   ctx.body = {
//     method: ctx.method,
//     path: ctx.path,
//     params: ctx.params,
//   };
// };

// posts.get('/', printInfo);
// posts.post('/', printInfo);
// posts.get('/:id', printInfo);
// posts.delete('/:id', printInfo);
// posts.put('/:id', printInfo);
// posts.patch('/:id', printInfo);

posts.get('/', list);
posts.post('/', checkedLoggedIn, write);

const post = new Router();
post.get('/', read);
post.delete('/', checkedLoggedIn, checkOwnPost, remove);
// post.put('/:id', replace);
post.patch('/', checkedLoggedIn, checkOwnPost, update);

posts.use('/:id', getPostById, post.routes());

export default posts;
