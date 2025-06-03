// components/PlayerInput.js
import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

const PlayerInput = ({ player, allPlayers, onNameChange }) => {
  const otherPlayer = allPlayers.find(p => p.id !== player.id);
  const isLeading = otherPlayer && player.score > otherPlayer.score;

  return (
    <View style={styles.player}>
      <TextInput
        style={styles.input}
        placeholder="Player Name"
        value={player.name}
        onChangeText={(text) => onNameChange(player.id, text)}
      />
      <Text style={styles.score}>Score: {player.score}</Text>
      {isLeading && <Text style={styles.leading}>Leading!</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  player: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f1f1f1',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    borderRadius: 6,
    marginBottom: 6,
    backgroundColor: '#fff',
  },
  score: {
    fontSize: 16,
    marginBottom: 4,
  },
  leading: {
    color: 'green',
    fontWeight: 'bold',
  },
});

export default PlayerInput;
