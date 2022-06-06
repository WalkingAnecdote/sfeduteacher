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
        // async asyncCreateTeacher(formData, rootState) {
        //     await fetch(TEACHERS_URL, {
        //         method: 'POST',
        //         body: formData,
        //         headers: {
        //             'Authorization': `Bearer ${rootState.token.access_token}`
        //         }
        //     }).then(res => res.json())
        //     await dispatch.users.asyncGetTeachersList()
		// },
        // async asyncUpdateTeacher(payload, rootState) {
        //     await fetch(`${TEACHERS_URL}/${payload.id}`, {
        //         method: 'POST',
        //         body: payload.formData,
        //         headers: {
        //             'Authorization': `Bearer ${rootState.token.access_token}`
        //         }
        //     }).then(res => res.json())
        //     await dispatch.users.asyncGetTeachersList()
		// },
        async asyncResetState() {
			this.resetState()
		},
	}),
}