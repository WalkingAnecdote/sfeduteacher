import {GROUPS_URL} from '../api'

const initState =  {
    groupsList: null,
    group: null
}

export const groupsModel = {
	state: initState,
	reducers: {
		setGroupsList: (state, payload) => {
			return {
                ...state,
                groupsList: payload
            }
		},
        setGroup: (state, payload) => {
			return {
                ...state,
                group: payload
            }
		},
        resetState: () => {
            return initState
        }
	},
	effects: (dispatch) => ({
		async asyncGetGroupsList(payload, rootState) {
            const result = await fetch(GROUPS_URL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
			this.setGroupsList(result)
		},
        async asyncCreateGroup(formData, rootState) {
            await fetch(GROUPS_URL, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
            await dispatch.groups.asyncGetGroupsList()
		},
        async asyncUpdateGroup(payload, rootState) {
            const query = new URLSearchParams()
            for (let key in payload.params) {
                query.append(key, payload.params[key])
            }
            await fetch(`${GROUPS_URL}/${payload.id}?${query.toString()}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
            await dispatch.groups.asyncGetGroupsList()
		},
        async asyncDeleteGroup(payload, rootState) {
            await fetch(`${GROUPS_URL}/${payload}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
            await dispatch.groups.asyncGetGroupsList()
		},
        async asyncGetGroupById(payload, rootState) {
            const result = await fetch(`${GROUPS_URL}/${payload}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
            this.setGroup(result)
		},
        async asyncResetState() {
			this.resetState()
		},
	}),
}