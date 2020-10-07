const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    validate: {
      validator: (v) => /^http[s]?:\/{2}(w{3}\.)?(([a-z0-9]+[a-z0-9-_]*(\.[a-z0-9]+[a-z0-9-_]*)*(\.[a-z]+))|(\d+(\.\d+){1,4}))(:\d+)?(\/[a-z0-9_-]+)*\/?#?/.test(v),
      message: (props) => `${props.value} неправильная ссылка на статью`,
    },
    required: true,
  },
  image: {
    type: String,
    validate: {
      validator: (v) => /^http[s]?:\/{2}(w{3}\.)?(([a-z0-9]+[a-z0-9-_]*(\.[a-z0-9]+[a-z0-9-_]*)*(\.[a-z]+))|(\d+(\.\d+){1,4}))(:\d+)?(\/[a-z0-9_-]+)*\/?#?/.test(v),
      message: (props) => `${props.value} неправильная ссылка на картинку`,
    },
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
},
{ versionKey: false });

module.exports = mongoose.model('article', articleSchema);
