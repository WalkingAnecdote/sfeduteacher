import {POSTS_URL} from '../api'

const initState =  {
    posts: null
}

export const postsModel = {
	state: initState,
	reducers: {
        setPosts: (state, payload) => {
			return {
                ...state,
                posts: payload
            }
		},
        resetState: () => {
            return initState
        }
	},
	effects: (dispatch) => ({
        async asyncGetPosts(payload, rootState) {
            const result = await fetch(POSTS_URL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
			this.setPosts(result)
		},
        async asyncCreatePost(formData, rootState) {
            await fetch(POSTS_URL, {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
			dispatch.posts.asyncGetPosts()
		},
        async asyncUpdatePost(payload, rootState) {
            const query = new URLSearchParams()
            for (let key in payload.params) {
                query.append(key, payload.params[key])
            }
            await fetch(`${POSTS_URL}/${payload.postId}?${query.toString()}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
			dispatch.posts.asyncGetPosts()
		},
        async asyncDeletePost(postId, rootState) {
            await fetch(`${POSTS_URL}/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${rootState.token.access_token}`
                }
            }).then(res => res.json())
			dispatch.posts.asyncGetPosts()
		},
        async asyncResetState() {
			this.resetState()
		},
	}),
}