import {ACTIVITIES_URL, LESSONS_URL} from '../api'

const initState =  {
    activitiesByLesson: null,
    // group: null
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
            // await dispatch.groups.asyncGetGroupsList()
		},
        async asyncResetState() {
			this.resetState()
		},
	}),
}