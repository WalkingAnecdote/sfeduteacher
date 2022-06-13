import {ACTIVITIES_URL, LESSONS_URL} from '../api'

const initState =  {
    activitiesByLesson: null,
    activityWithMarks: null
}

export const activitiesModel = {
	state: initState,
	reducers: {
		setActivitiesByLesson: (state, payload) => {
			return {
                ...state,
                activitiesByLesson: payload
            }
		},
        setActivityWithMarks: (state, payload) => {
			return {
                ...state,
                activityWithMarks: payload
            }
		},
        resetState: () => {
            return initState
        }
	},
	effects: (dispatch) => ({
		async asyncGetActivitiesByLesson(payload, rootState) {
            const result = await fetch(`${LESSONS_URL}/${payload}/activities`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
			this.setActivitiesByLesson(result)
		},
        async asyncCreateActivityForLesson(formData, rootState) {
            await fetch(ACTIVITIES_URL, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
            await dispatch.activities.asyncGetActivitiesByLesson(formData.get('lesson_id'))
		},
        async asyncDeleteActivity(payload, rootState) {
            await fetch(`${ACTIVITIES_URL}/${payload.activityId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
            await dispatch.activities.asyncGetActivitiesByLesson(payload.lessonId)
		},
        async asyncUpdateActivity(payload, rootState) {
            const query = new URLSearchParams()
            for (let key in payload.params) {
                query.append(key, payload.params[key])
            }
            await fetch(`${ACTIVITIES_URL}/${payload.activityId}?${query.toString()}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
            await dispatch.activities.asyncGetActivitiesByLesson(payload.lessonId)
		},
        async asyncAddMarkForActivity(payload, rootState) {
            await fetch(`${ACTIVITIES_URL}/${payload.activityId}/student/${payload.studentId}`, {
                method: 'POST',
                body: payload.formData,
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
            await dispatch.activities.asyncGetActivitiesByLesson(payload.lessonId)
		},
        async asyncGetActivityWithMarks(payload, rootState) {
            const result = await fetch(`${ACTIVITIES_URL}/${payload}/marks`, {
                method: 'GET',
                body: payload.formData,
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
            this.setActivityWithMarks(result)
		},
        async asyncResetState() {
			this.resetState()
		},
	}),
}