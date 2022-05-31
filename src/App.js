import React from "react";

import { Navigation } from "react-minimal-side-navigation";
import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";
import EmailIcon from "@mui/icons-material/Email";
import { Box, Stack, Typography } from "@mui/material";

function App() {
  return (
    <>
      <Stack direction="row" height="100vh">
        <Box width={{ sm: "37%", md: "20%" }}>
          <Navigation
            // you can use your own router's api to get pathname
            activeItemId="/management/members"
            onSelect={({ itemId }) => {
              // maybe push to the route
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
        <Typography m="auto">Hello</Typography>
      </Stack>
    </>
  );
}

export default App;
