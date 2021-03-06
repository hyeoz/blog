import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AuthForm from "../../components/auth/AuthForm";
import { changeField, initializeFrom, register } from "../../modules/auth";
import { check } from "../../modules/user";


const RegisterForm = () => {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {form, auth, authError, user} = useSelector(({auth, user}) => ({
    form: auth.register,
    auth: auth.auth,
    authError: auth.authError,
    user: user.user,
  }));
  // console.log(user, "user data");
  // input 변경 이벤트 핸들러
  const onChange = e => {
    const {value, name} = e.target;
    dispatch(changeField({
      form: 'register',
      key: name,
      value
    }));
  };
  // form 등록 이벤트 핸들러
  const onSubmit = e => {
    e.preventDefault();
    const {username, password, passwordConfirm} = form;
    if ([username, password, passwordConfirm].includes('')) {
      setError('빈 칸을 모두 입력하세요.');
      return;
    }
    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      dispatch(changeField({form: 'register', key: 'password', value: ''}));
      dispatch(changeField({form: 'register', key: 'passwordConfirm', value: ''}));
      return;
    }
    dispatch(register({username, password}));
  };
  // 컴포넌트가 처음 렌더링 될 때 form 을 초기화
  useEffect(() => {
    dispatch(initializeFrom('register'));
  }, [dispatch]);
  // 회원가입 성공/실패 처리
  useEffect(() => {
    if (authError) {
      if (authError.response.status === 409) {
        // 아이디가 이미 존재할 때
        setError('이미 존재하는 계정입니다.');
        return;
      }
      // 기타 이유
      setError('회원가입 실패');
      return;
    }
    if (auth) {
      console.log("회원가입 성공");
      console.log(auth);
      dispatch(check());
    }
  }, [auth, authError, dispatch]);

  // user 값이 잘 설정되었는지 확인
  useEffect(() => {
    if (user) {
      // console.log("check api 성공");
      // console.log(user);
      navigate('/') // 홈화면으로 이동
      try {
        localStorage.setItem('user', JSON.stringify(user));
      } catch (e) {
        console.log("localStorage is not working");
      }
    }
  });

  return (
    <AuthForm type="register" form={form} onChange={onChange} onSubmit={onSubmit} error={error} />
  );
};

export default RegisterForm;
