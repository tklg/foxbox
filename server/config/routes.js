module.exports = {
  'GET /api/providers/list': 'Provider#list',
  'GET /connect/:provider': 'Provider#connect',
  'GET /connect/:provider/callback': 'Provider#connectCallback'
}
