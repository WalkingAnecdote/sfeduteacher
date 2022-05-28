import React from "react";
import { useSelector, useDispatch } from 'react-redux'


export default function ProfilePage() {
    const dispatch = useDispatch()

    const handleSignout = () => {
        dispatch.token.asyncLogout()
    }
    return <>
        <h3>Profile</h3>
        <button onClick={handleSignout}>Signout</button>
    </>;
  }