import * as React from "react";

/**
 * This represents some generic auth provider API, like Firebase.
 */
 const fakeAuthProvider = {
    isAuthenticated: false,
    signin(callback) {
      fakeAuthProvider.isAuthenticated = true;
      setTimeout(callback, 100); // fake async
    },
    signout(callback) {
      fakeAuthProvider.isAuthenticated = false;
      setTimeout(callback, 100);
    },
  };


let AuthContext = React.createContext(null);


function AuthProvider({ children }) {
    let [user, setUser] = React.useState(false);

    let signin = (newUser, callback) => {
        return fakeAuthProvider.signin(() => {
        setUser(true);
        callback();
        });
    };

    let signout = (callback) => {
        return fakeAuthProvider.signout(() => {
        setUser(false);
        callback();
        });
    };

    let value = { user, signin, signout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
    return React.useContext(AuthContext);
}
  
  export { AuthContext, AuthProvider, useAuth };