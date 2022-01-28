import React, {useEffect} from "react";
import WriteActionButtons from "../../components/write/WriteActionButtons";
import { useSelector, useDispatch } from "react-redux";
import { updatePost, writePost } from "../../modules/write";
import { useNavigate } from "react-router-dom";

const WriteActionButtonsContainer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {title, body, tags, post, postError, originalPostId} = useSelector(({write}) => ({
    title: write.title,
    body: write.body,
    tags: write.tags,
    post: write.post,
    postError: write.postError,
    originalPostId: write.originalPostId,
  }));

  // 포스트 등록
  const onPublish = () => {
    // 포스트 수정기능 추가
    if (originalPostId) {
      dispatch(updatePost({title, body, tags, id: originalPostId}));
      return;
    }
    dispatch(writePost({title, body, tags,}),);
  };

  // 포스트 취소
  const onCancel = () => {
    navigate(-1); // 뒤로가기
  };

  // 성공 혹은 실패시 할 작업
  useEffect(() => {
    if (post) {
      // console.log(post);
      const {_id, user} = post;
      // console.log("post 불러오기 성공");
      navigate(`/@${user.username}/${_id}`);
    }
    if (postError) {
      console.log(postError);
    }
  }, [post, postError, navigate])
  // originalPostId true/false 로 판단하기 위해 !! 두개 쓰기
  return <WriteActionButtons onPublish={onPublish} onCancel={onCancel} isEdit={!!originalPostId} />;
};

export default WriteActionButtonsContainer;
