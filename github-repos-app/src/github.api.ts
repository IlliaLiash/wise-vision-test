import axios from 'axios';
import { TGithubGetReposParams } from './types';

const githubApi = axios.create({
  baseURL: import.meta.env.VITE_GITHUB_API,
});

const getRepos = async (queryParams: TGithubGetReposParams) => {
  const { query, page, per_page } = queryParams;

  const url = `/search/repositories?q=${query}&page=${page}&per_page=${per_page}`;

  const response = await githubApi.get(url);

  return response.data;
};

export { getRepos };
