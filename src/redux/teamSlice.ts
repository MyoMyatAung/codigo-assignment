import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Player {
  id: number;
  first_name: string;
  last_name: string;
  position: string;
  height: string;
  weight: string;
  jersey_number: string;
  college: string;
  country: string;
  draft_year: number;
  draft_round: number;
  draft_number: number;
  team: {
    id: number;
    conference: string;
    division: string;
    city: string;
    name: string;
    full_name: string;
    abbreviation: string;
  };
}

export interface Team {
  id: string;
  name: string;
  playerCount: number;
  region: string;
  country: string;
  players: Player[];
}

interface TeamState {
  list: Team[];
}

const initialState: TeamState = {
  list: [],
};

export const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    addTeam: (state, action: PayloadAction<Team>) => {
      console.log("Action Payload", action.payload);
      state.list.push(action.payload);
    },
    updateTeam: (state, action: PayloadAction<Team>) => {
      const { id, name, playerCount, region, country } = action.payload;
      const existingTeam = state.list.find((team) => team.id === id);
      if (existingTeam) {
        existingTeam.name = name;
        existingTeam.playerCount = playerCount;
        existingTeam.region = region;
        existingTeam.country = country;
      }
    },
    deleteTeam: (state, action: PayloadAction<string>) => {
      state.list = state.list.filter((team) => team.id !== action.payload);
    },
    addPlayerToTeam: (
      state,
      action: PayloadAction<{ teamId: string; player: Player }>
    ) => {
      const { teamId, player } = action.payload;
      const teamToUpdate = state.list.find((team) => team.id === teamId);
      if (teamToUpdate) {
        teamToUpdate.players.push(player);
        teamToUpdate.playerCount = teamToUpdate.players.length;
      }
    },
    removePlayerFromTeam: (
      state,
      action: PayloadAction<{ teamId: string; playerId: number }>
    ) => {
      const { teamId, playerId } = action.payload;
      const teamToUpdate = state.list.find((team) => team.id === teamId);
      if (teamToUpdate) {
        teamToUpdate.players = teamToUpdate.players.filter(
          (player) => player.id !== playerId
        );
        teamToUpdate.playerCount = teamToUpdate.players.length;
      }
    },
  },
});

// Export the actions so they can be dispatched
export const {
  addTeam,
  updateTeam,
  deleteTeam,
  addPlayerToTeam,
  removePlayerFromTeam,
} = teamSlice.actions;

export default teamSlice.reducer;
