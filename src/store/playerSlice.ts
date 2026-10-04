import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Player } from "../types/player";
// @ts-ignore - players.js doesn't have types yet
import playersData from "../data/players.js";

interface PlayerState {
  playerList: Player[];
}

const initialState: PlayerState = {
  playerList: playersData as Player[],
};

const playerSlice = createSlice({
  name: "player",
  initialState,
  reducers: {
    setPlayerList(state, action: PayloadAction<Player[]>) {
      state.playerList = action.payload;
    },
  },
});

export const { setPlayerList } = playerSlice.actions;
export default playerSlice.reducer;
