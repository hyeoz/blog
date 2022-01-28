import { Route, Routes } from 'react-router';
import LoginPage from './pages/LoginPage';
import PostListPage from './pages/PostListPage';
import PostPage from './pages/PostPage';
import RegisterPage from './pages/RegisterPage';
import WritePage from './pages/WritePage';
import './App.css';
import { Helmet } from 'react-helmet-async';

function App() {
  return (
    <>
      <Helmet>
        <title>REACTERS</title>
      </Helmet>
      <Routes>
        {/* ID앞에 @가 붙는 경우에 파라미터로 인식할 수 있도록 */}
        <Route path={"/*" || '/@:username'} element={<PostListPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="write" element={<WritePage />} />
        <Route path="/@:username/:postId" element={<PostPage />} />
      </Routes>
    </>
  );
}

export default App;
