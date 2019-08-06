import React from 'react';
import { Typography, Box } from '@material-ui/core';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}>
      <Box style={{ padding: '20px 5px' }}>{children}</Box>
    </Typography>
  );
}

export default TabPanel;
