module.exports = {
  UserController: {
    me: [ 'tokenAuth' ]
  },
  ProviderController: {
    list: [ 'tokenAuth' ],
    connect: [ 'sessionAuth' ],
    connectCallback: [ 'sessionAuth' ],
    listMailboxes: [ 'tokenAuth' ],
    listMessages: [ 'tokenAuth' ],
    fetchMessages: [ 'tokenAuth' ]
  }
}
