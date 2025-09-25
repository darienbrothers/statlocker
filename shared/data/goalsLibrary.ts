import { GoalTemplate } from '../types/goals';

export const GOALS_LIBRARY: GoalTemplate[] = [
  // --- Attack (Freshman) ---
  { id:'atk-fr-goals-10', position:'Attack', level:'Freshman', title:'10 goals (season)', metricType:'count', target:10, unit:'goals', timeframe:'season', trackingKey:'goals' },
  { id:'atk-fr-ast-10',   position:'Attack', level:'Freshman', title:'10 assists (season)', metricType:'count', target:10, unit:'assists', timeframe:'season', trackingKey:'assists' },
  { id:'atk-fr-ppg-2',    position:'Attack', level:'Freshman', title:'2.0 points per game', metricType:'rate', target:2, unit:'points', timeframe:'per_game', trackingKey:'points' },
  { id:'atk-fr-shoot-45', position:'Attack', level:'Freshman', title:'45%+ shooting (season)', metricType:'percent', target:0.45, unit:'%', timeframe:'season', trackingKey:'shooting_pct' },
  { id:'atk-fr-tov-max2', position:'Attack', level:'Freshman', title:'≤2 turnovers per game', metricType:'max', target:2, unit:'turnovers', timeframe:'per_game', trackingKey:'turnovers' },
  { id:'atk-fr-gb-20',    position:'Attack', level:'Freshman', title:'20 ground balls (season)', metricType:'count', target:20, unit:'GBs', timeframe:'season', trackingKey:'ground_balls' },
  { id:'atk-fr-shots-50', position:'Attack', level:'Freshman', title:'50+ shots (season)', metricType:'count', target:50, unit:'shots', timeframe:'season', trackingKey:'shots' },
  { id:'atk-fr-sog-30',   position:'Attack', level:'Freshman', title:'30+ shots on goal', metricType:'count', target:30, unit:'SOG', timeframe:'season', trackingKey:'shots_on_goal' },
  { id:'atk-fr-points-15', position:'Attack', level:'Freshman', title:'15+ total points', metricType:'count', target:15, unit:'points', timeframe:'season', trackingKey:'total_points' },
  { id:'atk-fr-hat-1',    position:'Attack', level:'Freshman', title:'1+ hat trick game', metricType:'count', target:1, unit:'games', timeframe:'season', trackingKey:'hat_tricks' },

  // --- Attack (JV) ---
  { id:'atk-jv-goals-30', position:'Attack', level:'JV', title:'30 goals (season)', metricType:'count', target:30, unit:'goals', timeframe:'season', trackingKey:'goals' },
  { id:'atk-jv-ast-20',   position:'Attack', level:'JV', title:'20 assists (season)', metricType:'count', target:20, unit:'assists', timeframe:'season', trackingKey:'assists' },
  { id:'atk-jv-ppg-3',    position:'Attack', level:'JV', title:'3.0 points per game', metricType:'rate', target:3, unit:'points', timeframe:'per_game', trackingKey:'points' },
  { id:'atk-jv-shoot-50', position:'Attack', level:'JV', title:'50%+ shooting', metricType:'percent', target:0.5, unit:'%', timeframe:'season', trackingKey:'shooting_pct' },
  { id:'atk-jv-tov-1_5',  position:'Attack', level:'JV', title:'≤1.5 turnovers per game', metricType:'max', target:1.5, unit:'turnovers', timeframe:'per_game', trackingKey:'turnovers' },
  { id:'atk-jv-gb-40',    position:'Attack', level:'JV', title:'40 ground balls (season)', metricType:'count', target:40, unit:'GBs', timeframe:'season', trackingKey:'ground_balls' },
  { id:'atk-jv-shots-80', position:'Attack', level:'JV', title:'80+ shots (season)', metricType:'count', target:80, unit:'shots', timeframe:'season', trackingKey:'shots' },
  { id:'atk-jv-sog-50',   position:'Attack', level:'JV', title:'50+ shots on goal', metricType:'count', target:50, unit:'SOG', timeframe:'season', trackingKey:'shots_on_goal' },
  { id:'atk-jv-points-40', position:'Attack', level:'JV', title:'40+ total points', metricType:'count', target:40, unit:'points', timeframe:'season', trackingKey:'total_points' },
  { id:'atk-jv-hat-2',    position:'Attack', level:'JV', title:'2+ hat trick games', metricType:'count', target:2, unit:'games', timeframe:'season', trackingKey:'hat_tricks' },

  // --- Attack (Varsity) ---
  { id:'atk-var-goals-50', position:'Attack', level:'Varsity', title:'50+ goals (season)', metricType:'count', target:50, unit:'goals', timeframe:'season', trackingKey:'goals' },
  { id:'atk-var-ast-40',   position:'Attack', level:'Varsity', title:'40+ assists (season)', metricType:'count', target:40, unit:'assists', timeframe:'season', trackingKey:'assists' },
  { id:'atk-var-ppg-4',    position:'Attack', level:'Varsity', title:'4.0+ points per game', metricType:'rate', target:4, unit:'points', timeframe:'per_game', trackingKey:'points' },
  { id:'atk-var-shoot-55', position:'Attack', level:'Varsity', title:'55–60%+ shooting', metricType:'percent', target:0.55, unit:'%', timeframe:'season', trackingKey:'shooting_pct' },
  { id:'atk-var-tov-1',    position:'Attack', level:'Varsity', title:'≤1 turnover per game', metricType:'max', target:1, unit:'turnovers', timeframe:'per_game', trackingKey:'turnovers' },
  { id:'atk-var-gb-60',    position:'Attack', level:'Varsity', title:'60+ ground balls (season)', metricType:'count', target:60, unit:'GBs', timeframe:'season', trackingKey:'ground_balls' },
  { id:'atk-var-shots-120', position:'Attack', level:'Varsity', title:'120+ shots (season)', metricType:'count', target:120, unit:'shots', timeframe:'season', trackingKey:'shots' },
  { id:'atk-var-sog-80',   position:'Attack', level:'Varsity', title:'80+ shots on goal', metricType:'count', target:80, unit:'SOG', timeframe:'season', trackingKey:'shots_on_goal' },
  { id:'atk-var-points-70', position:'Attack', level:'Varsity', title:'70+ total points', metricType:'count', target:70, unit:'points', timeframe:'season', trackingKey:'total_points' },
  { id:'atk-var-hat-3',    position:'Attack', level:'Varsity', title:'3+ hat trick games', metricType:'count', target:3, unit:'games', timeframe:'season', trackingKey:'hat_tricks' },

  // --- Midfielder (Freshman) ---
  { id:'mid-fr-goals-10', position:'Midfielder', level:'Freshman', title:'10 goals (season)', metricType:'count', target:10, unit:'goals', timeframe:'season', trackingKey:'goals' },
  { id:'mid-fr-ast-10',   position:'Midfielder', level:'Freshman', title:'10 assists (season)', metricType:'count', target:10, unit:'assists', timeframe:'season', trackingKey:'assists' },
  { id:'mid-fr-gbpg-2',   position:'Midfielder', level:'Freshman', title:'2+ GBs per game', metricType:'rate', target:2, unit:'GBs', timeframe:'per_game', trackingKey:'ground_balls' },
  { id:'mid-fr-ppg-1',    position:'Midfielder', level:'Freshman', title:'1.0+ points per game', metricType:'rate', target:1, unit:'points', timeframe:'per_game', trackingKey:'points' },
  { id:'mid-fr-tov-2',    position:'Midfielder', level:'Freshman', title:'≤2 turnovers per game', metricType:'max', target:2, unit:'turnovers', timeframe:'per_game', trackingKey:'turnovers' },
  { id:'mid-fr-clear-70', position:'Midfielder', level:'Freshman', title:'70%+ clear success', metricType:'percent', target:0.7, unit:'%', timeframe:'season', trackingKey:'clears_success' },
  { id:'mid-fr-gb-30',    position:'Midfielder', level:'Freshman', title:'30+ ground balls (season)', metricType:'count', target:30, unit:'GBs', timeframe:'season', trackingKey:'ground_balls' },
  { id:'mid-fr-ct-8',     position:'Midfielder', level:'Freshman', title:'8+ caused turnovers', metricType:'count', target:8, unit:'CTs', timeframe:'season', trackingKey:'caused_turnovers' },
  { id:'mid-fr-shots-25', position:'Midfielder', level:'Freshman', title:'25+ shots (season)', metricType:'count', target:25, unit:'shots', timeframe:'season', trackingKey:'shots' },
  { id:'mid-fr-fo-3',     position:'Midfielder', level:'Freshman', title:'3+ faceoff wins', metricType:'count', target:3, unit:'wins', timeframe:'season', trackingKey:'faceoff_wins' },

  // --- Midfielder (JV) ---
  { id:'mid-jv-goals-20', position:'Midfielder', level:'JV', title:'20 goals (season)', metricType:'count', target:20, unit:'goals', timeframe:'season', trackingKey:'goals' },
  { id:'mid-jv-ast-20',   position:'Midfielder', level:'JV', title:'20 assists (season)', metricType:'count', target:20, unit:'assists', timeframe:'season', trackingKey:'assists' },
  { id:'mid-jv-gbpg-3',   position:'Midfielder', level:'JV', title:'3+ GBs per game', metricType:'rate', target:3, unit:'GBs', timeframe:'per_game', trackingKey:'ground_balls' },
  { id:'mid-jv-ppg-2',    position:'Midfielder', level:'JV', title:'2.0+ points per game', metricType:'rate', target:2, unit:'points', timeframe:'per_game', trackingKey:'points' },
  { id:'mid-jv-tov-1_5',  position:'Midfielder', level:'JV', title:'≤1.5 turnovers per game', metricType:'max', target:1.5, unit:'turnovers', timeframe:'per_game', trackingKey:'turnovers' },
  { id:'mid-jv-clear-80', position:'Midfielder', level:'JV', title:'80%+ clear success', metricType:'percent', target:0.8, unit:'%', timeframe:'season', trackingKey:'clears_success' },
  { id:'mid-jv-gb-50',    position:'Midfielder', level:'JV', title:'50+ ground balls (season)', metricType:'count', target:50, unit:'GBs', timeframe:'season', trackingKey:'ground_balls' },
  { id:'mid-jv-ct-15',    position:'Midfielder', level:'JV', title:'15+ caused turnovers', metricType:'count', target:15, unit:'CTs', timeframe:'season', trackingKey:'caused_turnovers' },
  { id:'mid-jv-shots-40', position:'Midfielder', level:'JV', title:'40+ shots (season)', metricType:'count', target:40, unit:'shots', timeframe:'season', trackingKey:'shots' },
  { id:'mid-jv-fo-8',     position:'Midfielder', level:'JV', title:'8+ faceoff wins', metricType:'count', target:8, unit:'wins', timeframe:'season', trackingKey:'faceoff_wins' },

  // --- Midfielder (Varsity) ---
  { id:'mid-var-goals-25', position:'Midfielder', level:'Varsity', title:'25+ goals (season)', metricType:'count', target:25, unit:'goals', timeframe:'season', trackingKey:'goals' },
  { id:'mid-var-ast-25',   position:'Midfielder', level:'Varsity', title:'25+ assists (season)', metricType:'count', target:25, unit:'assists', timeframe:'season', trackingKey:'assists' },
  { id:'mid-var-gbpg-4',   position:'Midfielder', level:'Varsity', title:'4+ GBs per game', metricType:'rate', target:4, unit:'GBs', timeframe:'per_game', trackingKey:'ground_balls' },
  { id:'mid-var-ppg-3',    position:'Midfielder', level:'Varsity', title:'3.0+ points per game', metricType:'rate', target:3, unit:'points', timeframe:'per_game', trackingKey:'points' },
  { id:'mid-var-shoot-50', position:'Midfielder', level:'Varsity', title:'50%+ shooting', metricType:'percent', target:0.5, unit:'%', timeframe:'season', trackingKey:'shooting_pct' },
  { id:'mid-var-clear-85', position:'Midfielder', level:'Varsity', title:'85%+ clear success', metricType:'percent', target:0.85, unit:'%', timeframe:'season', trackingKey:'clears_success' },
  { id:'mid-var-gb-70',    position:'Midfielder', level:'Varsity', title:'70+ ground balls (season)', metricType:'count', target:70, unit:'GBs', timeframe:'season', trackingKey:'ground_balls' },
  { id:'mid-var-ct-20',    position:'Midfielder', level:'Varsity', title:'20+ caused turnovers', metricType:'count', target:20, unit:'CTs', timeframe:'season', trackingKey:'caused_turnovers' },
  { id:'mid-var-shots-60', position:'Midfielder', level:'Varsity', title:'60+ shots (season)', metricType:'count', target:60, unit:'shots', timeframe:'season', trackingKey:'shots' },
  { id:'mid-var-fo-15',    position:'Midfielder', level:'Varsity', title:'15+ faceoff wins', metricType:'count', target:15, unit:'wins', timeframe:'season', trackingKey:'faceoff_wins' },

  // --- Defender (Freshman) ---
  { id:'def-fr-gb-20',  position:'Defender', level:'Freshman', title:'20 ground balls (season)', metricType:'count', target:20, unit:'GBs', timeframe:'season', trackingKey:'ground_balls' },
  { id:'def-fr-ct-10',  position:'Defender', level:'Freshman', title:'10 caused turnovers (season)', metricType:'count', target:10, unit:'CTs', timeframe:'season', trackingKey:'caused_turnovers' },
  { id:'def-fr-pen-0_7',position:'Defender', level:'Freshman', title:'≤0.7 penalties per game', metricType:'max', target:0.7, unit:'penalties', timeframe:'per_game', trackingKey:'penalties' },
  { id:'def-fr-clear-80',position:'Defender', level:'Freshman', title:'80%+ clear success', metricType:'percent', target:0.8, unit:'%', timeframe:'season', trackingKey:'clears_success' },
  { id:'def-fr-gbpg-3', position:'Defender', level:'Freshman', title:'3+ GBs per game', metricType:'rate', target:3, unit:'GBs', timeframe:'per_game', trackingKey:'ground_balls' },
  { id:'def-fr-clears-15', position:'Defender', level:'Freshman', title:'15 successful clears (season)', metricType:'count', target:15, unit:'clears', timeframe:'season', trackingKey:'clears_success' },

  // --- Defender (JV) ---
  { id:'def-jv-gb-40',  position:'Defender', level:'JV', title:'40 ground balls (season)', metricType:'count', target:40, unit:'GBs', timeframe:'season', trackingKey:'ground_balls' },
  { id:'def-jv-ct-25',  position:'Defender', level:'JV', title:'25 caused turnovers (season)', metricType:'count', target:25, unit:'CTs', timeframe:'season', trackingKey:'caused_turnovers' },
  { id:'def-jv-pen-0_5',position:'Defender', level:'JV', title:'≤0.5 penalties per game', metricType:'max', target:0.5, unit:'penalties', timeframe:'per_game', trackingKey:'penalties' },
  { id:'def-jv-clear-85',position:'Defender', level:'JV', title:'85%+ clear success', metricType:'percent', target:0.85, unit:'%', timeframe:'season', trackingKey:'clears_success' },
  { id:'def-jv-gbpg-4', position:'Defender', level:'JV', title:'4+ GBs per game', metricType:'rate', target:4, unit:'GBs', timeframe:'per_game', trackingKey:'ground_balls' },
  { id:'def-jv-clears-30', position:'Defender', level:'JV', title:'30 successful clears (season)', metricType:'count', target:30, unit:'clears', timeframe:'season', trackingKey:'clears_success' },

  // --- Defender (Varsity) ---
  { id:'def-var-gb-60',  position:'Defender', level:'Varsity', title:'60+ ground balls (season)', metricType:'count', target:60, unit:'GBs', timeframe:'season', trackingKey:'ground_balls' },
  { id:'def-var-ct-40',  position:'Defender', level:'Varsity', title:'40+ caused turnovers (season)', metricType:'count', target:40, unit:'CTs', timeframe:'season', trackingKey:'caused_turnovers' },
  { id:'def-var-pen-0_3',position:'Defender', level:'Varsity', title:'≤0.3 penalties per game', metricType:'max', target:0.3, unit:'penalties', timeframe:'per_game', trackingKey:'penalties' },
  { id:'def-var-clear-90',position:'Defender', level:'Varsity', title:'90%+ clear success', metricType:'percent', target:0.9, unit:'%', timeframe:'season', trackingKey:'clears_success' },
  { id:'def-var-gbpg-5', position:'Defender', level:'Varsity', title:'5+ GBs per game', metricType:'rate', target:5, unit:'GBs', timeframe:'per_game', trackingKey:'ground_balls' },
  { id:'def-var-clears-50', position:'Defender', level:'Varsity', title:'50+ successful clears (season)', metricType:'count', target:50, unit:'clears', timeframe:'season', trackingKey:'clears_success' },

  // --- Goalie (Freshman) ---
  { id:'gk-fr-savepct-50', position:'Goalie', level:'Freshman', title:'50%+ save percentage', metricType:'percent', target:0.5, unit:'%', timeframe:'season', trackingKey:'save_pct' },
  { id:'gk-fr-savespg-8', position:'Goalie', level:'Freshman', title:'8.0 saves per game', metricType:'rate', target:8, unit:'saves', timeframe:'per_game', trackingKey:'saves' },
  { id:'gk-fr-gaa-11', position:'Goalie', level:'Freshman', title:'≤11.0 goals against per game', metricType:'max', target:11, unit:'GA', timeframe:'per_game', trackingKey:'goals_against' },
  { id:'gk-fr-clear-80', position:'Goalie', level:'Freshman', title:'80%+ clear success', metricType:'percent', target:0.8, unit:'%', timeframe:'season', trackingKey:'clears_success' },
  { id:'gk-fr-saves-100', position:'Goalie', level:'Freshman', title:'100+ saves (season)', metricType:'count', target:100, unit:'saves', timeframe:'season', trackingKey:'saves' },
  { id:'gk-fr-close-55', position:'Goalie', level:'Freshman', title:'55%+ close-range save %', metricType:'percent', target:0.55, unit:'%', timeframe:'season', trackingKey:'save_pct_close' },

  // --- Goalie (JV) ---
  { id:'gk-jv-savepct-55', position:'Goalie', level:'JV', title:'55–58%+ save percentage', metricType:'percent', target:0.55, unit:'%', timeframe:'season', trackingKey:'save_pct' },
  { id:'gk-jv-savespg-10', position:'Goalie', level:'JV', title:'10.0+ saves per game', metricType:'rate', target:10, unit:'saves', timeframe:'per_game', trackingKey:'saves' },
  { id:'gk-jv-gaa-9_5', position:'Goalie', level:'JV', title:'≤9.5 goals against per game', metricType:'max', target:9.5, unit:'GA', timeframe:'per_game', trackingKey:'goals_against' },
  { id:'gk-jv-clear-85', position:'Goalie', level:'JV', title:'85%+ clear success', metricType:'percent', target:0.85, unit:'%', timeframe:'season', trackingKey:'clears_success' },
  { id:'gk-jv-saves-150', position:'Goalie', level:'JV', title:'150+ saves (season)', metricType:'count', target:150, unit:'saves', timeframe:'season', trackingKey:'saves' },
  { id:'gk-jv-highdanger-60', position:'Goalie', level:'JV', title:'60%+ high-danger save %', metricType:'percent', target:0.6, unit:'%', timeframe:'season', trackingKey:'save_pct_high_danger' },

  // --- Goalie (Varsity) ---
  { id:'gk-var-savepct-60', position:'Goalie', level:'Varsity', title:'60%+ save percentage', metricType:'percent', target:0.6, unit:'%', timeframe:'season', trackingKey:'save_pct' },
  { id:'gk-var-savespg-12', position:'Goalie', level:'Varsity', title:'12.0+ saves per game', metricType:'rate', target:12, unit:'saves', timeframe:'per_game', trackingKey:'saves' },
  { id:'gk-var-gaa-8', position:'Goalie', level:'Varsity', title:'≤8.0 goals against per game', metricType:'max', target:8, unit:'GA', timeframe:'per_game', trackingKey:'goals_against' },
  { id:'gk-var-clear-90', position:'Goalie', level:'Varsity', title:'90%+ clear success', metricType:'percent', target:0.9, unit:'%', timeframe:'season', trackingKey:'clears_success' },
  { id:'gk-var-saves-200', position:'Goalie', level:'Varsity', title:'200+ saves (season)', metricType:'count', target:200, unit:'saves', timeframe:'season', trackingKey:'saves' },
  { id:'gk-var-ast-2', position:'Goalie', level:'Varsity', title:'2+ goalie assists (season)', metricType:'count', target:2, unit:'assists', timeframe:'season', trackingKey:'assists' },

  // --- LSM (Freshman/JV/Varsity) ---
  { id:'lsm-fr-gb-25', position:'LSM', level:'Freshman', title:'25 GBs (season)', metricType:'count', target:25, unit:'GBs', timeframe:'season', trackingKey:'ground_balls' },
  { id:'lsm-fr-ct-10', position:'LSM', level:'Freshman', title:'10 CTs (season)', metricType:'count', target:10, unit:'CTs', timeframe:'season', trackingKey:'caused_turnovers' },
  { id:'lsm-fr-gbpg-2', position:'LSM', level:'Freshman', title:'2+ GBs per game', metricType:'rate', target:2, unit:'GBs', timeframe:'per_game', trackingKey:'ground_balls' },
  { id:'lsm-fr-pen-0_7', position:'LSM', level:'Freshman', title:'≤0.7 penalties per game', metricType:'max', target:0.7, unit:'penalties', timeframe:'per_game', trackingKey:'penalties' },
  { id:'lsm-fr-clear-80', position:'LSM', level:'Freshman', title:'80%+ clear success', metricType:'percent', target:0.8, unit:'%', timeframe:'season', trackingKey:'clears_success' },
  { id:'lsm-fr-trans-2', position:'LSM', level:'Freshman', title:'2 transition points', metricType:'count', target:2, unit:'points', timeframe:'season', trackingKey:'transition_points' },

  { id:'lsm-jv-gb-50', position:'LSM', level:'JV', title:'50 GBs (season)', metricType:'count', target:50, unit:'GBs', timeframe:'season', trackingKey:'ground_balls' },
  { id:'lsm-jv-ct-25', position:'LSM', level:'JV', title:'25 CTs (season)', metricType:'count', target:25, unit:'CTs', timeframe:'season', trackingKey:'caused_turnovers' },
  { id:'lsm-jv-gbpg-3', position:'LSM', level:'JV', title:'3+ GBs per game', metricType:'rate', target:3, unit:'GBs', timeframe:'per_game', trackingKey:'ground_balls' },
  { id:'lsm-jv-pen-0_5', position:'LSM', level:'JV', title:'≤0.5 penalties per game', metricType:'max', target:0.5, unit:'penalties', timeframe:'per_game', trackingKey:'penalties' },
  { id:'lsm-jv-clear-85', position:'LSM', level:'JV', title:'85%+ clear success', metricType:'percent', target:0.85, unit:'%', timeframe:'season', trackingKey:'clears_success' },
  { id:'lsm-jv-trans-6', position:'LSM', level:'JV', title:'6 transition points', metricType:'count', target:6, unit:'points', timeframe:'season', trackingKey:'transition_points' },

  { id:'lsm-var-gb-80', position:'LSM', level:'Varsity', title:'80+ GBs (season)', metricType:'count', target:80, unit:'GBs', timeframe:'season', trackingKey:'ground_balls' },
  { id:'lsm-var-ct-35', position:'LSM', level:'Varsity', title:'35+ CTs (season)', metricType:'count', target:35, unit:'CTs', timeframe:'season', trackingKey:'caused_turnovers' },
  { id:'lsm-var-gbpg-4', position:'LSM', level:'Varsity', title:'4+ GBs per game', metricType:'rate', target:4, unit:'GBs', timeframe:'per_game', trackingKey:'ground_balls' },
  { id:'lsm-var-pen-0_3', position:'LSM', level:'Varsity', title:'≤0.3 penalties per game', metricType:'max', target:0.3, unit:'penalties', timeframe:'per_game', trackingKey:'penalties' },
  { id:'lsm-var-clear-90', position:'LSM', level:'Varsity', title:'90%+ clear success', metricType:'percent', target:0.9, unit:'%', timeframe:'season', trackingKey:'clears_success' },
  { id:'lsm-var-trans-10', position:'LSM', level:'Varsity', title:'10+ transition points', metricType:'count', target:10, unit:'points', timeframe:'season', trackingKey:'transition_points' },

  // --- FOGO (Freshman/JV/Varsity) ---
  { id:'fo-fr-fo-45', position:'FOGO', level:'Freshman', title:'45%+ FO win rate', metricType:'percent', target:0.45, unit:'%', timeframe:'season', trackingKey:'faceoff_win_pct' },
  { id:'fo-fr-gb-30', position:'FOGO', level:'Freshman', title:'30 GBs (season)', metricType:'count', target:30, unit:'GBs', timeframe:'season', trackingKey:'ground_balls' },
  { id:'fo-fr-viol-1', position:'FOGO', level:'Freshman', title:'≤1.0 FO violations per game', metricType:'max', target:1, unit:'violations', timeframe:'per_game', trackingKey:'faceoff_violations' },
  { id:'fo-fr-gbpg-2', position:'FOGO', level:'Freshman', title:'2+ GBs per game', metricType:'rate', target:2, unit:'GBs', timeframe:'per_game', trackingKey:'ground_balls' },
  { id:'fo-fr-trans-5', position:'FOGO', level:'Freshman', title:'5 transition points', metricType:'count', target:5, unit:'points', timeframe:'season', trackingKey:'transition_points' },
  { id:'fo-fr-wins-50', position:'FOGO', level:'Freshman', title:'50+ FO wins (season)', metricType:'count', target:50, unit:'wins', timeframe:'season', trackingKey:'faceoff_wins' },
  { id:'fo-fr-clean-15', position:'FOGO', level:'Freshman', title:'15+ clean faceoff wins', metricType:'count', target:15, unit:'clean wins', timeframe:'season', trackingKey:'faceoff_clean_wins' },
  { id:'fo-fr-wing-10', position:'FOGO', level:'Freshman', title:'10+ wing assists', metricType:'count', target:10, unit:'assists', timeframe:'season', trackingKey:'wing_assists' },
  { id:'fo-fr-fast-20', position:'FOGO', level:'Freshman', title:'20+ fast breaks created', metricType:'count', target:20, unit:'fast breaks', timeframe:'season', trackingKey:'fast_breaks' },
  { id:'fo-fr-poss-80', position:'FOGO', level:'Freshman', title:'80+ possessions won', metricType:'count', target:80, unit:'possessions', timeframe:'season', trackingKey:'possessions_won' },

  { id:'fo-jv-fo-55', position:'FOGO', level:'JV', title:'55%+ FO win rate', metricType:'percent', target:0.55, unit:'%', timeframe:'season', trackingKey:'faceoff_win_pct' },
  { id:'fo-jv-gb-60', position:'FOGO', level:'JV', title:'60 GBs (season)', metricType:'count', target:60, unit:'GBs', timeframe:'season', trackingKey:'ground_balls' },
  { id:'fo-jv-viol-0_5', position:'FOGO', level:'JV', title:'≤0.5 FO violations per game', metricType:'max', target:0.5, unit:'violations', timeframe:'per_game', trackingKey:'faceoff_violations' },
  { id:'fo-jv-gbpg-3', position:'FOGO', level:'JV', title:'3+ GBs per game', metricType:'rate', target:3, unit:'GBs', timeframe:'per_game', trackingKey:'ground_balls' },
  { id:'fo-jv-trans-10', position:'FOGO', level:'JV', title:'10 transition points', metricType:'count', target:10, unit:'points', timeframe:'season', trackingKey:'transition_points' },
  { id:'fo-jv-wins-150', position:'FOGO', level:'JV', title:'150+ FO wins (season)', metricType:'count', target:150, unit:'wins', timeframe:'season', trackingKey:'faceoff_wins' },
  { id:'fo-jv-clean-25', position:'FOGO', level:'JV', title:'25+ clean faceoff wins', metricType:'count', target:25, unit:'clean wins', timeframe:'season', trackingKey:'faceoff_clean_wins' },
  { id:'fo-jv-wing-15', position:'FOGO', level:'JV', title:'15+ wing assists', metricType:'count', target:15, unit:'assists', timeframe:'season', trackingKey:'wing_assists' },
  { id:'fo-jv-fast-30', position:'FOGO', level:'JV', title:'30+ fast breaks created', metricType:'count', target:30, unit:'fast breaks', timeframe:'season', trackingKey:'fast_breaks' },
  { id:'fo-jv-poss-120', position:'FOGO', level:'JV', title:'120+ possessions won', metricType:'count', target:120, unit:'possessions', timeframe:'season', trackingKey:'possessions_won' },

  { id:'fo-var-fo-65', position:'FOGO', level:'Varsity', title:'65–70%+ FO win rate', metricType:'percent', target:0.65, unit:'%', timeframe:'season', trackingKey:'faceoff_win_pct' },
  { id:'fo-var-gb-100', position:'FOGO', level:'Varsity', title:'100+ GBs (season)', metricType:'count', target:100, unit:'GBs', timeframe:'season', trackingKey:'ground_balls' },
  { id:'fo-var-viol-0', position:'FOGO', level:'Varsity', title:'0 FO violations in 3 straight games', metricType:'max', target:0, unit:'violations', timeframe:'per_game', trackingKey:'faceoff_violations' },
  { id:'fo-var-gbpg-4', position:'FOGO', level:'Varsity', title:'4+ GBs per game', metricType:'rate', target:4, unit:'GBs', timeframe:'per_game', trackingKey:'ground_balls' },
  { id:'fo-var-trans-20', position:'FOGO', level:'Varsity', title:'20 transition points', metricType:'count', target:20, unit:'points', timeframe:'season', trackingKey:'transition_points' },
  { id:'fo-var-wins-250', position:'FOGO', level:'Varsity', title:'250+ FO wins (season)', metricType:'count', target:250, unit:'wins', timeframe:'season', trackingKey:'faceoff_wins' },
  { id:'fo-var-clean-40', position:'FOGO', level:'Varsity', title:'40+ clean faceoff wins', metricType:'count', target:40, unit:'clean wins', timeframe:'season', trackingKey:'faceoff_clean_wins' },
  { id:'fo-var-wing-25', position:'FOGO', level:'Varsity', title:'25+ wing assists', metricType:'count', target:25, unit:'assists', timeframe:'season', trackingKey:'wing_assists' },
  { id:'fo-var-fast-50', position:'FOGO', level:'Varsity', title:'50+ fast breaks created', metricType:'count', target:50, unit:'fast breaks', timeframe:'season', trackingKey:'fast_breaks' },
  { id:'fo-var-poss-200', position:'FOGO', level:'Varsity', title:'200+ possessions won', metricType:'count', target:200, unit:'possessions', timeframe:'season', trackingKey:'possessions_won' },

];
