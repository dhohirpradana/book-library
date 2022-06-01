import {
  Alert,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useRef, useState } from "react";
import { graphRequest } from "../configs/api";
import { UserContext } from "../contexts/user";

export default function Auth() {
  const loginReff = useRef();
  const [userContext, userDispatch] = useContext(UserContext);
  const [error, seterror] = useState("");

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
      userDispatch({
        type: "AUTH_SUCCESS",
        payload,
      });
    });
  };

  const handleLogout = () => {
    userDispatch({
      type: "LOGOUT",
    });
  };

  useEffect(() => {
    console.log(userContext.user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {!userContext.isLogin ? (
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
      ) : (
        <Stack>
          <Typography gutterBottom>
            {"Name : " +
              userContext.user.firstName +
              " " +
              userContext.user.lastName}
          </Typography>
          <Divider />
          <Typography gutterBottom>
            {"Email  : " + userContext.user.email}
          </Typography>
          <Divider />
          <Typography gutterBottom>
            {"Phone: " + userContext.user.phoneNumber}
          </Typography>
          <Button variant="contained" color="error" onClick={handleLogout}>
            Logout
          </Button>
        </Stack>
      )}
    </div>
  );
}
