import { configureStore } from "@reduxjs/toolkit";
import draftReducer from "./draftSlice";
import { saveDraftData } from "../utils/storage";

export const store = configureStore({
  reducer: {
    draft: draftReducer,
  },
});

// Auto-persist draft state (IDs) to localStorage whenever state changes
store.subscribe(() => {
  const state = store.getState().draft;
  saveDraftData({
    rosterIds: state.myRoster.map((p) => p.id),
    historyIds: state.pickHistory.map((p) => p.id),
    wishlistIds: state.wishlist.map((p) => p.id),
  });
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
