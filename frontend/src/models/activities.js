import {ACTIVITIES_URL} from '../api'

const initState =  {
    // groupsList: null,
    // group: null
}

export const activitiesModel = {
	state: initState,
	reducers: {
		setGroupsList: (state, payload) => {
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
		// async asyncGetGroupsList(payload, rootState) {
        //     const result = await fetch(ACTIVITIES_URL, {
        //         method: 'GET',
        //         headers: {
        //             'Authorization': `Bearer ${rootState.token.access_token}`
        //         }
        //     }).then(res => res.json())
		// 	this.setGroupsList(result)
		// },
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