let teamSearchUrl = "https://v1.basketball.api-sports.io/teams?search=";
let sport = "";
const column1 = document.getElementById("column1");
const column2 = document.getElementById("column2");

const handleSearch = async (e) => {
  e.preventDefault();
  const body = { url: teamSearchUrl, value: sport };
  const searchInput = document.querySelector("input").value;
  const response = await fetch(`/api/search/?term=${searchInput}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    console.error("API request failed:", response.message);
    return;
  }

  const data = await response.json();
  console.log(data);
  const resultsDiv = document.getElementById("results");
  column1.innerHTML = ""; // Clear previous results in column 1
  column2.innerHTML = ""; // Clear previous results in column 2
  //  Append in Team Logos
  if (teamSearchUrl === "https://v3.football.api-sports.io/teams?search=") {
    const teamLogo = document.createElement("img");
    teamLogo.src = data.team.team.logo;
    column1.appendChild(teamLogo);
  } else {
    const teamLogo = document.createElement("img");
    teamLogo.src = data.team.logo;
    column1.appendChild(teamLogo);
  }

  // Append in Team Name
  if (teamSearchUrl === "https://v3.football.api-sports.io/teams?search=") {
    const teamName = document.createElement("h1");
    teamName.textContent = data.team.team.name;
    column1.appendChild(teamName);
  } else {
    const teamName = document.createElement("h1");
    teamName.textContent = data.team.name;
    column1.appendChild(teamName);
  }
  // Append in team Location
  if (teamSearchUrl === "https://v3.football.api-sports.io/teams?search=") {
    const teamLocation = document.createElement("p");
    teamLocation.textContent = `Team Location: ${data.team.venue.city}, ${data.team.team.country}`;
    column1.appendChild(teamLocation);
  } else {
    const teamLocation = document.createElement("p");
    teamLocation.textContent = `Team Location: ${data.team.country.name}`;
    column1.appendChild(teamLocation);
  }
  // If soccer, append in player info, venue picture, league standings and information if API contains the info.
  if (teamSearchUrl === "https://v3.football.api-sports.io/teams?search=") {
    const venuePic = document.createElement("img");
    venuePic.src = data.team.venue.image;
    column1.appendChild(venuePic);

    const teamVenue = document.createElement("p");
    teamVenue.textContent = `Team Stadium: ${data.team.venue.name},
    \n Stadium Address: ${data.team.venue.address},
    \n Venue Capacity: ${data.team.venue.capacity}`;
    column1.appendChild(teamVenue);

    const teamFoundedDate = document.createElement("p");
    teamFoundedDate.textContent = `Founded: ${data.team.team.founded}`;
    column1.appendChild(teamFoundedDate);

    const squad = data.squad.response[0].players;

    const playersHeader = document.createElement("h3");
    playersHeader.textContent = "Players:";
    column3.appendChild(playersHeader);

    const playersTable = document.createElement("table");

    // Create the table header row
    const tableHeaderRow = document.createElement("tr");
    const playerNameHeader = document.createElement("th");
    playerNameHeader.textContent = "Name";
    tableHeaderRow.appendChild(playerNameHeader);
    const playerPositionHeader = document.createElement("th");
    playerPositionHeader.textContent = "Position";
    tableHeaderRow.appendChild(playerPositionHeader);
    const playerPhotoHeader = document.createElement("th");
    playerPhotoHeader.textContent = "Photo";
    tableHeaderRow.appendChild(playerPhotoHeader);
    const playerAgeHeader = document.createElement("th");
    playerAgeHeader.textContent = "Age";
    tableHeaderRow.appendChild(playerAgeHeader);
    const playerNumberHeader = document.createElement("th");
    playerNumberHeader.textContent = "Number";
    tableHeaderRow.appendChild(playerNumberHeader);
    playersTable.appendChild(tableHeaderRow);

    squad.forEach((player) => {
      const tableRow = document.createElement("tr");

      const playerNameCell = document.createElement("td");
      playerNameCell.textContent = player.name;
      tableRow.appendChild(playerNameCell);

      const playerPositionCell = document.createElement("td");
      playerPositionCell.textContent = player.position;
      tableRow.appendChild(playerPositionCell);

      const playerPhotoCell = document.createElement("td");
      if (player.photo) {
        const playerPhoto = document.createElement("img");
        playerPhoto.src = player.photo;
        playerPhotoCell.appendChild(playerPhoto);
      }
      tableRow.appendChild(playerPhotoCell);

      const playerAgeCell = document.createElement("td");
      playerAgeCell.textContent = player.age;
      tableRow.appendChild(playerAgeCell);

      const playerNumberCell = document.createElement("td");
      playerNumberCell.textContent = player.number;
      tableRow.appendChild(playerNumberCell);

      playersTable.appendChild(tableRow);
    });

    column3.appendChild(playersTable);

    // Create the League Standings Table Dynamically
    const standings = data.leagueStandings.response[0].league.standings[0];

    // Generate the HTML table dynamically
    const table = document.createElement("table");

    // Create the table header
    const tableHeader = table.createTHead();
    const headerRow = tableHeader.insertRow();
    headerRow.innerHTML = `
  <th>Logo</th>
  <th>Name</th>
  <th>MP</th>
  <th>W</th>
  <th>L</th>
  <th>GF</th>
  <th>GA</th>
  <th>GD</th>
  <th>Pts</th>
`;

    // Create the table body
    const tableBody = table.createTBody();

    standings.forEach((standing) => {
      const row = tableBody.insertRow();
      const goalsDifference =
        standing.all.goals.for - standing.all.goals.against;
      row.innerHTML = `
    <td><img src="${standing.team.logo}" alt="${standing.team.name}" width="50"></td>
    <td>${standing.team.name}</td>
    <td>${standing.all.played}</td>
    <td>${standing.all.win}</td>
    <td>${standing.all.lose}</td>
    <td>${standing.all.goals.for}</td>
    <td>${standing.all.goals.against}</td>
    <td>${goalsDifference}</td>
    <td>${standing.points}</td>
  `;
    });

    // Append the table to the desired element in your HTML
    const tableContainer = document.getElementById("tableContainer");

    column2.appendChild(table);

    // Create a table for the past 5 match fixtures
    const fixtures = data.teamGames.response;
    const fixtureTable = document.createElement("table");

    const fixtureTableHeader = fixtureTable.createTHead();
    const fixtureHeaderRow = fixtureTableHeader.insertRow();
    fixtureHeaderRow.innerHTML = `
    <th>Date</th>
      <th></th>
      <th>Home Team</th>
      <th></th>
      <th></th>
      <th></th>
      <th>Away Team</th>
      <th>Home Team</th>
    `;

    // Create the table body
    const fixtureTableBody = fixtureTable.createTBody();

    const maxResults = 5; // Maximum number of results to display
    let counter = 0; // Counter variable

    fixtures.forEach((fixture) => {
      if (counter >= maxResults) {
        return; // Stop the loop once the maximum number of results is reached
      }

      const row = fixtureTableBody.insertRow();

      // Convert the date format
      const date = new Date(fixture.fixture.date);
      const month = date.toLocaleString("default", { month: "long" });
      const day = date.getDate();
      const year = date.getFullYear();
      const formattedDate = `${month} ${day}, ${year}`;

      console.log(fixture);
      console.log(fixture.score.fulltime.home);
      row.innerHTML = `
      <td>${formattedDate}</td>
        <td><img src="${fixture.teams.home.logo}" alt="${fixture.teams.away.name}" width="50"></td>
        <td>${fixture.teams.home.name}</td>
        <td>${fixture.score.fulltime.home}</td>
        <td>-</td>
        <td>${fixture.score.fulltime.away}</td>
        <td>${fixture.teams.away.name}</td>
        <td><img src="${fixture.teams.away.logo}" alt="${fixture.teams.away.name}" width="50"></td>
      `;

      counter++; // Increment the counter after processing each fixture
    });

    const fixtureTableContainer = document.getElementById("matchFixtures");
    column2.appendChild(fixtureTable);
  } else if (
    teamSearchUrl === `https://v1.hockey.api-sports.io/teams?search=`
  ) {
    const teamVenue = document.createElement("p");
    teamVenue.textContent = `Team Arena: ${data.response[0].arena.name}`;
    resultsDiv.appendChild(teamVenue);

    const teamFoundedDate = document.createElement("p");
    teamFoundedDate.textContent = `Founded: ${data.response[0].founded}`;
    column2.appendChild(teamFoundedDate);
  }
};

