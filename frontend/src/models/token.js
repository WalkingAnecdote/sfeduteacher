import {SIGNIN_URL} from '../api'

const initialState = {
	access_token: null,
	expires_in: null,
	refresh_token: null,
	token_type: null,
	error: null
}

export const tokenModel = {
	state: initialState,
	reducers: {
		setState: (state, payload) => {
			return {...state, ...payload}
		},
		resetError: (state) => {
			return {
				...state,
				error: null
			}
		},
		resetState: () => {
			return initialState
		}
	},
	effects: (dispatch) => ({
		async asyncLogin(fromData) {
            const result = await fetch(SIGNIN_URL, {method: 'POST', body: fromData})
				.then(res => res.json())
				.catch((err) => err.json())
			this.setState(result)
			if (result?.access_token) {
            	await dispatch.user.asyncGetUser()
			}
		},
		async asyncResetState() {
			this.resetState()
		},
		async asyncLogout() {
			await dispatch.chats.asyncResetState()
			await dispatch.groups.asyncResetState()
			await dispatch.lessons.asyncResetState()
			await dispatch.semesters.asyncResetState()
			await dispatch.subjects.asyncResetState()
			await dispatch.token.asyncResetState()
			await dispatch.user.asyncResetState()
			await dispatch.users.asyncResetState()
			await dispatch.activities.asyncResetState()
		}
	}),
}