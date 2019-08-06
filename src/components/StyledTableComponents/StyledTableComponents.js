import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Typography, Card, Select, MenuItem, Button } from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';
import { TableCell, TableRow } from '@material-ui/core';

export const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  body: {
    fontSize: 14
  }
}))(TableCell);

export const StyledTableRow = withStyles(theme => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default
    }
  }
}))(TableRow);