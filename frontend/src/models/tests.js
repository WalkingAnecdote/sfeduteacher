import {TESTS_URL, ACTIVITIES_URL, TASKS_URL, ANSWERS_URL, QUESTIONS_URL} from '../api'

const initState =  {
    tests: null,
    test: null,
    tasksByTest: null,
    task: null,
    createdCorrectAnswer: null
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
        setTasksByTest: (state, payload) => {
            return {
                ...state,
                tasksByTest: payload
            }
        },
        setTask: (state, payload) => {
            return {
                ...state,
                task: payload
            }
        },
        setCreatedCorrectAnswer: (state, payload) => {
            return {
                ...state,
                createdCorrectAnswer: payload
            }
        },
        resetState: () => {
            return initState
        }
	},
	effects: (dispatch) => ({
        // Tests
		async asyncCreateTest(payload, rootState) {
            await fetch(TESTS_URL, {
                method: 'POST',
                body: payload.formData,
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
            await dispatch.tests.asyncGetTestsByActivity(payload.activityId)
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
            await dispatch.tests.asyncGetTestsByActivity(payload.activityId)
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
            this.setTests(result)
		},
        async asyncSubmitTestAnswer(payload, rootState) {
            const result = await fetch(`${TESTS_URL}/${payload.testId}/students/${payload.studentId}/submit`, {
                method: 'POST',
                body: payload.formData,
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
            console.log(result)
            // await dispatch.tests.asyncGetTestsByActivity(payload.activityId)
		},
        // Tasks
        async asyncGetTasksByTests(testId, rootState) {
            const result = await fetch(`${TESTS_URL}/${testId}/tasks`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
            this.setTasksByTest(result)
		},
        async asyncGetTaskById(taskId, rootState) {
            const result = await fetch(`${TASKS_URL}/${taskId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
            this.setTask(result)
		},
        async asyncCreateTask(payload, rootState) {
            const task = await fetch(TASKS_URL, {
                method: 'POST',
                body: payload.formData,
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
            await dispatch.tests.asyncGetTasksByTests(payload.testId)
            return task
		},
        async asyncUpdateTask(payload, rootState) {
            const query = new URLSearchParams()
            for (let key in payload.params) {
                query.append(key, payload.params[key])
            }
            await fetch(`${TASKS_URL}/${payload.taskId}?${query.toString()}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
            await dispatch.tests.asyncGetTasksByTests(payload.testId)
		},
        async asyncDeleteTaskById(payload, rootState) {
            await fetch(`${TASKS_URL}/${payload.taskId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
            await dispatch.tests.asyncGetTasksByTests(payload.testId)
		},
        // Answers
        async asyncCreateAnswer(formData, rootState) {
            const result = await fetch(ANSWERS_URL, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
            return result
		},
        // Questions
        async asyncCreateQuestion(formData, rootState) {
            const result = await fetch(QUESTIONS_URL, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
            return result
		},
        async asyncSyncAnswersToQuestion(payload, rootState) {
            const result = await fetch(`${QUESTIONS_URL}/${payload.questionId}/answers`, {
                method: 'POST',
                body: payload.formData,
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
            return result
		},
        // Aggregated requests
        async asyncCreateTaskMono(payload, rootState) {
            const answer = await dispatch.tests.asyncCreateAnswer(payload.answerFormData)
            payload.formData.append('correct_answer_id', answer.id)
            await dispatch.tests.asyncCreateTask(payload)
		},
        async asyncCreateTaskQuiz(payload, rootState) {
            payload.taskForm.get('test_id')
            const task = await dispatch.tests.asyncCreateTask({
                formData: payload.taskForm,
                testId: payload.testId
            })
            payload.questionForm.append('task_id', task.id)
            const question = await dispatch.tests.asyncCreateQuestion(payload.questionForm)
            const correct_answer = await dispatch.tests.asyncCreateAnswer(payload.correctAnswerForm)
            const answer_0 = await dispatch.tests.asyncCreateAnswer(payload.answerForm_0)
            const answer_1 = await dispatch.tests.asyncCreateAnswer(payload.answerForm_1)
            const answer_2 = await dispatch.tests.asyncCreateAnswer(payload.answerForm_2)
            const syncForm = new FormData()
            syncForm.append('answers[0]', correct_answer.id)
            syncForm.append('answers[1]', answer_0.id)
            syncForm.append('answers[2]', answer_1.id)
            syncForm.append('answers[3]', answer_2.id)
            await dispatch.tests.asyncSyncAnswersToQuestion({
                formData: syncForm,
                questionId: question.id
            })
            await dispatch.tests.asyncUpdateTask({
                params: { correct_answer_id: correct_answer.id},
                taskId: task.id,
                testId: payload.testId
            })
		},
        async asyncCreateStudentAnswersAndSubmitTest(payload, rootState) {
            // const formData = new FormData()
            const answers = []
            for (let entity of payload.formData.entries()) {
                if (entity[0].includes('task_id')) {
                    if (entity[1].includes(';')) {
                        const [, task_id] = entity[0].split('=')
                        const answerPart = entity[1].split(';')
                        const [, answer_id] = answerPart[0].split('=')
                        const [, text] = answerPart[1].split('=')
                        answers.push({
                            task_id,
                            answer_id,
                            text
                        })
                        payload.formData.delete(entity[0])
                    } else {
                        const [, task_id] = entity[0].split('=')
                        const formData = new FormData()
                        formData.append('text', entity[1])
                        const answer = await dispatch.tests.asyncCreateAnswer(formData)
                        answers.push({
                            task_id,
                            answer_id: answer.id,
                            text: answer.text
                        })
                        payload.formData.delete(entity[0])
                    }
                }
            }
            payload.formData.append('student_answers', JSON.stringify(answers))

            await dispatch.tests.asyncSubmitTestAnswer({
                testId: payload.testId,
                studentId: payload.studentId,
                formData: payload.formData
            })
		},
        async asyncResetState() {
			this.resetState()
		},
	}),
}