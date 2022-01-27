import React, {useEffect} from "react";
import WriteActionButtons from "../../components/write/WriteActionButtons";
import { useSelector, useDispatch } from "react-redux";
import { writePost } from "../../modules/write";
import { useNavigate } from "react-router-dom";

const WriteActionButtonsContainer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {title, body, tags, post, postError} = useSelector(({write}) => ({
    title: write.title,
    body: write.body,
    tags: write.tags,
    post: write.post,
    postError: write.postError,
  }));

  // 포스트 등록
  const onPublish = () => {
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

  return <WriteActionButtons onPublish={onPublish} onCancel={onCancel} />;
};

export default WriteActionButtonsContainer;
