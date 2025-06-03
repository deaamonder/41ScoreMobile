// components/RoundInput.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  Switch,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const VALID_GUESSES = [2, 3, 4, 5, 7];

const RoundInput = ({
  players,
  currentRound,
  onGuessSubmit,
  onActualScoreSubmit,
  onFinalizeRound,
}) => {
  const isRoundComplete = !currentRound.currentGuesses.some(g => g === null);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Current Round</Text>
      <Text style={styles.dealer}>Dealer: Player {currentRound.dealer + 1}</Text>

      {players.map((player, index) => (
        <View key={player.id} style={styles.playerRow}>
          <Text style={styles.playerName}>{player.name || `Player ${player.id}`}</Text>

          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={currentRound.currentGuesses[index] ?? ''}
              style={styles.picker}
              onValueChange={(value) => onGuessSubmit(index, value)}
            >
              <Picker.Item label="Select Guess" value="" />
              {VALID_GUESSES.map(g => (
                <Picker.Item key={g} label={`${g}`} value={g} />
              ))}
            </Picker>
          </View>

          <View style={styles.switchRow}>
            <Text>Match the guess?</Text>
            <Switch
              value={currentRound.actualScores[index] === 1}
              onValueChange={(value) => onActualScoreSubmit(index, value ? 1 : 0)}
            />
          </View>
        </View>
      ))}

      <Button
        title="Finalize Round"
        onPress={onFinalizeRound}
        disabled={!isRoundComplete}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dealer: {
    marginBottom: 10,
    fontStyle: 'italic',
  },
  playerRow: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  playerName: {
    fontSize: 16,
    marginBottom: 8,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 10,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});

export default RoundInput;
