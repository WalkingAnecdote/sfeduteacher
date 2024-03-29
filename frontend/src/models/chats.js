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
            try {
                const chat = await fetch(`${CHATS_URL}`, {
                    method: 'POST',
                    body: form,
                    headers: {
                        'Authorization': `Bearer ${rootState.token.access_token}`
                    }
                }).then(res => res.json())
                this.setCurrentChat(chat)
			    dispatch.chats.asyncGetAllChats()
            } catch (err) {
                console.error(err)
            }
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
        async getCurrentChatByUSerId(payload, rootState) {
            const chat = rootState?.chats?.chats?.filter(chat => chat?.participants?.some(user => user.id === payload))[0]
            console.log(chat)
            if (chat) {
                this.setCurrentChat(chat)
                await dispatch.chats.asyncGetChatById(chat.id)
            } else {
                this.setCurrentChat(null)
            }
        },
        async asyncResetState() {
			this.resetState()
		},
	}),
}