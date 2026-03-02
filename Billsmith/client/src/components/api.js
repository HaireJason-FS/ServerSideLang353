import axios from "axios";

export async function apiGet(path, params = {}) {
  const res = await axios.get(path, { params });
  return res.data;
}