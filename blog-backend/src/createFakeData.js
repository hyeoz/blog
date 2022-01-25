import Post from './models/post';

export default function createFakeData() {
  // 0,1,...39로 이루어진 배열을 생성한 후 포스트 데이터로 변환
  const posts = [...Array(40).keys()].map((i) => ({
    title: `포스트#${i}`,
    body: '언제끝나',
    tags: ['test', 'data'],
  }));
  Post.insertMany(posts, (err, docs) => {
    // console.log(docs);
  });
}
