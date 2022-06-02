import { Autocomplete, Button, Stack, TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { graphRequest } from "../configs/api";

export default function BookAdd() {
  const [categories, setcategories] = useState([]);
  const [racks, setracks] = useState([]);
  const [authors, setauthors] = useState([]);
  const [categoryId, setcategoryId] = useState("");
  const [rackId, setrackId] = useState("");
  const [authorId, setauthorId] = useState("");
  const ref = useRef();

  const createBook = () => {
    console.log(categoryId, rackId, authorId, ref.current.name.value);
    graphRequest(
      `mutation($input: CreateBookInput!) {
      createBook(input: $input) {
        name
        description
        category {
          id
        }
        rack {
          id
        }
        author {
          id
        }
      }
    }
    `,
      {
        input: {
          name: ref.current.name.value,
          description: ref.current.desc.value,
          categoryId: categoryId,
          rackId: rackId,
          authorId: authorId,
        },
      }
    ).then((res) => {
      alert("Created " + res.data.createBook.name);
      ref.current.name.value = "";
    });
  };

  const fetchCategories = () => {
    graphRequest(`{
      categories {
        id
        name
      }
    }
    `).then((res) => setcategories(res.data.categories));
  };
  const fetchRacks = () => {
    graphRequest(`{
    racks {
      id
      name
    }
  }
  `).then((res) => setracks(res.data.racks));
  };
  const fetchAuthors = () => {
    graphRequest(`{
      authors {
        id
        name
      }
    }
    `).then((res) => setauthors(res.data.authors));
  };

  useEffect(() => {
    fetchCategories();
    fetchRacks();
    fetchAuthors();
  }, []);

  return (
    <div>
      <form ref={ref}>
        <Stack spacing={2}>
          <TextField required id="name" label="Name" defaultValue="" />
          <TextField id="desc" label="Description" defaultValue="" />
          <Autocomplete
            id="category"
            options={categories}
            getOptionLabel={(option) => option.name}
            style={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="Category" variant="outlined" />
            )}
            onChange={(event, newValue) => {
              setcategoryId(newValue.id);
            }}
          />
          <Autocomplete
            id="category"
            options={racks}
            getOptionLabel={(option) => option.name}
            style={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="Rack" variant="outlined" />
            )}
            onChange={(event, newValue) => {
              setrackId(newValue.id);
            }}
          />
          <Autocomplete
            id="author"
            options={authors}
            getOptionLabel={(option) => option.name}
            style={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="Author" variant="outlined" />
            )}
            onChange={(event, newValue) => {
              setauthorId(newValue.id);
            }}
          />
          <Button
            variant="contained"
            size="medium"
            disabled={
              categoryId === "" ||
              rackId === "" ||
              authorId === "" ||
              ref.current.name.value === ""
            }
            onClick={createBook}
          >
            Add
          </Button>
        </Stack>
      </form>
    </div>
  );
}
