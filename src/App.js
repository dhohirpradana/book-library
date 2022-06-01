import React, { useContext, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Navigation } from "react-minimal-side-navigation";
import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import { Box, Stack } from "@mui/material";
import Book from "./pages/Book";
import { graphRequest, setAuthToken } from "./configs/api";
import { UserContext } from "./contexts/user";
import Auth from "./pages/Auth";
import BookAdd from "./pages/BookAdd";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import ListIcon from "@mui/icons-material/List";
import BookDetail from "./pages/BookDetail";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [itemId, setitemId] = useState("/book/books");
  // eslint-disable-next-line no-unused-vars
  const [userContext, userDispatch] = useContext(UserContext);

  const checkUser = async () => {
    await graphRequest(`{
      user {
        id
        firstName
        lastName
        email
        phoneNumber
        createdAt
      }
    }`)
      .then((response) => {
        let payload = response.data;
        payload.token = localStorage.token;

        userDispatch({
          type: "AUTH_SUCCESS",
          payload,
        });
      })
      .catch((error) => {
        userDispatch({
          type: "AUTH_ERROR",
        });
        console.log(error);
      });
  };

  useEffect(() => {
    if (localStorage.token) {
      checkUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Stack direction="row" height="100vh" sx={{ backgroundColor: "#fffff0" }}>
        <Box width={{ sm: "37%", md: "20%" }}>
          <Navigation
            // you can use your own router's api to get pathname
            activeItemId="/book/books"
            onSelect={({ itemId }) => {
              setitemId(itemId);
              navigate(itemId);
            }}
            items={[
              {
                title: "Book",
                itemId: "/book/books",
                subNav: userContext.user.role === "STAFF" && [
                  {
                    title: "Books",
                    itemId: "/book/books",
                  },
                  {
                    title: "Borrows",
                    itemId: "/book/borrows",
                  },
                  {
                    title: "Orders",
                    itemId: "/book/order",
                  },
                  {
                    title: "Pinalties",
                    itemId: "/book/pinalties",
                  },
                ],
                elemBefore: () => <LibraryBooksIcon />,
              },
              {
                title: "Author",
                itemId: "/author",
                elemBefore: () => <ContactPageIcon />,
              },
              {
                title: "Category",
                itemId: "/category",
                elemBefore: () => <ListIcon />,
              },
              {
                title: "Account",
                itemId: "/account",
                elemBefore: () => <AccountCircleIcon />,
              },
            ]}
          />
        </Box>
        <Box mx="auto" my={4}>
          <Routes>
            <Route exact path="/" element={<Book />} />
            {/* <Route exact path="/books" element={<Book />} /> */}
            <Route exact path="/book/books" element={<Book />} />
            {/* <Route exact path="/member" element={<Member />} /> */}
            <Route exact path="/account" element={<Auth />} />
            <Route exact path="/book/add" element={<BookAdd />} />
            <Route exact path="/book/:id" element={<BookDetail />} />
            {/* <Route
              exact
              path="/book-add"
              element={
                userContext.user.role === "admin" ? <BookAdd /> : <Home />
              }
            />
            <Route exact path="/book-detail/:id" element={<BookDetail />} />
            <Route element={<PrivateRoute />}>
              <Route exact path="/profile" element={<Profile />} />
              <Route exact path="/cart" element={<Cart />} />
              <Route exact path="/about" element={<About />} />
              <Route exact path="/complain" element={<Complain />} />
            </Route> */}
          </Routes>
        </Box>
      </Stack>
    </>
  );
}

export default App;
