import {GROUPS_URL} from '../api'

const initState =  {
    semestersList: null
}

export const semestersModel = {
	state: initState,
	reducers: {
		setSemestersList: (state, payload) => {
			return {
                ...state,
                semestersList: payload
            }
		},
        resetState: () => {
            return initState
        }
	},
	effects: (dispatch) => ({
		async asyncGetSemestersList(payload, rootState) {
            const result = await fetch(`${GROUPS_URL}/${payload}/semesters`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
			this.setSemestersList(result)
		},
        async asyncDeleteSemester(payload, rootState) {
            await fetch(`${GROUPS_URL}/${payload.groupId}/semesters/${payload.semesterId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json()).catch((err) => err.json())
            await dispatch.semesters.asyncGetSemestersList(payload.groupId)
		},
        async asyncCreateSemester(payload, rootState) {
            await fetch(`${GROUPS_URL}/${payload.groupId}/semesters`, {
                method: 'POST',
                body: payload.formData,
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
            await dispatch.semesters.asyncGetSemestersList(payload.groupId)
		},
        async asyncResetState() {
			this.resetState()
		},
	}),
}