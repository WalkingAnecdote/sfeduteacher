import {GROUPS_URL} from '../api'

const initState =  {
    groupsList: null
}

export const groupsModel = {
	state: initState,
	reducers: {
		setTeachersList: (state, payload) => {
			return {
                ...state,
                groupsList: payload
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
			this.setTeachersList(result)
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
            await fetch(`${GROUPS_URL}/${payload.id}?name=${payload.name}`, {
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
	}),
}