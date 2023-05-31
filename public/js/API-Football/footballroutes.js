fetch("https://v3.football.api-sports.io/standings?league=39&season=2019", {
  method: "GET",
  headers: {
    "x-rapidapi-host": "v3.football.api-sports.io",
    "x-rapidapi-key": "9bc65e77a74fe61fdbe484513209802e",
  },
})
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log(data.response[0].league.standings[0]);
  })
  .catch((err) => {
    console.log(err);
  });
