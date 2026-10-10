import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Player } from "../types/player";
// @ts-ignore - players.js doesn't have types yet
import playersData from "../data/players.js";

interface DraftState {
  availablePlayers: Player[];
  myRoster: Player[];
  pickHistory: Player[];
  wishlist: Player[];
  filters: {
    search: string;
    team: string;
    position: string;
  };
}

const initialState: DraftState = {
  availablePlayers: playersData as Player[],
  myRoster: [],
  pickHistory: [],
  wishlist: [],
  filters: {
    search: "",
    team: "All Teams",
    position: "All",
  },
};

const draftSlice = createSlice({
  name: "draft",
  initialState,
  reducers: {
    setSearch(state, action: PayloadAction<string>) {
      state.filters.search = action.payload;
    },
    setTeamFilter(state, action: PayloadAction<string>) {
      state.filters.team = action.payload;
    },
    setPositionFilter(state, action: PayloadAction<string>) {
      state.filters.position = action.payload;
    },
    clearFilters(state) {
      state.filters = { search: "", team: "All Teams", position: "All" };
    },
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
        state.wishlist = state.wishlist.filter(p => p.id !== playerId);
      }
    },
    markUnavailable(state, action: PayloadAction<string>) {
      const playerId = action.payload;
      
      const playerIndex = state.availablePlayers.findIndex(p => p.id === playerId);
      if (playerIndex !== -1) {
        const player = state.availablePlayers[playerIndex];
        
        state.availablePlayers.splice(playerIndex, 1);
        
        state.pickHistory.push(player);
        state.wishlist = state.wishlist.filter(p => p.id !== playerId);
      }
    },
    toggleWishlist(state, action: PayloadAction<string>) {
      const playerId = action.payload;
      const wishlistIndex = state.wishlist.findIndex(p => p.id === playerId);
      
      if (wishlistIndex !== -1) {
        state.wishlist.splice(wishlistIndex, 1);
      } else {
        const player = state.availablePlayers.find(p => p.id === playerId);
        if (player) {
          state.wishlist.push(player);
        }
      }
    },
    undoLastPick(state) {
      if (state.pickHistory.length === 0) return;
      
      const lastPick = state.pickHistory.pop()!;
      
      if (
        state.myRoster.length > 0 && 
        state.myRoster[state.myRoster.length - 1].id === lastPick.id
      ) {
        state.myRoster.pop();
      }
      
      state.availablePlayers.push(lastPick);
      state.availablePlayers.sort((a, b) => a.rank - b.rank);
    },
    resetDraft(state) {
      state.availablePlayers = playersData as Player[];
      state.myRoster = [];
      state.pickHistory = [];
      state.wishlist = [];
    }
  }
});

export const { 
  setPlayerList, 
  draftPlayer, 
  markUnavailable, 
  undoLastPick, 
  resetDraft,
  setSearch,
  setTeamFilter,
  setPositionFilter,
  clearFilters,
  toggleWishlist
} = draftSlice.actions;
export default draftSlice.reducer;
