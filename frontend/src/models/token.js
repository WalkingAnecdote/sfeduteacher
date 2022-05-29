import {SIGNIN_URL} from '../api'

const initialState = {
	access_token: null,
	expires_in: null,
	refresh_token: null,
	token_type: null
}

export const tokenModel = {
	state: initialState,
	reducers: {
		setState: (state, payload) => {
			return {...payload}
		},
		resetState: () => {
			return initialState
		}
	},
	effects: (dispatch) => ({
		async asyncLogin(fromData) {
            const result = await fetch(SIGNIN_URL, {method: 'POST', body: fromData}).then(res => res.json())
			this.setState(result)
            await dispatch.user.asyncGetUser()
		},
		async asyncLogout() {
			this.resetState()
		}
	}),
}