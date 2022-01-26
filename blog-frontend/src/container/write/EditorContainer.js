import { useEffect, useCallback } from "react";
import Editor from "../../components/write/Editor";
import { useSelector, useDispatch } from "react-redux";
import { changeField, initialize } from "../../modules/write";

const EditorContainer = () => {
  const dispatch = useDispatch();
  const {title, body} = useSelector(({write}) => ({
    title: write.title,
    body: write.body,
  }));
  const onChangeField = useCallback((payload) => dispatch(changeField(payload)), [dispatch],);
  // 언마운트될 때 초기화
  useEffect(() => {
    return () => {
      dispatch(initialize());
    };
  }, [dispatch]);

  return <Editor onChangeField={onChangeField} title={title} body={body} />;
}

export default EditorContainer;

/* 컨테이너 컴포넌트는 화면 UI 와 관련된 html 태그나 함수는 가지고 있지 않지만 
클라이언트에서 받아온 값을 리덕스에 저장하는 등 역할을 함 */
