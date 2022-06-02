import { Fragment, useContext, useEffect, useState } from "react";
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
import { UserContext } from "../contexts/user";
import orderValidation from "../helpers/orderValidation";

export default function CollapsibleTable({ books }) {
  // eslint-disable-next-line no-unused-vars
  const [userContext, userDispatch] = useContext(UserContext);

  function OrderModal({ bookId, bookName, startD, status }) {
    var dateM = !startD ? new Date() : new Date(startD.dueDate);
    dateM.setDate(dateM.getDate() + 1);

    const [open, setOpen] = useState(false);
    const [startDate, setStartDate] = useState(dateM);
    const [dueDate, setDueDate] = useState(dateM);

    useEffect(() => {}, []);

    const orderBook = () => {
      orderValidation(userContext.user.id, startDate, dueDate, bookId);
    };
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

    const handleOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };

    return (
      <Fragment>
        <Button
          disabled={status === "BORROWED"}
          size="small"
          variant="contained"
          onClick={handleOpen}
        >
          Order
        </Button>
        <Modal
          hideBackdrop
          open={open}
          onClose={handleClose}
          aria-labelledby="child-modal-title"
          aria-describedby="child-modal-description"
        >
          <Box sx={{ ...style }}>
            <h2 id="child-modal-title">Order Book</h2>
            <Typography gutterBottom>{bookName}</Typography>
            <Stack direction="row" spacing="auto">
              <Stack mb={2}>
                <Typography>Start Date</Typography>
                <ReactDatePicker
                  selected={startDate}
                  minDate={dateM}
                  onSelect={(date: Date) => {
                    setStartDate(date);
                    setDueDate(date);
                  }}
                />
              </Stack>
              <Stack>
                <Typography>Due Date</Typography>
                <ReactDatePicker
                  selected={dueDate}
                  minDate={startDate}
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
              variant="contained"
              color="success"
              size="small"
              onClick={orderBook}
            >
              Order
            </Button>
          </Box>
        </Modal>
      </Fragment>
    );
  }

  function Row(props) {
    const { row } = props;
    const [open, setOpen] = useState(false);
    const [orders, setOrders] = useState([]);
    const ordersByBookId = () => {
      graphRequest(
        `query($where: OrderFilter) {
        orders(where: $where) {
          id
          user {
            firstName
          }
          book {
            name
          }
          status
          dateStart
          dueDate
        }
      }`,
        {
          where: {
            bookId: row.id,
            dueDate_gte: new Date(),
          },
        }
      ).then((res) => {
        console.log(row.id);
        console.log(res.data);
        setOrders(res.data.orders);
      });
    };

    return (
      <Fragment>
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell>
            {!userContext.isLogin ? (
              <></>
            ) : (
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => {
                  setOpen(!open);
                  if (!open) ordersByBookId(row.id);
                }}
              >
                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            )}
          </TableCell>
          <TableCell component="th" scope="row">
            {row.name}
          </TableCell>
          <TableCell>{row.rack}</TableCell>
          <TableCell>{row.category}</TableCell>
          <TableCell>{row.author}</TableCell>
        </TableRow>
        {!userContext.isLogin ? (
          <></>
        ) : (
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
                  {userContext.user.role === "AUTHENTICATED" ? (
                    <OrderModal
                      bookId={row.id}
                      status={row.status}
                      bookName={row.name}
                      startD={!orders.length ? null : orders[orders.length - 1]}
                    />
                  ) : (
                    <></>
                  )}

                  {orders.length === 0 ? (
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
                          {orders.map((order) => (
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
        )}
      </Fragment>
    );
  }

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
