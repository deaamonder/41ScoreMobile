// components/PlayerDisplay.js
import React from 'react';
import { View, FlatList } from 'react-native';
import PlayerInput from './PlayerInput';

const PlayerDisplay = ({ players, onNameChange }) => {
  return (
    <View>
      <FlatList
        data={players}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PlayerInput
            player={item}
            allPlayers={players}
            onNameChange={onNameChange}
          />
        )}
      />
    </View>
  );
};

export default PlayerDisplay;
