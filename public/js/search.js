const handleSearch = async () => {
  console.log("handleSearch called");
  const searchInput = document.querySelector("input").value;
  const response = await fetch(`/api/search?term=${searchInput}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    console.error("API request failed:", response.status);
    return;
  }

  const data = await response.json();
  console.log(data);
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = ""; // Clear previous results

  const team = data.team.response[0].team;
  const squad = data.squad.response[0].players;
  const venue = data.team.response[0].venue;

  if (team.logo) {
    const teamLogo = document.createElement("img");
    teamLogo.src = team.logo;
    resultsDiv.appendChild(teamLogo);
  }

  const teamName = document.createElement("p");
  teamName.textContent = `Team Name: ${team.name}`;
  resultsDiv.appendChild(teamName);

  const teamLocation = document.createElement("p");
  teamLocation.textContent = `Team Location: ${venue.city}, ${team.country}`;
  resultsDiv.appendChild(teamLocation);

  if (venue.image) {
    const teamVenuePicture = document.createElement("img");
    teamVenuePicture.src = venue.image;
    resultsDiv.appendChild(teamVenuePicture);
  }

  const teamVenue = document.createElement("p");
  teamVenue.textContent = `Team Stadium: ${venue.name},
    \n Stadium Address: ${venue.address},
    \n Venue Capacity: ${venue.capacity}`;
  resultsDiv.appendChild(teamVenue);

  const teamFoundedDate = document.createElement("p");
  teamFoundedDate.textContent = `Founded: ${team.founded}`;
  resultsDiv.appendChild(teamFoundedDate);

  if (squad) {
    const playersHeader = document.createElement("h3");
    playersHeader.textContent = "Players:";
    resultsDiv.appendChild(playersHeader);

    const playersList = document.createElement("ul");
    squad.forEach((player) => {
      const playerItem = document.createElement("li");

      const playerName = document.createElement("p");
      playerName.textContent = `Name: ${player.name}`;
      playerItem.appendChild(playerName);

      if (player.photo) {
        const playerPhoto = document.createElement("img");
        playerPhoto.src = player.photo;
        playerItem.appendChild(playerPhoto);
      }

      const playerPosition = document.createElement("p");
      playerPosition.textContent = `Position: ${player.position}`;
      playerItem.appendChild(playerPosition);

      // const playerAge = document.createElement("p");
      // playerPosition.textContent = `Age: ${player.age}`;
      // playerItem.appendChild(playerAge);

      // const playerNumber = document.createElement("p");
      // playerPosition.textContent = `Age: ${player.number}`;
      // playerItem.appendChild(playerNumber);

      playersList.appendChild(playerItem);
    });

    resultsDiv.appendChild(playersList);
  } else {
    const noPlayersItem = document.createElement("p");
    noPlayersItem.textContent = "No Players Found";
    resultsDiv.appendChild(noPlayersItem);
  }
};

document.querySelector("#searchButton").addEventListener("click", handleSearch);
console.log("Event listener attached");
