import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const UserSchema = new Schema({
  username: String,
  hashedPassword: String,
});

// 인스턴스 메서드 만들기
UserSchema.methods.setPassword = async function (password) {
  const hash = await bcrypt.hash(password, 10);
  // this 를 사용해야 하기때문에 화살표함수 X
  this.hashedPassword = hash;
};
UserSchema.methods.checkPassword = async function (password) {
  const result = await bcrypt.compare(password, this.hashedPassword);
  return result;
};

// 스태틱 메서드 만들기
UserSchema.statics.findByUsername = function (username) {
  return this.findOne({ username });
};

// Serialize
UserSchema.methods.serialize = function () {
  const data = this.toJSON();
  delete data.hashedPassword;
  return data;
};

// 토큰
UserSchema.methods.generateToken = function () {
  const token = jwt.sign(
    // 첫번째 파라미터에는 토큰안에 넣고싶은 데이터
    {
      _id: this.id,
      username: this.username,
    },
    // 두번째 파라미터에는 JWT 암호
    process.env.JWT_SECRET,
    // 세번째 파라미터에는 유효 기간
    {
      expiresIn: '7d',
    },
  );
  return token;
};

const User = mongoose.model('User', UserSchema);
export default User;
