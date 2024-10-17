const Users = () => {
  const urlSearchQuery = new URLSearchParams(location.search);
  const id = urlSearchQuery.get("id");
  return (
    <div>{id}</div>
  )
};

export default Users;