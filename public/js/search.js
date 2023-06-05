let teamSearchUrl = "https://v1.basketball.api-sports.io/teams?search=";
let sport = "";
const handleSearch = async (e) => {
  e.preventDefault();
  console.log(teamSearchUrl);
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
  resultsDiv.innerHTML = ""; // Clear previous results

  //  Append in Team Logos
  if (teamSearchUrl === "https://v3.football.api-sports.io/teams?search=") {
    const teamLogo = document.createElement("img");
    teamLogo.src = data.team.team.logo;
    resultsDiv.appendChild(teamLogo);
  } else {
    const teamLogo = document.createElement("img");
    teamLogo.src = data.team.logo;
    resultsDiv.appendChild(teamLogo);
  }

  // Append in Team Name
  if (teamSearchUrl === "https://v3.football.api-sports.io/teams?search=") {
    const teamName = document.createElement("h1");
    teamName.textContent = data.team.team.name;
    resultsDiv.appendChild(teamName);
  } else {
    const teamName = document.createElement("h1");
    teamName.textContent = data.name;
    resultsDiv.appendChild(teamName);
  }
  // Append in team Location
  if (teamSearchUrl === "https://v3.football.api-sports.io/teams?search=") {
    const teamLocation = document.createElement("p");
    teamLocation.textContent = `Team Location: ${data.team.venue.city}, ${data.team.team.country}`;
    resultsDiv.appendChild(teamLocation);
  } else {
    const teamLocation = document.createElement("p");
    teamLocation.textContent = `Team Location: ${data.country.name}`;
    resultsDiv.appendChild(teamLocation);
  }
  // Append in venue picture and information if API contains the info.
  if (teamSearchUrl === "https://v3.football.api-sports.io/teams?search=") {
    const venuePic = document.createElement("img");
    venuePic.src = data.team.venue.image;
    resultsDiv.appendChild(venuePic);

    const teamVenue = document.createElement("p");
    teamVenue.textContent = `Team Stadium: ${data.team.venue.name},
    \n Stadium Address: ${data.team.venue.address},
    \n Venue Capacity: ${data.team.venue.capacity}`;
    resultsDiv.appendChild(teamVenue);

    const teamFoundedDate = document.createElement("p");
    teamFoundedDate.textContent = `Founded: ${data.team.team.founded}`;
    resultsDiv.appendChild(teamFoundedDate);

    const squad = data.squad.response[0].players;

    const playersHeader = document.createElement("h3");
    playersHeader.textContent = "Players:";
    resultsDiv.appendChild(playersHeader);

    const playersList = document.createElement("ul");

    squad.forEach((player) => {
      const playerItem = document.createElement("li");

      const playerName = document.createElement("p");
      playerName.textContent = `Name: ${player.name}`;
      playerItem.appendChild(playerName);

      const playerPosition = document.createElement("p");
      playerPosition.textContent = `Position: ${player.position}`;
      playerItem.appendChild(playerPosition);

      if (player.photo) {
        const playerPhoto = document.createElement("img");
        playerPhoto.src = player.photo;
        playerItem.appendChild(playerPhoto);
      }

      const playerAge = document.createElement("p");
      playerAge.textContent = `Age: ${player.age}`;
      playerItem.appendChild(playerAge);

      const playerNumber = document.createElement("p");
      playerNumber.textContent = `Number: ${player.number}`;
      playerItem.appendChild(playerNumber);

      playersList.appendChild(playerItem);
    });

    resultsDiv.appendChild(playersList);
  } else if (
    teamSearchUrl === `https://v1.hockey.api-sports.io/teams?search=`
  ) {
    const teamVenue = document.createElement("p");
    teamVenue.textContent = `Team Arena: ${data.response[0].arena.name}`;
    resultsDiv.appendChild(teamVenue);

    const teamFoundedDate = document.createElement("p");
    teamFoundedDate.textContent = `Founded: ${data.response[0].founded}`;
    resultsDiv.appendChild(teamFoundedDate);
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

document.querySelector("#subject").addEventListener("change", handleTeamSelect);

document.querySelector("#searchButton").addEventListener("click", handleSearch);
console.log("Event listener attached");
