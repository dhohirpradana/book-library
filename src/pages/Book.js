import {
  Autocomplete,
  Paper,
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
import { graphFetch } from "../configs/api";

export default function Book() {
  const [books, setbooks] = useState([]);
  const [filteredBooks, setfilteredBooks] = useState(books);
  const [categories, setcategories] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [inputValue, setInputValue] = React.useState("");

  const filter = (value) => {
    setInputValue(value);
    let filteredBooks = books.filter(function (currentElement) {
      return (
        currentElement.name.toLowerCase().includes(value.toLowerCase()) ||
        currentElement.category.toLowerCase() === value.toLowerCase()
      );
    });
    console.log(filteredBooks);
    setfilteredBooks(filteredBooks);
  };

  useEffect(() => {
    fetchBooks();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBooks = async () => {
    await graphFetch(`{
      books {
        name
        author {
          name
        }
        rack {
          name
        }
        category {
          name
        }
        status
      }
    }`)
      .then((res) => {
        setbooks([]);
        // eslint-disable-next-line array-callback-return
        res.data.books.map((book) => {
          setbooks((old) => [
            ...old,
            createData(
              book.name,
              book.author.name,
              book.rack.name,
              book.category.name,
              book.status
            ),
          ]);
          setfilteredBooks((old) => [
            ...old,
            createData(
              book.name,
              book.author.name,
              book.rack.name,
              book.category.name,
              book.status
            ),
          ]);
        });
        // console.log(books);
      })
      .catch((error) => console.log(error));
  };

  const fetchCategories = async () => {
    await graphFetch(`{
      categories{name}
    }`)
      .then((res) => {
        setcategories([]);
        res.data.categories.map((categorie) =>
          setcategories((old) => [...old, categorie.name])
        );
        // console.log(books);
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
    { id: "author", label: "Author", minWidth: 100 },
    {
      id: "rack",
      label: "Rack",
      minWidth: 170,
    },
    {
      id: "category",
      label: "Category",
      minWidth: 170,
    },
    {
      id: "status",
      label: "Status",
      minWidth: 170,
    },
  ];

  function createData(name, author, rack, category, status) {
    return {
      name: name,
      author: author,
      rack: rack,
      category: category,
      status: status,
    };
  }

  return (
    <div>
      <Autocomplete
        size="small"
        disablePortal
        id="input-search"
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          filter(newInputValue);
        }}
        options={[...categories, ...books.map((book) => book.name)]}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Search" />}
      />
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
              {filteredBooks
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, i) => {
                  // console.log(books);
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
          count={books.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
