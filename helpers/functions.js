const users = [];

const addUser = ({ socket_id, name, user_id, chat_id }) => {
  const foundUser = users.find(
    (user) => user.chat_id === chat_id && user.user_id === user_id
  );
  if (foundUser) {
    return { error: 'User already exist in this chat' };
  }
  const user = { socket_id, name, user_id, chat_id };
  users.push(user);
  return { user };
};

const removeUser = (socket_id) => {
  const index = users.findIndex((user) => user.socket_id === socket_id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = (socket_id) => {
  return users.find((user) => user.socket_id === socket_id);
};

const showError = (err) => {
  let errors = { name: '', email: '', password: '' };

  if (err.message === 'incorrect email') {
    errors.email = 'This email not found';
  }
  if (err.message === 'incorrect password') {
    errors.password = 'The password is incorrect';
  }
  if (err.code === 11000) {
    errors.email = 'This email already exist';
    return errors;
  }
  if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

module.exports = { addUser, removeUser, getUser, showError };
