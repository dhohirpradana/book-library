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
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Box } from "@mui/system";

export default function Borrow() {
  const [borrows, setborrows] = useState([]);
  // const [page, setpage] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [filteredBorrows, setfilteredBorrows] = useState([]);

  const filter = (value) => {
    setInputValue(value);
    let filteredBorrows = borrows.filter(function (currentElement) {
      return (
        currentElement.book.toLowerCase().includes(value.toLowerCase()) ||
        currentElement.user.toLowerCase().includes(value.toLowerCase())
      );
    });
    // console.log(filteredBooks);
    setfilteredBorrows(filteredBorrows);
  };

  const receiveBook = (
    borrowId,
    status,
    pinaltyDays,
    penalties,
    returnDate
  ) => {
    graphRequest(
      `mutation($input: UpdateBorrowInput!, $id: String!) {
        updateBorrow(input: $input, id: $id) {
          status
          returnDate
          book {
            id
            status
          }
        }
      }
      
    `,
      {
        id: borrowId,
        input: {
          status,
          pinaltyDays,
          penalties,
          returnDate,
        },
      }
    ).then((res) => {
      // fetchBorrows();
      console.log(res.data);
      window.location.reload();
      alert("Book Received\nStatus: " + status);
    });
  };

  const fetchBorrows = () => {
    setborrows([]);
    graphRequest(
      `
    query($where: BorrowFilter, $orderBy: BorrowOrderBy) {
      borrows(where: $where, limit: 5000, orderBy: $orderBy) {
        id
        status
        book {
          id
          name
          status
        }
        user {
          firstName
          lastName
        }
        pinaltyDays
        penalties
        dateStart
        dueDate
      }
    }
    `,
      { orderBy: "createdAt_DESC", where: { status: "BORROWED" } }
    ).then((res) => {
      // console.log(res.data);
      // eslint-disable-next-line array-callback-return
      res.data.borrows.map((borrow) => {
        setborrows((old) => [
          ...old,
          createData(
            borrow.id,
            borrow.book.name,
            borrow.book.id,
            borrow.user.firstName + " " + borrow.user.lastName,
            borrow.status,
            borrow.pinaltyDays,
            borrow.penalties,
            prettyDate(borrow.dateStart),
            prettyDate(borrow.dueDate)
          ),
        ]);
        setfilteredBorrows((old) => [
          ...old,
          createData(
            borrow.id,
            borrow.book.name,
            borrow.book.id,
            borrow.user.firstName + " " + borrow.user.lastName,
            borrow.status,
            borrow.pinaltyDays,
            borrow.penalties,
            prettyDate(borrow.dateStart),
            prettyDate(borrow.dueDate)
          ),
        ]);
      });
    });
  };

  const createData = (
    id,
    book,
    bookId,
    user,
    status,
    pinaltyDays,
    penalties,
    dateStart,
    dueDate
  ) => {
    return {
      id,
      book,
      bookId,
      user,
      status,
      pinaltyDays,
      penalties,
      dateStart,
      dueDate,
    };
  };

  useState(() => {
    fetchBorrows();
  }, []);

  function Row(props) {
    const { row } = props;
    const [open, setOpen] = useState(false);

    const date1 = new Date(row.dueDate);
    const date2 = new Date();
    const diffTime = date2.getDate() - date1.getDate();

    let pinaltyDays = diffTime > 0 ? diffTime : 0;
    let penalties = diffTime > 0 ? diffTime * 5000 : 0;

    return (
      <React.Fragment>
        <TableRow sx={{ "& > *": { bborrowBottom: "unset" } }}>
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
          {/* <TableCell>{row.pinaltyDays ?? "none"}</TableCell>
          <TableCell>{row.penalties ?? "none"}</TableCell> */}
          <TableCell>{row.dateStart}</TableCell>
          <TableCell>{row.dueDate}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Stack mb={2} direction="row" spacing={3}>
                  <Stack direction="column">
                    <Typography gutterBottom>Pinalty Days</Typography>
                    <Typography gutterBottom>{pinaltyDays}</Typography>
                  </Stack>
                  <Stack direction="column">
                    <Typography gutterBottom>Penalties</Typography>
                    <Typography gutterBottom>{penalties}</Typography>
                  </Stack>
                </Stack>
                <Button
                  // disabled={
                  //   row.status === "OVER_DUE" || row.status === "ON_TIME"
                  // }
                  variant="contained"
                  size="small"
                  onClick={() => {
                    receiveBook(
                      row.id,
                      pinaltyDays === 0 ? "ON_TIME" : "OVER_DUE",
                      pinaltyDays,
                      penalties,
                      new Date()
                    );
                  }}
                >
                  Receive Book
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
      // pinaltyDays: PropTypes.string.isRequired,
      // penalties: PropTypes.string.isRequired,
      dateStart: PropTypes.string.isRequired,
      dueDate: PropTypes.string.isRequired,
    }).isRequired,
  };

  return (
    <>
      <Autocomplete
        groupBy={(option) => option.user}
        freeSolo
        size="small"
        disablePortal
        id="input-search"
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          filter(newInputValue);
        }}
        options={[]}
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
              {/* <TableCell>Pinalty Days</TableCell>
              <TableCell>Penalties</TableCell> */}
              <TableCell>Start</TableCell>
              <TableCell>Due</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBorrows.map((row) => (
              <Row key={row.id} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
