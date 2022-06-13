import {TESTS_URL, ACTIVITIES_URL} from '../api'

const initState =  {
    tests: null,
    test: null,
}

export const testsModel = {
	state: initState,
	reducers: {
        setTests: (state, payload) => {
			return {
                ...state,
                tests: payload
            }
		},
        setTest: (state, payload) => {
			return {
                ...state,
                test: payload
            }
		},
        resetState: () => {
            return initState
        }
	},
	effects: (dispatch) => ({
		async asyncCreateTest(formData, rootState) {
            await fetch(TESTS_URL, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
            await dispatch.tests.asyncGetAllTest()
		},
        async asyncUpdateTest(payload, rootState) {
            const query = new URLSearchParams()
            for (let key in payload.params) {
                query.append(key, payload.params[key])
            }
            await fetch(`${TESTS_URL}/${payload.testId}?${query.toString()}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
            await dispatch.tests.asyncGetAllTest()
		},
        async asyncDeleteTest(testId, rootState) {
            await fetch(`${TESTS_URL}/${testId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
            await dispatch.tests.asyncGetAllTest()
		},
        async asyncGetAllTest(payload, rootState) {
            const result = await fetch(TESTS_URL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
            this.setTests(result)
		},
        async asyncGetTest(testId, rootState) {
            const result = await fetch(`${TESTS_URL}/${testId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
            this.setTest(result)
		},
        async asyncGetTestsByActivity(activityId, rootState) {
            const result = await fetch(`${ACTIVITIES_URL}/${activityId}/tests`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
            this.setTest(result)
		},
        async asyncResetState() {
			this.resetState()
		},
	}),
}