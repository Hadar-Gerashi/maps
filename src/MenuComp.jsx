import React from 'react';
import AppBar from '@mui/material/AppBar';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { ThemeProvider, createTheme } from '@mui/material/styles';


//קומפוננטה מיובאת מmui להצגת דיב עם איקון של menu שכשנלחץ על זה אז יוצג הטופס
function MenuComp(prop) {
  return (
    <Toolbar  sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' ,marginRight:"-9px",width:"67x"}}>
      <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mb: 2 }} onClick={prop.func}>
        <MenuIcon />
      </IconButton>
    </Toolbar>
  );
}

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
  },
});

export default function EnableColorOnDarkAppBar(prop) {


  return (
    <ThemeProvider theme={darkTheme}>
      <Stack direction="row" sx={{ height: '100vh',width:"50px" }}>
        {/* התפריט שמוצג בצד ימין לאורך כל הדף */}
        <AppBar
          position="static"
          color="white"
          sx={{
            width: '67px',  // הרוחב של התפריט בצד ימין
            height: '100vh',
            backgroundColor:"white",  // גובה התפריט לאורך כל הדף
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            paddingTop: '10px',  // קצת רווח בחלק העליון
          }}
          enableColorOnDark
        >
   
                    <MenuComp func={prop.func} />
        </AppBar>

      </Stack>
    </ThemeProvider>
  );
}
