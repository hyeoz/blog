import Quill from "quill";
import 'quill/dist/quill.bubble.css';
import styled from "styled-components";
import palette from "../../lib/styles/palette";
import Responsive from "../common/Responsive";
import { useRef, useEffect } from "react";

const EditorBlock = styled(Responsive)`
  // 페이지 위아래 여백 지정
  padding-top: 5rem;
  padding-bottom: 5rem;
`;

const TitleInput = styled.input`
  font-size: 3rem;
  outline: none;
  padding-bottom: 0.5rem;
  border: none;
  border-bottom: 1px solid ${palette.gray[4]};
  margin-bottom: 2rem;
  width: 100%;
`;

const QuillWrapper = styled.div`
  // 최소크기 지정 및 padidng 제거
  .ql-editor {
    padding: 0;
    min-height: 320px;
    font-size: 1.125rem;
    line-height: 1.5;
  }
  .ql-editor .ql-blank:before {
    left: 0px;
  }
`;

const Editor = ({title, body, onChangeField}) => {
  // 컴포넌트 로컬 변수 사용해야 할 때
  const quillElement = useRef(null); // Quill 을 적용할 div element 를 설정
  const quillInstance = useRef(null); // Quill 인스턴스 설정

  useEffect(() => {
    quillInstance.current = new Quill(quillElement.current, {
      theme: 'bubble',
      placeholder: '내용을 작성하세요.',
      modules: {
        // 더 많은 옵션
        // https://quilljs.com/docs/modules/toolbar 참고
        toolbar: [
          [{header: '1'}, {header: '2'}],
          ['bold', 'italic', 'underline', 'strike'],
          [{list: 'ordered'}, {list: 'bullet'}],
          ['blockquote', 'code-block', 'link', 'image'],
        ],
      },
    });

    // quill 에 text-change 이벤트 핸들러 등록 (quill 자체 핸들러)
    // https://quilljs.com/docs/api/#events 참고
    const quill = quillInstance.current;
    quill.on('text-change', (delta, onDelta, source) => {
      if (source === 'user') {
        onChangeField({key: 'body', value: quill.root.innerHTML});
      }
    });
  }, [onChangeField]);

  const onChangeTitle = (e) => {
    onChangeField({key: 'title', value: e.target.value});
  };

  return (
    <EditorBlock>
      <TitleInput placeholder="제목을 입력하세요." onChange={onChangeTitle} value={title} />
      <QuillWrapper>
        <div ref={quillElement} />
      </QuillWrapper>
    </EditorBlock>
  );
};

export default Editor;
