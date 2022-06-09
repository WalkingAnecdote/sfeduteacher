import {TEACHERS_URL, STUDENTS_URL} from '../api'

const initState =  {
    teachersList: null,
    studentsList: null
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
        setStudentsList: (state, payload) => {
			return {
                ...state,
                studentsList: payload
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
            const parsedResult = {
                ...result,
                data: result?.data?.filter(user => user?.user)
            }
			this.setTeachersList(parsedResult)
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
        async asyncGetStudentsList(payload, rootState) {
            const result = await fetch(STUDENTS_URL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
			this.setStudentsList(result.filter(user => user.user))
            await dispatch.groups.asyncGetGroupsList()
		},
        async asyncCreateStudent(formData, rootState) {
            await fetch(STUDENTS_URL, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
            await dispatch.users.asyncGetStudentsList()
		},
        async asyncUpdateStudent(payload, rootState) {
            await fetch(`${STUDENTS_URL}/${payload.id}`, {
                method: 'POST',
                body: payload.formData,
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
            await dispatch.users.asyncGetStudentsList()
		},
        async asyncDeleteStudent(payload, rootState) {
            await fetch(`${STUDENTS_URL}/${payload}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
            await dispatch.users.asyncGetStudentsList()
		},
        async asyncDeleteTeacher(payload, rootState) {
            await fetch(`${TEACHERS_URL}/${payload}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
            await dispatch.users.asyncGetTeachersList()
		},
        async asyncResetState() {
			this.resetState()
		},
	}),
}