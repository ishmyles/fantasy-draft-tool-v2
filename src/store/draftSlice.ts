import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Player } from "../types/player";
// @ts-ignore - players.js doesn't have types yet
import playersData from "../data/players.js";

interface DraftState {
  availablePlayers: Player[];
  myRoster: Player[];
  pickHistory: Player[];
}

const initialState: DraftState = {
  availablePlayers: playersData as Player[],
  myRoster: [],
  pickHistory: [],
};

const draftSlice = createSlice({
  name: "draft",
  initialState,
  reducers: {
    setPlayerList(state, action: PayloadAction<Player[]>) {
      state.availablePlayers = action.payload;
    },
    draftPlayer(state, action: PayloadAction<string>) {
      const playerId = action.payload;
      
      const playerIndex = state.availablePlayers.findIndex(p => p.id === playerId);
      if (playerIndex !== -1) {
        const player = state.availablePlayers[playerIndex];
        
        state.availablePlayers.splice(playerIndex, 1);
        
        state.pickHistory.push(player);
        state.myRoster.push(player);
      }
    },
    markUnavailable(state, action: PayloadAction<string>) {
      const playerId = action.payload;
      
      const playerIndex = state.availablePlayers.findIndex(p => p.id === playerId);
      if (playerIndex !== -1) {
        const player = state.availablePlayers[playerIndex];
        
        state.availablePlayers.splice(playerIndex, 1);
        
        state.pickHistory.push(player);
      }
    }
  }
});

export const { setPlayerList, draftPlayer, markUnavailable } = draftSlice.actions;
export default draftSlice.reducer;
