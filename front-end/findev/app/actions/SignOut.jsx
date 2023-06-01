export const logout = () => {
    return (dispatch) => {
      // Remove items from local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
  
      // Dispatch the signout action
      dispatch(signOut());
    };
  };
  
  // Define the action type
  export const SIGN_OUT = "SIGN_OUT";
  
  // Define the signout action creator
  export const signOut = () => {
    return { type: SIGN_OUT };
  };