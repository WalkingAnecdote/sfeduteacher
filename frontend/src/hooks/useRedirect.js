import * as React from 'react';
import {useSelector} from 'react-redux'
import {
    useNavigate,
    useLocation
  } from "react-router-dom";

export const useRedirect = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from?.pathname || "/";
    const access_token = useSelector(state => state.token.access_token)
    const user = useSelector(state => state.user)

    React.useEffect(() => {
        if (access_token !== null) {
            if (user !== null && user.roles.includes('admin')) {
                navigate('/admin', { replace: true });
            } else {
                navigate(from, { replace: true });
            }
        } else {
            navigate('/signin', { replace: true });
        }
    }, [access_token, user])
}