import React, { useState } from "react";

import { Navigation } from "react-minimal-side-navigation";
import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";
import EmailIcon from "@mui/icons-material/Email";
import { Box, Stack } from "@mui/material";
import Book from "./pages/Book";

function App() {
  const [itemId, setitemId] = useState("/dashboard");
  return (
    <>
      <Stack direction="row" height="100vh" sx={{ backgroundColor: "#fffff0" }}>
        <Box width={{ sm: "37%", md: "20%" }}>
          <Navigation
            // you can use your own router's api to get pathname
            activeItemId="/dashboard"
            onSelect={({ itemId }) => {
              console.log(itemId);
              setitemId(itemId);
            }}
            items={[
              {
                title: "Dashboard",
                itemId: "/dashboard",
                // you can use your own custom Icon component as well
                // icon is optional
                elemBefore: () => <EmailIcon />,
              },
              {
                title: "Management",
                itemId: "/management",
                elemBefore: () => <EmailIcon />,
                subNav: [
                  {
                    title: "Projects",
                    itemId: "/management/projects",
                  },
                  {
                    title: "Members",
                    itemId: "/management/members",
                  },
                ],
              },
              {
                title: "Another Item",
                itemId: "/another",
                subNav: [
                  {
                    title: "Teams",
                    itemId: "/management/teams",
                  },
                ],
              },
            ]}
          />
        </Box>
        <Box mx="auto" my={4}>
          {itemId === "/dashboard" ? <Book /> : <></>}
        </Box>
      </Stack>
    </>
  );
}

export default App;
