import {SUBJECTS_URL} from '../api'

const initState =  {
    subjectsList: null
}

export const subjectsModel = {
	state: initState,
	reducers: {
		setSubjectsList: (state, payload) => {
			return {
                ...state,
                subjectsList: payload
            }
		},
        resetState: () => {
            return initState
        }
	},
	effects: (dispatch) => ({
		async asyncGetSubjectsList(payload, rootState) {
            const result = await fetch(SUBJECTS_URL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
			this.setSubjectsList(result)
		},
        async asyncCreateGroup(formData, rootState) {
            await fetch(SUBJECTS_URL, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
            await dispatch.groups.asyncGetGroupsList()
		},
        async asyncUpdateGroup(payload, rootState) {
            await fetch(`${SUBJECTS_URL}/${payload.id}?name=${payload.name}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
            await dispatch.groups.asyncGetGroupsList()
		},
	}),
}