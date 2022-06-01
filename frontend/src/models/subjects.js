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
            await dispatch.users.asyncGetTeachersList()
		},
        async asyncCreateSubject(formData, rootState) {
            await fetch(SUBJECTS_URL, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
            await dispatch.subjects.asyncGetSubjectsList()
		},
        async asyncUpdateSubject(payload, rootState) {
            const query = new URLSearchParams()
            for (let key in payload.params) {
                query.append(key, payload.params[key])
            }
            await fetch(`${SUBJECTS_URL}/${payload.id}?${query.toString()}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
            await dispatch.subjects.asyncGetSubjectsList()
		},
        async asyncDeleteGroup(payload, rootState) {
            await fetch(`${SUBJECTS_URL}/${payload}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
            await dispatch.subjects.asyncGetSubjectsList()
		}
	}),
}