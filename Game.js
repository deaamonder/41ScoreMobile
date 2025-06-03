// components/Game.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, ScrollView, StyleSheet } from 'react-native';
import RoundInput from './RoundInput';
import RoundHistory from './RoundHistory';
import PlayerDisplay from './PlayerDisplay';

const VALID_GUESSES = [2, 3, 4, 5, 7];

const Game = () => {
  const [players, setPlayers] = useState([
    { id: 1, name: '', score: 0, team: 1, over30: false, over40: false, over50: false },
    { id: 2, name: '', score: 0, team: 2, over30: false, over40: false, over50: false },
    { id: 3, name: '', score: 0, team: 1, over30: false, over40: false, over50: false },
    { id: 4, name: '', score: 0, team: 2, over30: false, over40: false, over50: false },
  ]);

  const [roundHistory, setRoundHistory] = useState([]);
  const [currentRound, setCurrentRound] = useState({
    dealer: 0,
    currentGuesses: Array(4).fill(null),
    actualScores: Array(4).fill(null),
  });

  const [winTeam, setWinTeam] = useState(null);
  const [warningMessage, setWarningMessage] = useState('');
  const [playerWarningMessage, setPlayerWarningMessage] = useState(Array(4).fill(''));

  useEffect(() => {
    const winner = checkWinCondition();
    if (winner) {
      setWinTeam(winner);
    }
  }, [players]);

  const isValidRound = (currentRound) => {
    return currentRound.currentGuesses.reduce((sum, guess) => sum + guess, 0) >= 11;
  };

  const calculateTeamScore = (teamNumber) => {
    return players
      .filter((player) => player.team === teamNumber)
      .reduce((sum, player) => sum + player.score, 0);
  };

  const handleNameChange = (playerId, newName) => {
    setPlayers(players.map(p =>
      p.id === playerId ? { ...p, name: newName } : p
    ));
  };

  const handleGuessSubmit = (playerIndex, guess) => {
    if (!VALID_GUESSES.includes(guess)) return;

    const playerScore = players[playerIndex].score;

    const updatedGuesses = currentRound.currentGuesses.map((g, i) =>
      i === playerIndex ? guess : g
    );

    let tempWarningMessage = '';

    if (playerScore >= 50 && playerScore !== 51 && guess < 5) {
      tempWarningMessage = players[playerIndex].name + ' must guess 5 or more points because your score is over 50.';
    } else if (playerScore >= 40 && playerScore !== 41 && guess < 4) {
      tempWarningMessage = players[playerIndex].name + ' must guess 4 or more points because your score is over 40.';
    } else if (playerScore >= 30 && guess < 3) {
      tempWarningMessage = players[playerIndex].name + ' must guess 3 or more points because your score is over 30.';
    }

    setPlayerWarningMessage(prev => {
      const updated = [...prev];
      updated[playerIndex] = tempWarningMessage;
      return updated;
    });

    setCurrentRound(prev => ({
      ...prev,
      currentGuesses: updatedGuesses,
    }));

    if (!isValidRound({ ...currentRound, currentGuesses: updatedGuesses })) {
      setWarningMessage('Round is not valid. Please make sure the sum of the guesses is at least 11.');
    } else {
      setWarningMessage('');
    }
  };

  const handleActualScoreSubmit = (playerIndex, actualScore) => {
    setCurrentRound((prev) => ({
      ...prev,
      actualScores: prev.actualScores.map((s, i) =>
        i === playerIndex ? actualScore : s
      ),
    }));
  };

  const finalizeRound = () => {
    if (warningMessage !== '') return;

    const guesses = currentRound.currentGuesses;
    const actuals = currentRound.actualScores;
    const scoreChanges = [];

    const newScores = players.map((player, index) => {
      const guess = guesses[index];
      const actual = actuals[index];

      let scoreChange = actual === 1 ? (guess === 7 ? 14 : guess) : -guess;
      scoreChanges.push(scoreChange);

      const newScore = player.score + scoreChange;

      return {
        ...player,
        score: newScore,
        over30: newScore >= 30,
        over40: newScore >= 40 && newScore !== 41,
        over50: newScore >= 50 && newScore !== 51,
      };
    });

    setRoundHistory(prev => [...prev, {
      guesses: [...guesses],
      actuals: [...actuals],
      scoreChanges,
      dealer: currentRound.dealer,
    }]);

    setPlayers(newScores);
    setCurrentRound({
      dealer: (currentRound.dealer + 1) % 4,
      currentGuesses: Array(4).fill(null),
      actualScores: Array(4).fill(null),
    });
  };

  const checkWinCondition = () => {
    const team1HasNegative = players.some(p => p.team === 1 && p.score < 0);
    const team2HasNegative = players.some(p => p.team === 2 && p.score < 0);
    const team1Has41 = players.some(p => p.team === 1 && p.score >= 41);
    const team2Has41 = players.some(p => p.team === 2 && p.score >= 41);
    const team1Has51 = players.some(p => p.team === 1 && p.score >= 51);
    const team2Has51 = players.some(p => p.team === 2 && p.score >= 51);
    const team1Has61 = players.some(p => p.team === 1 && p.score >= 61);
    const team2Has61 = players.some(p => p.team === 2 && p.score >= 61);

    const draw41 = team1Has41 && team2Has41;
    const draw51 = team1Has51 && team2Has51;

    if (!draw41) {
      if (team1Has41 && !team1HasNegative) return 1;
      if (team2Has41 && !team2HasNegative) return 2;
    } else {
      if (team1Has51 && !team1HasNegative) return 1;
      if (team2Has51 && !team2HasNegative) return 2;
    }

    if (!draw51) {
      if (team1Has51 && !team1HasNegative) return 1;
      if (team2Has51 && !team2HasNegative) return 2;
    } else {
      if (team1Has61 && !team1HasNegative) return 1;
      if (team2Has61 && !team2HasNegative) return 2;
    }

    return null;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>41 Score Tracker</Text>

      <PlayerDisplay players={players} onNameChange={handleNameChange} />

      <RoundInput
        players={players}
        currentRound={currentRound}
        onGuessSubmit={handleGuessSubmit}
        onActualScoreSubmit={handleActualScoreSubmit}
        onFinalizeRound={finalizeRound}
      />

      {winTeam && (
        <View style={styles.winBox}>
          <Text style={styles.winText}>
            {players.find(p => p.team === winTeam).name} from Team {winTeam} wins!
          </Text>
          <Button title="Reset" onPress={() => {
            setWinTeam(null);
            setPlayers(players.map(p => ({ ...p, score: 0 })));
            setRoundHistory([]);
          }} />
        </View>
      )}

      {warningMessage ? (
        <Text style={styles.warning}>{warningMessage}</Text>
      ) : null}

      {playerWarningMessage.map((warning, idx) => (
        warning ? (
          <Text key={idx} style={styles.warning}>{warning}</Text>
        ) : null
      ))}

      <RoundHistory history={roundHistory} players={players} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  warning: {
    color: 'red',
    fontWeight: 'bold',
    marginVertical: 8,
  },
  winBox: {
    marginVertical: 20,
    alignItems: 'center',
  },
  winText: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default Game;
