// API-Football Code Snippet with API Key website with documentation: https://www.api-football.com/
// 100 free requests a day.
const url = "https://api-football-v1.p.rapidapi.com/v3/timezone";
const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "27fce6bde4msh7acd7c7b3f1c7fap1ccc0ejsn804991608a10",
    "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
  },
};

try {
  const response = await fetch(url, options);
  const result = await response.text();
  console.log(result);
} catch (error) {
  console.error(error);
}
