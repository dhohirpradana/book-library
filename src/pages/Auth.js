import {
  Button,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import Login from "../components/Auth/Login";
import { graphRequestHistory } from "../configs/api";
import { UserContext } from "../contexts/user";

export default function Auth() {
  const [orders, setOrders] = useState([]);
  const [borrows, setBorrows] = useState([]);
  const [userContext, userDispatch] = useContext(UserContext);

  const fetchHistory = () => {
    setBorrows([]);
    setOrders([]);
    graphRequestHistory(userContext.user.id).then((res) => {
      setBorrows(res.borrows);
      setOrders(res.orders);
    });
  };

  useEffect(() => {
    if (userContext.user.id) fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userContext.user.id]);

  const handleLogout = () => {
    userDispatch({
      type: "LOGOUT",
    });
  };

  return (
    <div>
      {!userContext.isLogin ? (
        <Login />
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
          <Typography mt={2} mb={2}>
            Order History
          </Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Book Name</TableCell>
                  <TableCell>Start</TableCell>
                  <TableCell>Due</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.book.name}
                    </TableCell>
                    <TableCell>{row.dateStart}</TableCell>
                    <TableCell>{row.dueDate}</TableCell>
                    <TableCell>{row.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Typography mt={2} mb={2}>
            Borrow History
          </Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Book Name</TableCell>
                  <TableCell>Start</TableCell>
                  <TableCell>Due</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {borrows.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.book.name}
                    </TableCell>
                    <TableCell>{row.dateStart}</TableCell>
                    <TableCell>{row.dueDate}</TableCell>
                    <TableCell>{row.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      )}
    </div>
  );
}
