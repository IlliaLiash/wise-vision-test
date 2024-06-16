import { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import { IconButton } from '@mui/material';
import { DataGrid, GridPaginationModel } from '@mui/x-data-grid';
import SearchIcon from './public/search-icon.svg?react';
import { getRepos } from './github.api';
import { TGithubRepo, TGridItem } from './types';
import axios from 'axios';
import { gridCols } from './consts';

const App = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [data, setData] = useState<TGridItem[]>([]);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [rowCount, setRowCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    if (isActive) {
      fetchData();
    }
  }, [page]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const response = await getRepos({ query: searchQuery, page: page + 1, per_page: pageSize });

      const data = response.items.map((item: TGithubRepo) => ({
        id: item.id,
        col1: item.name,
        col2: item.owner.login,
        col3: item.html_url,
      }));

      if (data.length) {
        setRowCount(response.total_count);
      }

      setData(data);

      setLoading(false);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.message);
      } else {
        setError('An unexpected error occurred');
      }

      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setError(null);

    setRowCount(0);

    if (page === 0) {
      await fetchData();
    }

    setIsActive(true);

    setPage(0);
  };

  const handlePageChange = (newPage: GridPaginationModel) => {
    setPage(newPage.page);
  };

  return (
    <>
      <div className="flex justify-center mt-4">
        <Paper component="form" sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: '60%' }}>
          <InputBase
            className="ml-1"
            sx={{ flex: 1 }}
            placeholder="Search Repositories"
            inputProps={{ 'aria-label': 'search repositories' }}
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={handleSearch} disabled={!searchQuery}>
            <SearchIcon className="w-4 h-4" />
          </IconButton>
        </Paper>
      </div>
      <div className="flex items-center m-4 flex-col">
        {error && <div className="text-center text-red-500">{error}</div>}
        {!isActive ? null : isActive && !data.length ? (
          <div className="text-center">No data found</div>
        ) : (
          <div className="mt-10 w-4/5">
            <DataGrid
              rows={data}
              columns={gridCols}
              disableColumnMenu
              disableColumnSorting
              disableColumnSelector
              disableMultipleRowSelection
              disableRowSelectionOnClick
              disableColumnResize
              pagination
              paginationMode="server"
              onPaginationModelChange={handlePageChange}
              rowCount={rowCount}
              loading={loading}
              initialState={{
                pagination: { paginationModel: { pageSize, page } },
              }}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default App;
