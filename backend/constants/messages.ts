const AUTH_MESSAGE = {
  VALIDATION_ERROR: 'Validation error',
  NAME_IS_REQUIRED: 'Name is required',
  NAME_MUST_BE_A_STRING: 'Name must be a string',
  NAME_LENGTH_MUST_BE_FROM_2_TO_100: 'Name length must be from 2 to 100 characters',
  USER_NAME_IS_REQUIRED: 'Username is required',
  FULLNAME_IS_REQUIRED: 'Fullname is required',
  PASSOWRD_IS_REQUIRED: 'Password is required',
  PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50: 'Password length must be from 6 to 50 characters',
  PASSWORD_MUST_BE_A_STRING: 'Password must be a string',
  PASSWORD_MUST_BE_STRONG:
    'Password must contain at least one uppercase, one lowercase and one special character, minimum length 6',
  CONFIRM_PASSWORD_IS_REQUIRED: 'Confirm password is required',
  CONFIRM_PASSWORD_DOESN_NOT_MATCH_PASSWORD: 'Confirm password does not match password',
  DATE_OF_BIRTH_IS_REQUIRED: 'Date of birth is required',
  DATE_OF_BIRTH_MUST_BE_A_ISO8601: 'Date of birth must be a ISO8601',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  EMAIL_IS_REQUIRED: 'Email is required',
  EMAIL_IS_INVALID: 'Email is invalid',
  EMAIL_OR_PASSWORD_IS_INCORRECT: 'Email or password is incorrect',
  EMAIL_IS_NOT_EXISTS: 'Email is not exists',
  LOGIN_SUCCESS: 'Login is successfully',
  REGISTER_SUCCESS: 'Register is successfully',
  ACCESS_TOKEN_IS_REQUIRED: 'Access token is required',
  ACCESS_TOKEN_IS_MALFORMED: 'Access token is malformed',
  REFRESH_TOKEN_IS_REQUIRED: 'Refresh token is required',
  REFRESH_TOKEN_IS_USED_OR_NOT_EXIST: 'Refresh token is used or not exist',
  REFRESH_TOKEN_IS_SUCCESSFULLY: 'Refresh token is successfully',
  EMAIL_VERIFY_TOKEN_IS_REQUIRED: 'Email verify token is required',
  USER_NOT_FOUND: 'User not found',
  EMAIL_ALREADY_VERIFY_BEFORE: 'Email already verify before',
  EMAIL_VERIFY_IS_SUCCESSFULLY: 'Email verify is successfully',
  FORGOT_PASSWORD_TOKEN_IS_REQUIRED: 'Forgot password token is required',
  INVALID_FORGOT_PASSWORD_TOKEN: 'Invalid forgot password token',
  VERIFY_FORGOT_PASSWORD_IS_SUCCESSFULLY: 'Verify forgot password is successfully',
  RESET_PASSWORD_IS_SUCCESSFULLY: 'Reset password is successfully',
  GET_PROFILE_USER_IS_SUCCESSFULLY: 'Get profile user is successfully',
  USER_HAVE_NOT_VERIFIED: 'User have not veryfied',
  BIO_MUST_BE_A_STRING: 'Bio must be a string',
  BIO_LENGTH_MUST_BE_FROM_2_TO_200: 'Bio length must be from 2 to 200',
  USERNAME_MUST_BE_A_STRING: 'Username must be a string',
  USERNAME_LENGTH_MUST_BE_FROM_4_TO_50: 'Username length must be from 4 to 50',
  IMAGE_URL_MUST_BE_A_STRING: 'Image url must be a string',
  UPDATE_PROFILE_IS_SUCCESSFULLY: 'Update profile is successfully',
  FOLLOWED: 'followed',
  FOLLOW_IS_SUCCESSFULLY: 'follow is successfully',
  UNFOLLOW_IS_SUCCESSFULLY: 'unfollow is successfully',
  INVALID_FOLLOWED_USER_ID: 'Invalid followed user id',
  INVALID_USER_ID: 'Invalid user id',
  YOU_HAVE_NOT_FOLLOWED_THIS_USER: 'You have not followed this user',
  INVALID_USERNAME:
    'username must be 4-15 characters long and contain only letters, numbers, and underscores, not only numbers',
  USERNAME_ALREADY_EXISTS: 'Username already exists',
  OLD_PASSWORD_IS_INCORRECT: 'Old password is incorrect',
  OLD_PASSWORD_IS_REQUIRED: 'Old password is required',
  UPDATE_PASSWORD_IS_SUCCESSFULLY: 'Update password is successfully',
  GMAIL_NOT_VERIFIED: 'Gmail not verified',
  UPLOAD_IMAGE_IS_SUCCESSFULLY: 'Upload image is successfully',
  UPLOAD_VIDEO_IS_SUCCESSFULLY: 'Upload video is successfully',
  RANGE_IS_REQUIRED: 'Range is required',
  LOGOUT_SUCCESS: 'Logout successfully'
} as const

