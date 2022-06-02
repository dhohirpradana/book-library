import React, { useState } from "react";
import PropTypes from "prop-types";
import { graphRequest } from "../configs/api";
import prettyDate from "../constants/prettyDate";
import Paper from "@mui/material/Paper";
import {
  Autocomplete,
  Button,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Box } from "@mui/system";

export default function Order() {
  const [orders, setorders] = useState([]);
  // const [page, setpage] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [filteredOrders, setfilteredOrders] = useState([]);

  const filter = (value) => {
    setInputValue(value);
    let filteredOrders = orders.filter(function (currentElement) {
      return (
        currentElement.book.toLowerCase().includes(value.toLowerCase()) ||
        currentElement.user.toLowerCase().includes(value.toLowerCase())
      );
    });
    // console.log(filteredBooks);
    setfilteredOrders(filteredOrders);
  };

  const approveOrder = (orderId) => {
    graphRequest(
      `
    mutation($id:String!, $input: UpdateOrderInput!) {
      updateOrder(id:$id, input:$input) {
        id
        status
      }
    }
    `,
      { id: orderId, input: { status: "APPROVED" } }
    ).then((res) => {
      fetchOrders();
      alert("Order Approved");
    });
  };

  const fetchOrders = () => {
    setorders([]);
    graphRequest(`query{
      orders(limit: 5000, skip: 0) {
        id
        user {
          firstName
          lastName
        }
        book {
          name
          code
          status
        }
        status
        dateStart
        dueDate
      }
    }
    `).then((res) => {
      // eslint-disable-next-line array-callback-return
      res.data.orders.map((order) => {
        setorders((old) => [
          ...old,
          createData(
            order.id,
            order.book.name,
            order.book.status,
            order.user.firstName + " " + order.user.lastName,
            order.status,
            prettyDate(order.dateStart),
            prettyDate(order.dueDate)
          ),
        ]);
        setfilteredOrders((old) => [
          ...old,
          createData(
            order.id,
            order.book.name,
            order.book.status,
            order.user.firstName + " " + order.user.lastName,
            order.status,
            prettyDate(order.dateStart),
            prettyDate(order.dueDate)
          ),
        ]);
      });
    });
  };

  const createData = (
    id,
    book,
    bookStatus,
    user,
    status,
    dateStart,
    dueDate
  ) => {
    return { id, book, bookStatus, user, status, dateStart, dueDate };
  };

  useState(() => {
    fetchOrders();
  }, []);

  function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);

    return (
      <React.Fragment>
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell>{row.book}</TableCell>
          <TableCell>{row.user}</TableCell>
          <TableCell>{row.status}</TableCell>
          <TableCell>{row.dateStart}</TableCell>
          <TableCell>{row.dueDate}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Button
                  disabled={
                    row.status === "APPROVED" || row.bookStatus !== "AVAILABLE"
                  }
                  variant="contained"
                  size="small"
                  onClick={() => approveOrder(row.id)}
                >
                  Borrow
                </Button>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  Row.propTypes = {
    row: PropTypes.shape({
      book: PropTypes.string.isRequired,
      user: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      dateStart: PropTypes.string.isRequired,
      dueDate: PropTypes.string.isRequired,
    }).isRequired,
  };

  return (
    <>
      <Autocomplete
        freeSolo
        size="small"
        disablePortal
        id="input-search"
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          filter(newInputValue);
        }}
        options={
          [
            // ...orders.map((order) => order.book),
            // ...orders.map((order) => order.user),
            // ...orders.map((order) => order.id),
          ]
        }
        sx={{ width: "30vw", pb: 2 }}
        renderInput={(params) => <TextField {...params} label="Search" />}
      />
      <TableContainer
        sx={{ width: "68vw", maxHeight: "75vh" }}
        component={Paper}
      >
        <Table stickyHeader aria-label="collapsible table">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Book Name</TableCell>
              <TableCell>User Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Start</TableCell>
              <TableCell>Due</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((row) => (
              <Row key={row.id} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
