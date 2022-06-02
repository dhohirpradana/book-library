import { Autocomplete, Button, Paper, Stack, TextField } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { graphRequest } from "../configs/api";
import { useNavigate } from "react-router-dom";
import CollapsibleTable from "../components/CollapsibleTable";
import { UserContext } from "../contexts/user";

export default function Book() {
  // eslint-disable-next-line no-unused-vars
  const [userContext, userDispatch] = useContext(UserContext);
  const [books, setbooks] = useState([]);
  const [filteredBooks, setfilteredBooks] = useState([]);
  const [categories, setcategories] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();

  const filter = (value) => {
    setInputValue(value);
    let filteredBooks = books.filter(function (currentElement) {
      return (
        currentElement.name.toLowerCase().includes(value.toLowerCase()) ||
        currentElement.category.toLowerCase().includes(value.toLowerCase())
      );
    });
    // console.log(filteredBooks);
    setfilteredBooks(filteredBooks);
  };

  useEffect(() => {
    fetchBooks();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchBooks = () => {
    setbooks([]);
    setfilteredBooks([]);
    graphRequest(`{
      books {
        id
        code
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
        description
        status
      }
    }`)
      .then((res) => {
        // eslint-disable-next-line array-callback-return
        res.data.books.map((book) => {
          setbooks((old) => [
            ...old,
            createData(
              book.id,
              book.code,
              book.name,
              book.author.name,
              book.rack.name,
              book.category.name,
              book.status,
              book.description
            ),
          ]);
          setfilteredBooks((old) => [
            ...old,
            createData(
              book.id,
              book.code,
              book.name,
              book.author.name,
              book.rack.name,
              book.category.name,
              book.status,
              book.description
            ),
          ]);
        });
        // console.log(books);
      })
      .catch((error) => console.log(error));
  };

  const fetchCategories = () => {
    graphRequest(`{
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

  function createData(
    id,
    code,
    name,
    author,
    rack,
    category,
    status,
    description
  ) {
    return {
      id,
      code,
      name,
      author,
      rack,
      category,
      status,
      description,
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
          // , ...books.map((book) => book.name)
          options={[...categories]}
          sx={{ width: "30vw", pb: 2 }}
          renderInput={(params) => <TextField {...params} label="Search" />}
        />
        {userContext.user.role === "STAFF" ||
        userContext.user.role === "ADMIN" ? (
          <Button
            variant="contained"
            sx={{ height: "40px", width: "120px" }}
            onClick={() => navigate("/book/add")}
          >
            Add Book
          </Button>
        ) : (
          <></>
        )}
      </Stack>

      <Paper sx={{ width: "68vw", overflow: "hidden" }}>
        <CollapsibleTable books={filteredBooks} />
      </Paper>
    </div>
  );
}
