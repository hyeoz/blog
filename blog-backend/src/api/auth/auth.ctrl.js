import Joi from 'joi';
import User from '../../models/user';

/* POST /api/auth/register 
  {
    username: 'hyeoz',
    password: '0203'
  }
*/
export const register = async (ctx) => {
  // Request body 검증
  const schema = Joi.object().keys({
    // 아이디는 문자, 알파벳과 숫자, 3~20글자, 필수
    username: Joi.string().alphanum().min(3).max(20).required(),
    password: Joi.string().required(),
  });
  const result = schema.validate(ctx.request.body);
  if (result.error) {
    ctx.status = 400;
    ctx.body = result.error;
    return;
  }
  // 회원가입
  const { username, password } = ctx.request.body;
  try {
    // username 중복 확인
    const exists = await User.findByUsername(username);
    if (exists) {
      ctx.status = 409; // Conflict
      // alert('중복된 이름입니다.');
      return;
    }
    const user = new User({
      username,
    });
    await user.setPassword(password);
    await user.save();
    // 응답하는 데이터에서는 hashedPassword 필드 제거 -> 반복되기 때문에 serialize 로 따로 만들기
    // const data = user.toJSON()
    // delete data.hashedPassword
    // ctx.body = data
    ctx.body = user.serialize();
    // 토큰 쿠키에 담아서 사용
    const token = user.generateToken();
    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // milli second 단위. 7일
      httpOnly: true,
    });
  } catch (e) {
    ctx.throw(500, e);
  }
};
/* POST /api/auth/login 
  {
    username: 'hyeoz',
    password: '0203'
  }
*/
export const login = async (ctx) => {
  const { username, password } = ctx.request.body;
  // username, password 중 하나라도 없으면 에러처리
  if (!username || !password) {
    ctx.status = 401; // Unauthorizatized
    return;
  }
  // 로그인
  try {
    // 계정이 존재하지 않으면 에러처리
    const user = await User.findByUsername(username);
    if (!user) {
      ctx.status = 401;
      return;
    }
    // 잘못된 비밀번호
    const valid = await user.checkPassword(password); // 인스턴스 메서드와 스태틱 메서드 헷길리지 말것
    if (!valid) {
      ctx.status = 401;
      return;
    }
    ctx.body = user.serialize();

    // 토큰 쿠키에 담아서 사용
    const token = user.generateToken();
    ctx.cookies.set('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7, // milli second 단위. 7일
      httpOnly: true,
    });
  } catch (e) {
    ctx.throw(500, e);
  }
};
/* GET /api/auth/check */
export const check = async (ctx) => {
  // 로그인 상태 확인
  const { user } = ctx.state;
  if (!user) {
    // 로그인중이 아님
    ctx.status = 401;
    return;
  }
  ctx.body = user;
};
/* POST /api/auth/logout */
export const logout = async (ctx) => {
  // 로그아웃
  ctx.cookies.set('access_token');
  ctx.status = 204;
};
