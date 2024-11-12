import * as React from 'react';
import Typography from '@mui/material/Typography';

import { Box, Button, FormControl, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function EnterEmail(props) {

    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    const navigate = useNavigate();


    
    const validateInputs = () => {
        const email = document.getElementById('email');

        let isValid = true;
    
        if (!email.value ) {
          setEmailError(true);
          setEmailErrorMessage('Es wird eine valide Email-Adresse benötigt.');
          isValid = false;
        } else {
          setEmailError(false);
          setEmailErrorMessage('');
        }
    
        return isValid;
      };
    
      const handleSubmit = (event) => {
        if (!validateInputs()) {
          event.preventDefault();
          return
        }
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        if (props.submitted) {
          return
        }
        props.setSubmitted(true)
    
        fetch("/requestChange/",
          {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({
              email: data.get('email'),
            })
          }).then((res) => {
            if (!res.ok) {
              throw Error()
            }
          })
          .then(function (res) {
            navigate('/mailsuccessfull')
          })
          .catch(function (res) {
            navigate('/mailsuccessfull')
          })
      };
    return (

        <div>
            <Typography
                component="h1"
                variant="h4"
                sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', textAlign: 'center' }}
              >
                Passwort zurücksetzen?
              </Typography>
              <Typography
                component="div"
                sx={{ width: '100%', textAlign: 'center', "marginBottom": "1.5rem", "marginTop": "0.5rem" }}
              >
                Um dein Passwort zurückzusetzen gib deine Email ein
              </Typography>

              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
              >
                <FormControl>

                  <TextField
                    required
                    fullWidth
                    id="email"
                    placeholder="Deine Email Adresse"
                    name="email"
                    autoComplete="email"
                    variant="outlined"
                    error={emailError}
                    helperText={emailErrorMessage}
                    color={emailError ? 'error' : 'primary'}
                  />
                </FormControl>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  onClick={validateInputs}
                >
                  Email Senden
                </Button>

              </Box>
            </div>
    );
}
