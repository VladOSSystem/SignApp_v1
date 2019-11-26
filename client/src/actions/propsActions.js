import { FETCH_POSTS, NEW_POST } from './types';

export const fetchPosts = () => dispatch => {
    let posts = {}
      dispatch({
        type: FETCH_POSTS,
        payload: posts
      })
 };

export const createPost = postData => dispatch => {
      dispatch({
        type: NEW_POST,
        payload: postData
      })
};