import Responsive from "../components/common/Responsive";
// import Editor from "../components/write/Editor";
// import TagBox from "../components/write/TagBox";
// import WriteActionButtons from "../components/write/WriteActionButtons";
import EditorContainer from "../container/write/EditorContainer";
import TagBoxContainer from "../container/write/TagBoxContainer";
import WriteActionButtonsContainer from "../container/write/WriteActionButtonsContainer";

const WritePage = () => {
  return (
    <Responsive>
      <EditorContainer />
      <TagBoxContainer />
      <WriteActionButtonsContainer />
    </Responsive>
  )
};

export default WritePage;
