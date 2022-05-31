import {
  Autocomplete,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { graphRequest } from "../configs/api";
import prettyDate from "../constants/prettyDate";

export default function Member() {
  const [users, setusers] = useState([]);
  const [filteredUsers, setfilteredUsers] = useState(users);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [inputValue, setInputValue] = React.useState("");

  const filter = (value) => {
    setInputValue(value);
    let filterred = users.filter(function (currentElement) {
      return currentElement.name.toLowerCase().includes(value.toLowerCase());
    });
    setfilteredUsers(filterred);
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = async () => {
    await graphRequest(`{
      users {
        id
        firstName
        lastName
        email
        phoneNumber
        createdAt
      }
    }`)
      .then((res) => {
        setusers([]);
        // eslint-disable-next-line array-callback-return
        res.data.users.map((user) => {
          let name = user.firstName + " " + user.lastName;
          let joined = prettyDate(user.createdAt);
          setusers((old) => [
            ...old,
            createData(name, user.email, user.phoneNumber, joined),
          ]);
          setfilteredUsers((old) => [
            ...old,
            createData(name, user.email, user.phoneNumber, joined),
          ]);
        });
        // console.log(users);
      })
      .catch((error) => console.log(error));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const columns = [
    { id: "name", label: "Name", minWidth: 170 },
    { id: "email", label: "Email", minWidth: 100 },
    {
      id: "phoneNumber",
      label: "Phone",
      minWidth: 170,
    },
    {
      id: "createdAt",
      label: "Joined At",
      minWidth: 170,
    },
  ];

  function createData(name, email, phone, createdAt) {
    return {
      name: name,
      email: email,
      phoneNumber: phone,
      createdAt: createdAt,
    };
  }

  return (
    <div>
      <Stack
        mb={{ xs: 2, sm: 2, md: 2 }}
        direction={{ xs: "column", sm: "column", md: "column", lg: "row" }}
        spacing="auto"
      >
        <Autocomplete
          freeSolo
          size="small"
          disablePortal
          id="input-search"
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            filter(newInputValue);
          }}
          options={users.map((user) => user.name)}
          sx={{ width: "30vw", pb: 2 }}
          renderInput={(params) => <TextField {...params} label="Search" />}
        />
      </Stack>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, i) => {
                  // console.log(users);
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={i}>
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.format && typeof value === "number"
                              ? column.format(value)
                              : value}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
