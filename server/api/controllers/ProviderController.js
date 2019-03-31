module.exports = {
  list: async (req, res) => {
    res.json([{
      name: 'Gmail',
      icon: 'gmail'
    }, {
      name: 'Outlook',
      icon: 'outlook'
    }, {
      name: 'Other',
      icon: 'at'
    }])
  }
}
