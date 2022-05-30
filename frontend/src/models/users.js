import {TEACHERS_URL} from '../api'

const initState =  {
    teachersList: null
}

export const usersModel = {
	state: initState,
	reducers: {
		setTeachersList: (state, payload) => {
			return {
                ...state,
                teachersList: payload
            }
		},
        resetState: () => {
            return initState
        }
	},
	effects: (dispatch) => ({
		async asyncGetTeachersList(payload, rootState) {
            const result = await fetch(TEACHERS_URL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
			this.setTeachersList(result)
		},
        async asyncCreateTeacher(formData, rootState) {
            await fetch(TEACHERS_URL, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
            await dispatch.users.asyncGetTeachersList()
		},
        async asyncUpdateTeacher(payload, rootState) {
            await fetch(`${TEACHERS_URL}/${payload.id}`, {
                method: 'POST',
                body: payload.formData,
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
            await dispatch.users.asyncGetTeachersList()
		},
	}),
}