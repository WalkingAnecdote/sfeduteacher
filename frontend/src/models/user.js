import {SELF_USER_URL} from '../api'

const initState =  null

export const userModel = {
	state: initState,
	reducers: {
		setState: (state, payload) => {
			return {...payload}
		},
        resetState: () => {
            return initState
        }
	},
	effects: (dispatch) => ({
		async asyncGetUser(payload, rootState) {
            const result = await fetch(SELF_USER_URL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
			this.setState(result)
		},
	}),
}