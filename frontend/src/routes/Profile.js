import { useAuth } from "../auth";


export default function ProfilePage() {
    const auth = useAuth()
    const handleSignout = () => {
        auth.signout()
    }
    return <>
        <h3>Profile</h3>
        <button onClick={handleSignout}>Signout</button>
    </>;
  }