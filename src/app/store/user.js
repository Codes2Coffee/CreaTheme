import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: { status: "noUser", data: null },

  reducers: {
    setUser: (user, action) => {
      if (!action.payload) {
        user.data = null;
        user.status = "noUser";
        return;
      }

      user.status = "logged";
      user.data = action.payload;
    },
    setUserStatus: (user, action) => {
      user.status = action.payload;
    },
  },
});

export const { setUser, setUserStatus } = userSlice.actions;
export default userSlice.reducer;
