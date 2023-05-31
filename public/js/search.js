const handleSearch = async () => {
  const searchInput = document.querySelector("input").value;
  console.log(searchInput);
  const response = await fetch(`/api/search?term=${searchInput}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  const data = await response.json();
  console.log(data);
  // if (response.ok) {
  //   document.location.replace(`/api/search/`);
  // }
};

document.querySelector("button").addEventListener("click", handleSearch);