const handleTeamSelect = async (e) => {
  e.preventDefault();
  // console.log(e.target);
  const form = document.getElementById("subject");
  let selectedIndex = form.selectedIndex;
  form.options[selectedIndex];
  switch (form.options[selectedIndex].value) {
    case "Basketball":
      teamSearchUrl = `https://v1.basketball.api-sports.io/teams?search=`;
      sport = "basketball";
      break;
    case "Baseball":
      teamSearchUrl = `https://v1.baseball.api-sports.io/teams?search=`;
      sport = "baseball";
      break;
    case "Hockey":
      teamSearchUrl = `https://v1.hockey.api-sports.io/teams?search=`;
      sport = "hockey";
      break;
    case "Soccer":
      teamSearchUrl = `https://v3.football.api-sports.io/teams?search=`;
      sport = "football";
      break;
    case "AmericanFootball":
      teamSearchUrl = `https://v1.american-football.api-sports.io/teams?search=`;
      sport = "american-football";
      break;
    default:
      teamSearchUrl = `https://v1.basketball.api-sports.io/teams?search=`;
      return;
  }
};

const favoriteButton = document.getElementById("favoriteButton");

const handleFavorite = (e) => {
  e.preventDefault();
  // Get the content from the search page
  const favoriteTeam = document.querySelector("input").value;

  // Send the content to the server
  fetch("/api/users/favorite", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ favoriteTeam }),
  })
    .then((response) => {
      // console.log(response);
      return response.json();
      // if (response.ok) {
      //   // Content saved successfully, redirect to the homepage
      //   // window.location.href = "/"; // Replace with the URL of your homepage
      // } else {
      //   console.error("Failed to save content:", response);
      // }
    })
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error("Request failed:", error);
    });
};

favoriteButton.addEventListener("click", handleFavorite);

document.querySelector("#subject").addEventListener("change", handleTeamSelect);

document.querySelector("#searchButton").addEventListener("click", handleSearch);
console.log("Event listener attached");
