import React, {useEffect} from "react";
import qs from 'qs';
import { useDispatch, useSelector } from "react-redux";
import PostList from "../../components/posts/PostList";
import { listPosts } from "../../modules/posts";
import { useParams, useLocation } from "react-router";

const PostListContainer = () => {
  const dispatch = useDispatch();
  const {username} = useParams();

  const {posts, error, loading, user} = useSelector(
    ({posts, loading, user}) => ({
      posts: posts.posts,
      error: posts.error,
      loading: loading['posts/LIST_POSTS'],
      user: user.user,
    }),
  );

  /* {pathname, search} = useLocation()
  pathname : /@hyeoz
  seach : tag=tag&page=1 */
  const {search} = useLocation();
  // console.log(search, params);
  useEffect(() => {
    const {tag, page} = qs.parse(search, {
      ignoreQueryPrefix: true,
    });
    // console.log(tag, page, username);
    dispatch(listPosts({tag, username, page}))
  }, [dispatch, search, username]);

  return (
    <PostList loading={loading} error={error} posts={posts} showWriteButton={user} />
  );
};

export default PostListContainer;
