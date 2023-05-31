const handleSearch = async () => {
  const searchInput = document.querySelector("input").value;
  console.log(searchInput);
  const response = await fetch(`/api/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  if (response.ok) {
    document.location.replace(`/api/search/`);
  }
};

document.querySelector("button").addEventListener("click", handleSearch);
