import * as React from 'react';
import Typography from '@mui/material/Typography';


export default function SuccessfullPasswordReset(props) {

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
                Passwortänderung erfolgreich!
              </Typography>

            </div>
    );
}
