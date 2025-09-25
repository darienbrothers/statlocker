import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SavedGame {
  id: string;
  opponent: string;
  date: string;
  isHome: boolean;
  seasonType: 'school' | 'club';
  result: 'win' | 'loss' | 'tie';
  position: string;
  gender: string;
  stats: {
    // Common stats
    goals: number;
    assists: number;
    shots: number;
    shotsOnGoal: number;
    groundBalls: number;
    turnovers: number;
    causedTurnovers: number;
    penalties: number;
    
    // Goalie specific
    shotsFaced: number;
    saves: number;
    goalsAgainst: number;
    clears: number;
    clearAttempts: number;
    
    // Midfield specific
    faceoffsWon: number;
    faceoffsTaken: number;
    drawControlsWon: number;
    drawControlsTaken: number;
  };
  calculatedStats: {
    points: number;
    shootingPercentage: number;
    shotAccuracy: number;
    savePercentage: number;
    faceoffPercentage: number;
    drawControlPercentage: number;
    clearPercentage: number;
  };
  timestamp: string;
}

export interface SeasonStats {
  totalGames: number;
  wins: number;
  losses: number;
  ties: number;
  totalGoals: number;
  totalAssists: number;
  totalShots: number;
  totalShotsOnGoal: number;
  totalSaves: number;
  totalShotsFaced: number;
  totalGoalsAgainst: number;
  // Calculated averages
  avgGoalsPerGame: number;
  avgAssistsPerGame: number;
  overallShootingPercentage: number;
  overallSavePercentage: number;
}

class GameDataService {
  private static readonly GAMES_KEY = 'saved_games';
  private static readonly SEASON_STATS_KEY = 'season_stats';

  // Save a new game
  async saveGame(gameData: any): Promise<SavedGame> {
    try {
      // Convert string stats to numbers
      const numericStats = this.convertStatsToNumbers(gameData.stats);
      
      const savedGame: SavedGame = {
        id: Date.now().toString(),
        opponent: gameData.opponent,
        date: gameData.date,
        isHome: gameData.isHome,
        seasonType: gameData.seasonType,
        result: gameData.result,
        position: gameData.position,
        gender: gameData.gender,
        stats: numericStats,
        calculatedStats: gameData.calculatedStats,
        timestamp: gameData.timestamp,
      };

      // Get existing games
      const existingGames = await this.getAllGames();
      const updatedGames = [...existingGames, savedGame];

      // Save updated games list
      await AsyncStorage.setItem(GameDataService.GAMES_KEY, JSON.stringify(updatedGames));

      // Update season stats
      await this.updateSeasonStats(updatedGames);

      return savedGame;
    } catch (error) {
      console.error('Error saving game:', error);
      throw error;
    }
  }

  // Get all saved games
  async getAllGames(): Promise<SavedGame[]> {
    try {
      const gamesJson = await AsyncStorage.getItem(GameDataService.GAMES_KEY);
      return gamesJson ? JSON.parse(gamesJson) : [];
    } catch (error) {
      console.error('Error loading games:', error);
      return [];
    }
  }

  // Get season stats
  async getSeasonStats(): Promise<SeasonStats> {
    try {
      const statsJson = await AsyncStorage.getItem(GameDataService.SEASON_STATS_KEY);
      if (statsJson) {
        return JSON.parse(statsJson);
      }
      
      // Return default stats if none exist
      return this.getDefaultSeasonStats();
    } catch (error) {
      console.error('Error loading season stats:', error);
      return this.getDefaultSeasonStats();
    }
  }

  // Get games by season type
  async getGamesBySeasonType(seasonType: 'school' | 'club'): Promise<SavedGame[]> {
    const allGames = await this.getAllGames();
    return allGames.filter(game => game.seasonType === seasonType);
  }

  // Get recent games (last 5)
  async getRecentGames(limit: number = 5): Promise<SavedGame[]> {
    const allGames = await this.getAllGames();
    return allGames
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
  }

