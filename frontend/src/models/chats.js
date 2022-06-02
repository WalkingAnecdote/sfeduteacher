import {CHATS_URL} from '../api'

const initState =  {
    currentChat: null,
    chats: null,
}

export const chatsModel = {
	state: initState,
	reducers: {
		setCurrentChat: (state, payload) => {
			return {
                ...state,
                currentChat: payload
            }
		},
        setChats: (state, payload) => {
			return {
                ...state,
                chats: payload
            }
		},
        pushChat: (state, payload) => {
            return {
                ...state,
                chats: [...state.chat?.filter(chat => chat.id === payload.id) || [], payload],
                currentChat: payload

            }
        },
        resetState: () => {
            return initState
        }
	},
	effects: (dispatch) => ({
        async asyncSendMessage(payload, rootState) {
            const form = new FormData()
            for (let key in payload) {
                form.append(key, payload[key])
            }
            const chat = rootState?.chats?.chats?.filter(chat => chat?.participants.some(user => user.id === payload))[0]
            const subRoute = chat ? `/${chat.id}` : ''
            const result = await fetch(`${CHATS_URL}/${subRoute}`, {
                method: 'POST',
                body: form,
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
			this.pushChat(result)
		},
        async asyncGetAllChats(payload, rootState) {
            const result = await fetch(`${CHATS_URL}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
			this.setChats(result)
		},
		async asyncGetChatById(payload, rootState) {
            const result = await fetch(`${CHATS_URL}/${payload}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
			this.setCurrentChat(result)
		},
        setCurrentChatByUSerId(payload, rootState) {
            const chat = rootState?.chats?.chats?.filter(chat => chat?.participants.some(user => user.id === payload))[0]
            this.setCurrentChat(chat)
        }
	}),
}