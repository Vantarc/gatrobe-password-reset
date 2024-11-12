import * as React from 'react';
import Typography from '@mui/material/Typography';

import { Box, Button, FormControl, FormLabel, TextField } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import IconButton from '@mui/material/IconButton'
import InputAdornment from "@mui/material/InputAdornment";
import { useNavigate } from 'react-router-dom';

export default function EnterNewPassword(props) {

  const [showPassword, setShowPassword] = React.useState(false);
  const [showPassword1, setShowPassword1] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowPassword1 = () => setShowPassword1((show) => !show);

  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');

  const [passwordError1, setPasswordError1] = React.useState(false);
  const [passwordErrorMessage1, setPasswordErrorMessage1] = React.useState('');

  const navigate = useNavigate();

  let params = new URL(window.location.toString()).searchParams;

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseDownPassword1 = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword1 = (event) => {
    event.preventDefault();
  };

  const validateInputs = () => {
    const password = document.getElementById('password');
    const password1 = document.getElementById('password-confirm');

    let isValid = true;
    if (!password.value || password.value.length < 8) {
      setPasswordError(true);
      setPasswordErrorMessage('Das Passwort muss mindestens 8 Zeichen lang sein.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    if (password.value !== password1.value) {
      setPasswordError1(true)
      setPasswordErrorMessage1('Die Passwörter stimmen nicht überein')
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');

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

    fetch(`/changepassword?sessionID=${params.get("sessionID")}`,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({
          password: data.get('password'),
        })
      }).then((res) => {
        if (!res.ok) {
          throw Error()
        }
      })
      .then(function (res) {
        navigate('/passwordchangesuccessfull')
      })
      .catch(function (res) {
        console.log(res)
        navigate('/passwordchangefailed')
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
        Bitte gib ein neues Passwort an!
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <FormControl>
          <FormLabel htmlFor="name">Passwort</FormLabel>

          <TextField
            required
            fullWidth
            name="password"
            placeholder="••••••••"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="new-password"
            variant="outlined"
            error={passwordError}
            helperText={passwordErrorMessage}
            color={passwordError ? 'error' : 'primary'}
            slotProps={{
              input: {
                endAdornment:
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword ? 'hide the password' : 'display the password'
                      }
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      onMouseUp={handleMouseUpPassword}
                      edge="end"
                      style={{ border: "none", backgroundColor: "transparent" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>

              }
            }}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="name">Passwort erneut eingeben</FormLabel>

          <TextField
            required
            fullWidth
            name="password-confirm"
            placeholder="••••••••"
            type={showPassword1 ? 'text' : 'password'}
            id="password-confirm"
            autoComplete="new-password"
            variant="outlined"
            error={passwordError1}
            helperText={passwordErrorMessage1}
            color={'primary'}
            slotProps={{
              input: {
                endAdornment:
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword ? 'hide the password' : 'display the password'
                      }
                      onClick={handleClickShowPassword1}
                      onMouseDown={handleMouseDownPassword1}
                      onMouseUp={handleMouseUpPassword1}
                      edge="end"
                      style={{ border: "none", backgroundColor: "transparent" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>

              }
            }}
          />

        </FormControl>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          onClick={validateInputs}
        >
          Passwort ändern
        </Button>

      </Box>
    </div>
  );
}
