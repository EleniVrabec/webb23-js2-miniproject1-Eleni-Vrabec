const backendUrl = 'http://localhost:3000';

export async function getHighscoreList() {
  try {
    const response = await fetch(`${backendUrl}/highscore`);
    return await response.json();
  } catch (error) {
    console.error('Error getting highscore list:', error);
    throw error;
  }
}

export async function addNewPlayer(playerData) {
  try {
    const response = await fetch(`${backendUrl}/highscore`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(playerData),
    });
    return await response.json();
  } catch (error) {
    console.error('Error adding a new player:', error);
    throw error;
  }
}

