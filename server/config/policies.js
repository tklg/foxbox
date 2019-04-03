module.exports = {
  userController: {
    me: [ 'sessionAuth' ]
  },
  providerController: {
    '*': [ 'sessionAuth' ]
  }
}
