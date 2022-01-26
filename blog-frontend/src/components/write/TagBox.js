import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import palette from "../../lib/styles/palette";

const TagBoxBlock = styled.div`
  width: 100%;
  border-top: 1px solid ${palette.gray[2]};
  padding-top: 2rem;

  h4 {
    color: ${palette.gray[8]};
    margin-top: 0;
    margin-bottom: 0.5rem;
  }
`;

const TagForm = styled.form`
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  width: 256px;
  border: 1px solid ${palette.gray[9]}; 
  
  // 스타일 초기화
  input , button {
    outline: none;
    border: none;
    font-size: 1rem;
  }

  input {
    padding: 0.5rem;
    flex: 1;
    min-width: 0;
  }

  button {
    cursor: pointer;
    padding-right: 1rem;
    padding-left: 1rem;
    border: none;
    background: ${palette.gray[8]};
    color: white;
    font-weight: bold;
    &:hover {
      background: ${palette.gray[6]};
    }
  }
`;

const Tag = styled.div`
  margin-right: 0.5rem;
  color: ${palette.gray[6]};
  cursor: pointer;
  &:hover {
    opacity: 0.5;
  }
`;

const TagListBlock = styled.div`
  display: flex;
  margin-top: 0.5rem;
`;

// React.memo 를 사용하여 tag 값이 바뀔 때만 리렌더링 되도록 처리
const TagItem = React.memo(({tag, onRemove}) => (
  <Tag onClick={() => onRemove(tag)}>#{tag}</Tag>
));

const TagList = React.memo(({tags, onRemove}) => {
  // console.log(tags, "tags");
  return (
    <TagListBlock>
      {tags.map((tag) => (
        <TagItem key={tag} tag={tag} onRemove={onRemove} />
      ))}
    </TagListBlock>
  );
})

const TagBox = ({tags, onChangeTags}) => {
  const [input, setInput] = useState('');
  const [localTags, setLocalTags] = useState([]);

  const insertTag = useCallback(tag => {
    if (!tag) return; // 빈칸이라면 추가하지 않음
    if (localTags.includes(tag)) return; // 중복이면 추가하지 않음
    // setLocalTags([...localTags, tag]);
    const nextTags = [...localTags, tag];
    setLocalTags(nextTags);
    onChangeTags(nextTags);
  }, [localTags, onChangeTags],);

  const onRemove = useCallback(tag => {
    // setLocalTags(localTags.filter(t => t !== tag));
    const nextTags = localTags.filter(t => t !== tag);
    setLocalTags(nextTags);
    onChangeTags(nextTags);
  }, [localTags, onChangeTags],);

  const onChange = useCallback(e => {
    setInput(e.target.value);
  },[]);

  const onSubmit = useCallback(e => {
    e.preventDefault();
    insertTag(input.trim()) // 앞뒤 공백 없앤 후 등록
    setInput(''); // input 초기화
  }, [input, insertTag],);

  // tags 값이 바뀔 때 렌더링
  useEffect(() => {
    setLocalTags(tags);
  }, [tags]);
  
  return (
    <TagBoxBlock>
      <h4>태그</h4>
      <TagForm onSubmit={onSubmit}>
        <input placeholder="태그를 추가하세요." value={input} onChange={onChange} />
        <button type="submit">추가</button>
      </TagForm>
      <TagList tags={localTags} onRemove={onRemove} />
    </TagBoxBlock>
  );
};

export default TagBox;

/* 정리
TagBox 컴포넌트에서 모든 작업 하지않고 TagItem, TagList 컴포넌트 분리시켜 렌더링 최적화. 
이 경우 input 값이 바뀔 때 태그 목록은 렌더링되지 않음. 또 태그 목록에 변화가 생기더라도 이미 렌더링중인 각각의 아이템들은 리렌더링 되지 않음.
컴포넌트만 분리하는 것이 아니라 React.memo 로 감싸주었기 때문 */