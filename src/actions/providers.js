let Url = `${window.location.origin}/api/providers`
if (window.location.origin.indexOf('localhost') > -1) Url = 'http://localhost:3001/api/providers'
const SUrl = Url + '/ftpws'

const fetchProviders = () => (dispatch, getState) => {
  
}
