import {
  Alert,
  Button,
  FormControl,
  FormHelperText,
  Paper,
  Stack,
  TextField,
} from "@mui/material";
import React, { useContext, useRef, useState } from "react";
import { graphRequest } from "../../configs/api";
import { UserContext } from "../../contexts/user";

export default function Login() {
  const [userContext, userDispatch] = useContext(UserContext);
  const [error, seterror] = useState("");
  const loginReff = useRef();

  const handleLogin = () => {
    seterror(null);
    graphRequest(
      `mutation($input: LoginInput) {
    login(input: $input) {
      token
      user {
        id
        firstName
        lastName
        phoneNumber
        verify
        role
        email
      }
    }
  }`,
      {
        input: {
          email: loginReff.current.email.value,
          password: loginReff.current.password.value,
        },
      }
    ).then((res) => {
      if (!res.data.login) {
        seterror("Invalid email or password!");
        return userDispatch({
          type: "AUTH_ERROR",
        });
      }
      let payload = res.data.login;
      console.log(res.data.login.user.role);
      userDispatch({
        type: "AUTH_SUCCESS",
        payload,
      });
      // window.location.reload();
    });
  };

  return (
    <Paper sx={{ p: 2 }} elevation={3}>
      <form ref={loginReff}>
        {error ? (
          <Alert sx={{ mb: 3 }} severity="error">
            {error}
          </Alert>
        ) : (
          <></>
        )}
        <Stack>
          <FormControl sx={{ mb: 1 }}>
            <TextField id="email" label="Email" defaultValue="" />
            <FormHelperText id="my-helper-text">
              We'll never share your email.
            </FormHelperText>
          </FormControl>
          <FormControl sx={{ mb: 3 }}>
            <TextField
              id="password"
              label="Password"
              type="password"
              defaultValue=""
            />
            <FormHelperText id="my-helper-text"></FormHelperText>
          </FormControl>
          <Button variant="contained" onClick={handleLogin}>
            Login
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}
