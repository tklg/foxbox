module.exports = {
  'GET /login': 'Auth#login',
  'GET /login/callback': 'Auth#loginCallback',

  'GET /api/providers/list': 'Provider#list',
  'GET /connect/:provider': 'Provider#connect',
  'GET /connect/:provider/callback': 'Provider#connectCallback'
}
