function addScores() {
  highscoreTable = document.getElementById("highscore-table");
  let place = 1;
  fetch("highscores.txt")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.text();
    })
    .then((data) => {
      const words = data.split(/\s+/);
      for (let i = 0; i < words.length; i += 2) {
        const row = document.createElement("tr");
        const cell1 = document.createElement("td");
        cell1.textContent = words[i];
        const cell2 = document.createElement("td");
        cell2.textContent = words[i + 1];
        if (place == 1) {
          cell1.classList.add("first-place");
          cell2.classList.add("first-place");
        }
        if (place == 2) {
          cell1.classList.add("second-place");
          cell2.classList.add("second-place");
        }
        if (place == 3) {
          cell1.classList.add("third-place");
          cell2.classList.add("third-place");
        }

        row.appendChild(cell1);
        row.appendChild(cell2);
        highscoreTable.appendChild(row);

        place += 1;
      }
    })
    .catch((error) => {
      console.error("Error reading the file:", error);
    });
}
