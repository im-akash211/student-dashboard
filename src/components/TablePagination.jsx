import React from 'react';
import { TablePagination } from '@mui/material';

const TablePaginationComponent = ({ count, rowsPerPage, page, onPageChange, onRowsPerPageChange }) => (
  <TablePagination
    rowsPerPageOptions={[5, 10, 25]}
    component="div"
    count={count}
    rowsPerPage={rowsPerPage}
    page={page}
    onPageChange={onPageChange}
    onRowsPerPageChange={onRowsPerPageChange}
  />
);

export default TablePaginationComponent;
