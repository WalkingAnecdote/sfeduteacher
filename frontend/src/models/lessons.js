import {SEMESTERS_URL, LESSONS_URL} from '../api'

const initState =  {
    lessonsBySemester: null,
}

export const lessonsModel = {
	state: initState,
	reducers: {
		setLessonsBySemester: (state, payload) => {
			return {
                ...state,
                lessonsBySemester: payload
            }
		},
        resetState: () => {
            return initState
        }
	},
	effects: (dispatch) => ({
		async asyncGetLessonsBySemester(payload, rootState) {
            const result = await fetch(`${SEMESTERS_URL}/${payload.semesterId}/subjects/${payload.subjectId}/lessons`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
			this.setLessonsBySemester(result)
		},
        async asyncCreateLesson(formData, rootState) {
            await fetch(LESSONS_URL, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
			const params = {
                semesterId: formData.get('semester_id'),
                subjectId: formData.get('subject_id')
            }
            dispatch.lessons.asyncGetLessonsBySemester(params)
		},
        async asyncUpdateLesson(payload, rootState) {
            const query = new URLSearchParams()
            for (let key in payload.params) {
                query.append(key, payload.params[key])
            }
            await fetch(`${LESSONS_URL}/${payload.lessonId}?${query.toString()}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
            dispatch.lessons.asyncGetLessonsBySemester({
                semesterId: payload.semesterId,
                subjectId: payload.subjectId
            })
		},
        async asyncDeleteLesson(payload, rootState) {
            await fetch(`${LESSONS_URL}/${payload.lessonId}?`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
            dispatch.lessons.asyncGetLessonsBySemester({
                semesterId: payload.semesterId,
                subjectId: payload.subjectId
            })
		},
        async asyncResetState() {
			this.resetState()
		},
	}),
}