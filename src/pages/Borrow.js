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

  const approveOrder = (borrowId) => {
    graphRequest(
      `
    mutation($id:String!, $input: UpdateOrderInput!) {
      updateOrder(id:$id, input:$input) {
        id
        status
      }
    }
    `,
      { id: borrowId, input: { status: "APPROVED" } }
    ).then((res) => {
      fetchBorrows();
      alert("Order Approved");
    });
  };

  const fetchBorrows = () => {
    setborrows([]);
    graphRequest(`
    query($where: BorrowFilter) {
      borrows(where: $where, limit: 5000) {
        id
        status
        book {
          id
          name
          status
        }
        user{
          firstName
          lastName
        }
        pinaltyDays
        penalties
        dateStart
        dueDate
      }
    }
    `).then((res) => {
      console.log(res.data);
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
    const [open, setOpen] = React.useState(false);

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
                    <Typography gutterBottom>{row.pinaltyDays}</Typography>
                  </Stack>
                  <Stack direction="column">
                    <Typography gutterBottom>Penalties</Typography>
                    <Typography gutterBottom>{row.penalties}</Typography>
                  </Stack>
                </Stack>
                <Button
                  // disabled={
                  //   row.status === "APPROVED" || row.bookStatus !== "AVAILABLE"
                  // }
                  variant="contained"
                  size="small"
                  // onClick={() => approveOrder(row.id)}
                >
                  Received
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
        freeSolo
        size="small"
        disablePortal
        id="input-search"
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          filter(newInputValue);
        }}
        options={[
          ...borrows.map((borrow) => borrow.book),
          ...borrows.map((borrow) => borrow.user),
          ...borrows.map((borrow) => borrow.id),
        ]}
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
