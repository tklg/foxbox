module.exports = {
  UserController: {
    me: [ 'tokenAuth' ]
  },
  ProviderController: {
    list: [ 'tokenAuth' ],
    connect: [ 'sessionAuth' ],
    connectCallback: [ 'sessionAuth' ]
  }
}