  // Update season stats based on all games
  private async updateSeasonStats(games: SavedGame[]): Promise<void> {
    const stats: SeasonStats = {
      totalGames: games.length,
      wins: games.filter(g => g.result === 'win').length,
      losses: games.filter(g => g.result === 'loss').length,
      ties: games.filter(g => g.result === 'tie').length,
      totalGoals: games.reduce((sum, g) => sum + g.stats.goals, 0),
      totalAssists: games.reduce((sum, g) => sum + g.stats.assists, 0),
      totalShots: games.reduce((sum, g) => sum + g.stats.shots, 0),
      totalShotsOnGoal: games.reduce((sum, g) => sum + g.stats.shotsOnGoal, 0),
      totalSaves: games.reduce((sum, g) => sum + g.stats.saves, 0),
      totalShotsFaced: games.reduce((sum, g) => sum + g.stats.shotsFaced, 0),
      totalGoalsAgainst: games.reduce((sum, g) => sum + g.stats.goalsAgainst, 0),
      avgGoalsPerGame: 0,
      avgAssistsPerGame: 0,
      overallShootingPercentage: 0,
      overallSavePercentage: 0,
    };

    // Calculate averages
    if (stats.totalGames > 0) {
      stats.avgGoalsPerGame = stats.totalGoals / stats.totalGames;
      stats.avgAssistsPerGame = stats.totalAssists / stats.totalGames;
    }

    if (stats.totalShots > 0) {
      stats.overallShootingPercentage = (stats.totalGoals / stats.totalShots) * 100;
    }

    if (stats.totalShotsFaced > 0) {
      stats.overallSavePercentage = (stats.totalSaves / stats.totalShotsFaced) * 100;
    }

    await AsyncStorage.setItem(GameDataService.SEASON_STATS_KEY, JSON.stringify(stats));
  }

  // Convert string stats to numbers
  private convertStatsToNumbers(stats: any): SavedGame['stats'] {
    return {
      goals: parseInt(stats.goals) || 0,
      assists: parseInt(stats.assists) || 0,
      shots: parseInt(stats.shots) || 0,
      shotsOnGoal: parseInt(stats.shotsOnGoal) || 0,
      groundBalls: parseInt(stats.groundBalls) || 0,
      turnovers: parseInt(stats.turnovers) || 0,
      causedTurnovers: parseInt(stats.causedTurnovers) || 0,
      penalties: parseInt(stats.penalties) || 0,
      shotsFaced: parseInt(stats.shotsFaced) || 0,
      saves: parseInt(stats.saves) || 0,
      goalsAgainst: parseInt(stats.goalsAgainst) || 0,
      clears: parseInt(stats.clears) || 0,
      clearAttempts: parseInt(stats.clearAttempts) || 0,
      faceoffsWon: parseInt(stats.faceoffsWon) || 0,
      faceoffsTaken: parseInt(stats.faceoffsTaken) || 0,
      drawControlsWon: parseInt(stats.drawControlsWon) || 0,
      drawControlsTaken: parseInt(stats.drawControlsTaken) || 0,
    };
  }

  // Get default season stats
  private getDefaultSeasonStats(): SeasonStats {
    return {
      totalGames: 0,
      wins: 0,
      losses: 0,
      ties: 0,
      totalGoals: 0,
      totalAssists: 0,
      totalShots: 0,
      totalShotsOnGoal: 0,
      totalSaves: 0,
      totalShotsFaced: 0,
      totalGoalsAgainst: 0,
      avgGoalsPerGame: 0,
      avgAssistsPerGame: 0,
      overallShootingPercentage: 0,
      overallSavePercentage: 0,
    };
  }

  // Clear all data (for testing/reset)
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([GameDataService.GAMES_KEY, GameDataService.SEASON_STATS_KEY]);
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }
}

export const gameDataService = new GameDataService();
export default gameDataService;
