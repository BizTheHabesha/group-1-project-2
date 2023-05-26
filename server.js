// API-Football Code Snippet with API Key website with documentation: https://www.api-football.com/
// 100 free requests a day.

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

// var myHeaders = new Headers();
// myHeaders.append(
//   "x-rapidapi-key",
//   "27fce6bde4msh7acd7c7b3f1c7fap1ccc0ejsn804991608a10"
// );
// myHeaders.append("x-rapidapi-host", "v3.football.api-sports.io");

// var requestOptions = {
//   method: "GET",
//   headers: myHeaders,
//   redirect: "follow",
// };

// fetch("https://v3.football.api-sports.io/teams", requestOptions)
//   .then((response) => response.text())
//   .then((result) => console.log(result))
//   .catch((error) => console.log("error", error));

// const url = "https://api-football-v1.p.rapidapi.com/v3/timezone";
// const options = {
//   method: "GET",
//   headers: {
//     "X-RapidAPI-Key": "27fce6bde4msh7acd7c7b3f1c7fap1ccc0ejsn804991608a10",
//     "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
//   },
// };

// const APIKey = process.env.APIKEY;

// var myHeaders = new Headers();
// myHeaders.append("x-rapidapi-key", "9bc65e77a74fe61fdbe484513209802e");
// myHeaders.append("x-rapidapi-host", "v3.football.api-sports.io");

// var requestOptions = {
//   method: "GET",
//   headers: myHeaders,
//   redirect: "follow",
// };

// fetch(
//   "https://v3.football.api-sports.io/fixtures?league=4944&season=2023",
//   requestOptions
// )
//   .then((response) => response.text())
//   .then((result) => console.log(result))
//   .catch((error) => console.log("error", error));

// // try {
// //   const response = await fetch(url, options);
// //   const result = await response.text();
// //   console.log(result);

// // } catch (error) {
// //   console.error(error);
// // }
