import mongoose, { Schema } from 'mongoose';

// 스키마 지정
const PostSchema = new Schema({
  title: String,
  body: String,
  tags: [String],
  publishedDate: {
    type: Date,
    default: Date.now,
  },
  user: {
    _id: mongoose.Types.ObjectId,
    username: String,
  },
});

// 모델 생성
const Post = mongoose.model('Post', PostSchema);
export default Post;
