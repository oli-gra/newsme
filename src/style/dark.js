import { createMuiTheme } from '@material-ui/core/styles'

const darkmode = createMuiTheme({
   palette: {
      type: 'dark',
   },
   typography: {
      fontFamily: [
         '-apple-system',
         'Roboto',
      ].join(','),
   },
})

export default darkmode