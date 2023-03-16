const response = (h, code, message, data = null) => {
  const json = {
    status: (code - 200) <= 26 ? 'success' : 'fail',
    message,
  };

  if (data) json.data = data;

  const r = h.response(json);
  r.code(code);
  return r;
};

export default response;
