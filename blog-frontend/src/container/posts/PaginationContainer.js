import QueryString from "qs";
import { useSelector } from "react-redux"
import { useLocation, useParams } from "react-router";
import Pagination from "../../components/posts/Pagination";

const PaginationContainer = () => {
  const {username} = useParams();
  const {search} = useLocation();

  const {lastPage, posts, loading} = useSelector(({posts, loading}) => ({
    lastPage: posts.lastPage,
    posts: posts.posts,
    loading: loading['posts.LIST_POSTS']
  }));

  // 포스트 데이터가 없거나 로딩중이면 아무것도 보여주지 않음
  if (!posts || loading) return null;
  // page 가 없으면 기본값 1
  const {tag, page = 1} = QueryString.parse(search, {
    ignoreQueryPrefix: true,
  });

  return (
    <Pagination tag={tag} username={username} page={parseInt(page, 10)} lastPage={lastPage} />
  );
};

export default PaginationContainer;
