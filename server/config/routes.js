module.exports = {
  'GET /login': 'Auth#login',
  'GET /login/callback': 'Auth#loginCallback',

  'GET /api/me': 'User#me',

  'GET /api/providers/list': 'Provider#list',
  'GET /connect/:provider': 'Provider#connect',
  'GET /connect/:provider/callback': 'Provider#connectCallback',

  'GET /api/providers/:id/mailboxes': 'Provider#listMailboxes',

  'GET /api/mailboxes/:provider/:box/messages': 'Provider#listMessages',
  'GET /api/mailboxes/:provider/:box/message/:uids': 'Provider#fetchMessages'
}
