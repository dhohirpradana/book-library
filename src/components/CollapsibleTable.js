import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { graphRequest } from "../configs/api";
import prettyDate from "../constants/prettyDate";
import { Button, Modal, Stack } from "@mui/material";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function CollapsibleTable({ books }) {
  const [orders, setorders] = React.useState([]);

  const fetchOrders = () => {
    graphRequest(
      `query($where: OrderFilter) {
      orders(where: $where) {
        id
        status
        book {
          id
          name
        }
        dateStart
        dueDate
      }
    }`
    )
      .then((res) => {
        setorders([]);
        setorders(res.data.orders);
        console.log(res.data);
      })
      .catch((error) => console.log(error));
  };

  const filter = (bookId) => {
    let filteredOrders = orders.filter(function (currentElement) {
      return (
        currentElement.book.id === bookId &&
        new Date(currentElement.dueDate).getTime() > new Date().getTime()
      );
    });
    return filteredOrders;
  };

  function OrderModal() {
    const style = {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: 400,
      bgcolor: "background.paper",
      boxShadow: 24,
      pt: 2,
      px: 4,
      pb: 3,
    };
    const [open, setOpen] = React.useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const handleOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };

    return (
      <React.Fragment>
        <Button size="small" variant="contained" onClick={handleOpen}>
          Order
        </Button>
        <Modal
          hideBackdrop
          open={open}
          onClose={handleClose}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
        >
          <Box sx={{ ...style, width: 200 }}>
            <h2 id="child-modal-title">Order Book</h2>
            <ReactDatePicker
              selected={startDate}
              minDate={new Date()}
              onSelect={(date: Date) => setStartDate(date)}
            />
            <Button onClick={handleClose}>Close Child Modal</Button>
          </Box>
        </Modal>
      </React.Fragment>
    );
  }

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
          <TableCell component="th" scope="row">
            {row.name}
          </TableCell>
          <TableCell>{row.rack}</TableCell>
          <TableCell>{row.category}</TableCell>
          <TableCell>{row.author}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography
                  variant="h5"
                  gutterBottom
                  component="div"
                  color={row.status === "AVAILABLE" ? "green" : "orange"}
                >
                  {row.status}
                </Typography>
                <Typography gutterBottom component="div">
                  {row.code}
                </Typography>
                <Typography gutterBottom component="div">
                  {row.description}
                </Typography>
                <OrderModal />
                {filter(row.id).length === 0 ? (
                  <Typography variant="h6" gutterBottom component="div">
                    No Queue
                  </Typography>
                ) : (
                  <Stack>
                    <Typography variant="h6" gutterBottom component="div">
                      Queue
                    </Typography>
                    <Table size="small" aria-label="orders">
                      <TableHead>
                        <TableRow>
                          <TableCell>Start</TableCell>
                          <TableCell>Due</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {filter(row.id).map((order) => (
                          <TableRow key={order.id}>
                            <TableCell component="th" scope="row">
                              {prettyDate(order.dateStart)}
                            </TableCell>
                            <TableCell>{prettyDate(order.dueDate)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Stack>
                )}
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  }

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  Row.propTypes = {
    row: PropTypes.shape({
      name: PropTypes.string.isRequired,
      rack: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
    }).isRequired,
  };

  return (
    <TableContainer sx={{ width: "100%", maxHeight: "75vh" }} component={Paper}>
      <Table stickyHeader aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Name</TableCell>
            <TableCell>Rack</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Author</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {books.map((book) => (
            <Row key={book.id} row={book} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
