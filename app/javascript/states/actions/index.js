import { UserHandler } from '../../handlers'


export function updateFeatures(username) {
  return dispatch => {
    var cancelRequest    = UserHandler.cancelSource();  
    dispatch(requestFeatures(username, cancelRequest))
    return UserHandler.getFeatures(username, {cancelToken: cancelRequest.token})
          .then(response => dispatch(receivedFeatures(username, response.data)))
  }
}

export const requestFeatures = (username, cancelRequest) => ({
  type: 'REQUEST_FEATURES',
  username: username,
  cancelRequest: cancelRequest
})

export const receivedFeatures = (username, features) => ({
  type: 'RECEIVED_FEATURES',
  username: username,
  features: features
})


export const receivedNotification = (content) => ({
  type: 'RECEIVED_NOTIFICATION',
  content: content
})
