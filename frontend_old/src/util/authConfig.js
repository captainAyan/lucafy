export default function authConfig(token) {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}
