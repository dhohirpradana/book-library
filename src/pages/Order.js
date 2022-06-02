import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { graphRequest } from "../configs/api";
import prettyDate from "../constants/prettyDate";
import Paper from "@mui/material/Paper";
import {
  Autocomplete,
  Button,
  Collapse,
  IconButton,
  Modal,
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
import ReactDatePicker from "react-datepicker";

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

  function ApproveOrderModal({ orderId, bookName, startD }) {
    var dateM = !startD
      ? new Date()
      : new Date(startD) < new Date()
      ? new Date()
      : new Date(startD);
    // dateM.setDate(dateM.getDate() + 1);
    const [open, setOpen] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [dueDate, setDueDate] = useState(null);

    const approveOrder = () => {
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
        // fetchOrders();
        window.location.reload();
        alert("Order Approved");
      });
      setOpen(false);
    };

    const style = {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 400,
      bgcolor: "white",
      borderRadius: 2,
      // boxShadow: 24,
      boxShadow: "0px 2px 30px 0px rgba(0,0,0,0.75)",
      pt: 2,
      px: 4,
      pb: 3,
    };

    const handleOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };

    return (
      <Fragment>
        <Button size="small" variant="contained" onClick={handleOpen}>
          Approve Order
        </Button>
        <Modal
          hideBackdrop
          open={open}
          onClose={handleClose}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
        >
          <Box sx={{ ...style }}>
            <h2 id="child-modal-title">Approve Order</h2>
            <Typography gutterBottom>{bookName}</Typography>
            <Stack direction="row" spacing="auto">
              <Stack mb={2}>
                <Typography>Start Date</Typography>
                <ReactDatePicker
                  selected={startDate}
                  minDate={dateM}
                  onSelect={(date: Date) => {
                    setStartDate(date);
                  }}
                />
              </Stack>
              <Stack>
                <Typography>Due Date</Typography>
                <ReactDatePicker
                  selected={dueDate}
                  minDate={dateM}
                  onSelect={(date: Date) => setDueDate(date)}
                />
              </Stack>
            </Stack>
            <Stack direction="row"></Stack>
            <Button
              sx={{ mr: 3 }}
              variant="contained"
              color="error"
              size="small"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              disabled={!startDate || !dueDate}
              variant="contained"
              color="success"
              size="small"
              onClick={approveOrder}
            >
              Approve Order
            </Button>
          </Box>
        </Modal>
      </Fragment>
    );
  }

  const fetchOrders = () => {
    setorders([]);
    graphRequest(
      `query($where: OrderFilter){
      orders(where: $where, limit: 5000, skip: 0) {
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
    `,
      { where: { status: "PENDING" } }
    ).then((res) => {
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
    const [open, setOpen] = useState(false);

    return (
      <Fragment>
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
                <ApproveOrderModal orderId={row.id} startD={row.dateStart} />
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </Fragment>
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