const USER_MESSAGE = {
  GET_PROFILE_SUCCESS: 'Get profile successfully',
  FOLLOWED_USER_ID_MUST_BE_A_VALID_OBJECT_ID: 'Followed user id must be a valid ObjectId',
  YOU_CAN_NOT_FOLLOW_OR_UNFOLLOW_YOURSELF: "You can't follow / unfollow yourself",
  USER_FOLLOWED_SUCCESSFULLY: 'User followed successfully ',
  USER_UNFOLLOWED_SUCCESSFULLY: 'User unfollowed successfully ',
  GET_SUGGESTED_USER_SUCCESSFULLY: 'Get suggested user successfully',
  PLEASE_PROVIDE_BOTH_CURRENT_AND_NEW_PASSWORD: 'Please provide both current password and new password',
  CURRENT_PASSWORD_IS_INCORRECT: 'Current password is incorrect',
  USERNAME_ALREADY_EXISTS: 'Username already exists, Let try another username',
  UPDATE_PROFILE_SUCCESS: 'Update profile successfully'
} as const

const POST_MESSAGE = {
  IMAGE_IS_REQUIRED: 'Image is required, Post must have img',
  TEXT_IS_REQUIRED: 'Text is required, Post must have text',
  CREATE_POST_SUCCESSFULLY: 'Post created successfully',
  POST_NOT_FOUND_OR_ALREADY_DELETED: 'Post not found or already deleted',
  USER_IS_NOT_AUTHORIZED_TO_DELTE_THIS_POST: 'User is not authorized to delete this post',
  POST_DELETED_SUCCESSFULLY: 'Post deleted successfully',
  POST_ID_MUST_BE_A_VALID_OBJECT_ID: 'Post id must be a valid object id',
  COMMENT_SUCCESSFULLY: 'Comment successfully',
  POST_UNLIKED_SUCCESSFULLY: 'Post unliked successfully',
  POST_LIKED_SUCCESSFULLY: 'Post liked successfully',
  ALL_POST_GOT_SUCCESSFULLY: 'All posts got successfully',
  LIKED_POST_GOT_SUCCESSFULLY: 'Liked posts got successfully',
  FOLLOWING_POST_GOT_SUCCESSFULLY: 'Following posts got successfully',
  USER_POST_GOT_SUCCESSFULLY: 'User posts got successfully'
}

const BOOKMARK_MESSAGE = {
  BOOKMARK_SUCCESSFULLY: 'Bookmark successfully',
  UNBOOKMARK_SUCCESSFULLY: 'Unbookmark successfully'
} as const

const LIKE_MESSAGE = {
  LIKE_SUCCESSFULLY: 'Like successfully',
  UNLIKE_SUCCESSFULLY: 'Unlike successfully',
  YOU_HAVE_NOT_LIKE_THIS_POST: 'You have not like this post'
}

export { AUTH_MESSAGE, USER_MESSAGE, POST_MESSAGE, BOOKMARK_MESSAGE, LIKE_MESSAGE }
