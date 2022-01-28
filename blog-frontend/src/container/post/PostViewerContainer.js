import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router"
import { useNavigate } from "react-router-dom";
import PostActionButtons from "../../components/post/PostActionButtons";
import PostViewer from "../../components/posts/PostViewer";
import { removePost } from "../../lib/api/posts";
import { readPost, unloadPost } from "../../modules/post";
import { setOriginalPost } from "../../modules/write";

const PostViewerContainer = () => {
  // 처음 마운트 될 때 포스트 읽기 API 요청
  const {postId} = useParams();
  // console.log(postId);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {post, error, loading, user} = useSelector(({post, loading, user}) => ({
    post: post.post,
    error: post.error,
    loading: loading['post/READ_POST'],
    user: user.user,
  }));

  useEffect(() => {
    dispatch(readPost(postId));
    // 언마운트 될 때 리덕스에서 포스트 데이터 없애기
    return (() => {
      dispatch(unloadPost());
    });
  }, [dispatch, postId]);

  // 수정
  const onEdit = () => {
    dispatch(setOriginalPost(post));
    navigate('/write');
  };

  // 삭제
  const onRemove = async() => {
    try {
      await removePost(postId);
      navigate('/') // 홈으로 이동
    } catch (e) {
      console.log(e);
    }
  };

  // 현재 유저가 해당 글의 작성자일때만 수정삭제 버튼 나타나도록
  const ownPost = (user && user._id) === (post && post.user._id);
  // console.log(ownPost)

  return <PostViewer post={post} loading={loading} error={error} actionButtons={ownPost && <PostActionButtons onEdit={onEdit} onRemove={onRemove} />} />;
};

export default PostViewerContainer;
