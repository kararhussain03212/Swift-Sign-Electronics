import axios from "./axios";

export async function getProductComments(params = {}) {
  const { data } = await axios.get("/admin/product-comments", { params });
  return data;
}

export async function deleteProductComment(id) {
  const { data } = await axios.delete(`/admin/product-comments/${id}`);
  return data;
}
