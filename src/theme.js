const { createMuiTheme } = require("@material-ui/core")

const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#b79ced',
            main: '#826aed',
            dark: '#7161ef',
            contrastText: '#fff',
        },
        secondary: {
            light: '#ffb7ff',
            main: '#c879ff',
            dark: '#c04cfd',
            contrastText: '#000',
        },

    }
})

export default theme