// components/RoundHistory.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';

const RoundHistory = ({ history, players }) => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Round History</Text>
      <ScrollView horizontal>
        <View>
          <View style={styles.row}>
            <Text style={[styles.cell, styles.headerCell]}>Round</Text>
            {players.map((player, index) => (
              <Text key={index} style={[styles.cell, styles.headerCell]}>
                {player.name || `Player ${player.id}`}
              </Text>
            ))}
          </View>

          {history.map((round, roundIndex) => (
            <View key={roundIndex} style={styles.row}>
              <Text style={styles.cell}>{roundIndex + 1}</Text>
              {players.map((_, playerIndex) => {
                const change = round.scoreChanges[playerIndex];
                const isPositive = change >= 0;
                return (
                  <View
                    key={playerIndex}
                    style={[
                      styles.cell,
                      styles.scoreCell,
                      isPositive ? styles.positive : styles.negative,
                    ]}
                  >
                    <Text style={styles.detailText}>
                      Guess: {round.guesses[playerIndex]}
                    </Text>
                    <Text style={styles.detailText}>
                      Actual: {round.actuals[playerIndex]}
                    </Text>
                    <Text style={styles.detailText}>
                      Points: {change > 0 ? '+' : ''}{change}
                    </Text>
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  cell: {
    minWidth: 120,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  headerCell: {
    fontWeight: 'bold',
    backgroundColor: '#eee',
  },
  scoreCell: {
    backgroundColor: '#f9f9f9',
  },
  detailText: {
    fontSize: 12,
  },
  positive: {
    backgroundColor: '#d0f5d0',
  },
  negative: {
    backgroundColor: '#fddddd',
  },
});

export default RoundHistory;
