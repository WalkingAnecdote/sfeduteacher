import React from "react";

import { Typography, Link } from "@mui/material";

const Copyright = (props) => {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
        <Link color="inherit" target="_blank" href="https://github.com/WalkingAnecdote/sfeduteacher">
          SFEDU Teacher project
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }

export { Copyright }