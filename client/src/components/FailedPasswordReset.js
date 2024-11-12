import * as React from 'react';
import Typography from '@mui/material/Typography';


export default function FailedPasswordReset(props) {

  React.useEffect(() => {
    props.setSubmitted(false)
  });
    return (

        <div>
            <Typography
                component="h1"
                variant="h4"
                sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', textAlign: 'center' }}
              >
                Passwortänderung fehlgeschlagen!
              </Typography>
              <Typography
                component="div"
                sx={{ width: '100%', textAlign: 'center', "marginBottom": "1.5rem", "marginTop": "0.5rem" }}
              >
                Falls dieser Fehler mehrfach auftritt, wende dich bitte an it@gatrobe.de!
              </Typography>
            </div>
    );
}
