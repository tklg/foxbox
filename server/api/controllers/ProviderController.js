/* global Log Passport boxes */
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const TAG = 'ProviderController'

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.ROOT_URL + '/connect/google/callback',
  passReqToCallback: true
}, async function (req, accessToken, refreshToken, profile, cb) {
  Log.d(TAG, profile)
  const pass = await Passport.findOrCreate({ provider: 'google', identifier: profile.id, user: req.user })

  if (accessToken) pass.accessToken = accessToken
  if (refreshToken) pass.refreshToken = refreshToken
  if (profile.emails && profile.emails.length) pass.email = profile.emails[0].value
  if (accessToken || refreshToken) await pass.save()

  cb(null, pass, profile, null)
}))

module.exports = {
  list: async (req, res) => {
    const { hash } = await boxes.helpers.hashids()
    const connected = await Passport.where({ user: req.user })
    res.json({
      available: [{
        name: 'Gmail',
        icon: 'gmail'
      }, {
        name: 'Outlook',
        icon: 'outlook'
      }, {
        name: 'Other',
        icon: 'at'
      }],
      connected: connected.filter(x => x.provider !== 'auth3').map(x => {
        let name = x.provider
        let icon = x.provider
        switch (x.provider) {
          case 'google': name = 'Google'; icon = 'gmail'; break
        }
        return {
          id: hash(x.id),
          name,
          icon
        }
      })
    })
  },
  connect: async (req, res, next) => {
    let provider = req.params.provider
    if (provider === 'gmail') provider = 'google'
    let scope
    switch (provider) {
      case 'google': scope = [ 'profile', 'email', 'https://mail.google.com/' ]
    }
    passport.authorize(provider, { scope: scope })(req, res, next)
  },
  connectCallback: async (req, res, next) => {
    let provider = req.params.provider
    if (provider === 'gmail') provider = 'google'
    passport.authorize(provider, async (e, pass, info, status) => {
      if (e) {
        Log.e(TAG, e)
      }

      const user = req.user
      pass.user = user
      await pass.save()

      if (process.env.NODE_ENV === 'development') return res.redirect('http://localhost:3000/box')
      res.redirect('/box')
    })(req, res, next)
  },
  listMailboxes: async (req, res) => {
    const { clientBuilder, providerOpts } = await boxes.helpers.imap()
    const { unhash } = await boxes.helpers.hashids()
    const passport = await Passport.findOne({ id: unhash(req.params.id) })

    /* const client = await clientBuilder({
      ...providerOpts[passport.provider],
      auth: {
        user: passport.email,
        xoauth2: passport.accessToken
      }
    })

    const mailboxes = await client.listMailboxes()
    res.json(mailboxes) */

    res.json({ 'root': true, 'children': [{ 'name': 'INBOX', 'delimiter': '/', 'path': 'INBOX', 'children': [], 'flags': ['\\HasNoChildren', { 'type': 'ATOM', 'value': '\\HasNoChildren' }], 'listed': true, 'subscribed': true }, { 'name': 'Personal', 'delimiter': '/', 'path': 'Personal', 'children': [{ 'name': 'Daily UI', 'delimiter': '/', 'path': 'Personal/Daily UI', 'children': [], 'flags': ['\\HasNoChildren', { 'type': 'ATOM', 'value': '\\HasNoChildren' }], 'listed': true, 'subscribed': true }], 'flags': ['\\HasChildren', { 'type': 'ATOM', 'value': '\\HasChildren' }], 'listed': true, 'subscribed': true }, { 'name': 'Receipts', 'delimiter': '/', 'path': 'Receipts', 'children': [], 'flags': ['\\HasNoChildren', { 'type': 'ATOM', 'value': '\\HasNoChildren' }], 'listed': true, 'subscribed': true }, { 'name': 'Travel', 'delimiter': '/', 'path': 'Travel', 'children': [], 'flags': ['\\HasNoChildren', { 'type': 'ATOM', 'value': '\\HasNoChildren' }], 'listed': true, 'subscribed': true }, { 'name': 'Work', 'delimiter': '/', 'path': 'Work', 'children': [], 'flags': ['\\HasNoChildren', { 'type': 'ATOM', 'value': '\\HasNoChildren' }], 'listed': true, 'subscribed': true }, { 'name': '[Gmail]', 'delimiter': '/', 'path': '[Gmail]', 'children': [{ 'name': 'All Mail', 'delimiter': '/', 'path': '[Gmail]/All Mail', 'children': [], 'flags': ['\\All', '\\HasNoChildren', { 'type': 'ATOM', 'value': '\\All' }, { 'type': 'ATOM', 'value': '\\HasNoChildren' }], 'listed': true, 'specialUse': '\\All', 'specialUseFlag': '\\All', 'subscribed': true }, { 'name': 'Drafts', 'delimiter': '/', 'path': '[Gmail]/Drafts', 'children': [], 'flags': ['\\Drafts', '\\HasNoChildren', { 'type': 'ATOM', 'value': '\\Drafts' }, { 'type': 'ATOM', 'value': '\\HasNoChildren' }], 'listed': true, 'specialUse': '\\Drafts', 'specialUseFlag': '\\Drafts', 'subscribed': true }, { 'name': 'Important', 'delimiter': '/', 'path': '[Gmail]/Important', 'children': [], 'flags': ['\\HasNoChildren', '\\Important', { 'type': 'ATOM', 'value': '\\HasNoChildren' }, { 'type': 'ATOM', 'value': '\\Important' }], 'listed': true, 'subscribed': true }, { 'name': 'Sent Mail', 'delimiter': '/', 'path': '[Gmail]/Sent Mail', 'children': [], 'flags': ['\\HasNoChildren', '\\Sent', { 'type': 'ATOM', 'value': '\\HasNoChildren' }, { 'type': 'ATOM', 'value': '\\Sent' }], 'listed': true, 'specialUse': '\\Sent', 'specialUseFlag': '\\Sent', 'subscribed': true }, { 'name': 'Spam', 'delimiter': '/', 'path': '[Gmail]/Spam', 'children': [], 'flags': ['\\HasNoChildren', '\\Junk', { 'type': 'ATOM', 'value': '\\HasNoChildren' }, { 'type': 'ATOM', 'value': '\\Junk' }], 'listed': true, 'specialUse': '\\Junk', 'specialUseFlag': '\\Junk', 'subscribed': true }, { 'name': 'Starred', 'delimiter': '/', 'path': '[Gmail]/Starred', 'children': [], 'flags': ['\\Flagged', '\\HasNoChildren', { 'type': 'ATOM', 'value': '\\Flagged' }, { 'type': 'ATOM', 'value': '\\HasNoChildren' }], 'listed': true, 'specialUse': '\\Flagged', 'specialUseFlag': '\\Flagged', 'subscribed': true }, { 'name': 'Trash', 'delimiter': '/', 'path': '[Gmail]/Trash', 'children': [], 'flags': ['\\HasNoChildren', '\\Trash', { 'type': 'ATOM', 'value': '\\HasNoChildren' }, { 'type': 'ATOM', 'value': '\\Trash' }], 'listed': true, 'specialUse': '\\Trash', 'specialUseFlag': '\\Trash', 'subscribed': true }], 'flags': ['\\HasChildren', '\\Noselect', { 'type': 'ATOM', 'value': '\\HasChildren' }, { 'type': 'ATOM', 'value': '\\Noselect' }], 'listed': true, 'subscribed': true }] })
  }
}
