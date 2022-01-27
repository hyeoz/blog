import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useParams } from "react-router"
import PostViewer from "../../components/posts/PostViewer";
import { readPost, unloadPost } from "../../modules/post";

const PostViewerContainer = () => {
  // 처음 마운트 될 때 포스트 읽기 API 요청
  const {postId} = useParams();
  const dispatch = useDispatch();
  const {post, error, loading} = useSelector(({post, loading}) => ({
    post: post.post,
    error: post.error,
    loading: loading['post/READ_POST'],
  }));

  useEffect(() => {
    dispatch(readPost(postId));
    // 언마운트 될 때 리덕스에서 포스트 데이터 없애기
    return (() => {
      dispatch(unloadPost());
    });
  }, [dispatch, postId]);

  return <PostViewer post={post} loading={loading} error={error} />;
};

export default PostViewerContainer;
