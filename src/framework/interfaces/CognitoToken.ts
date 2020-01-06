export interface CognitoToken {
  /**
   * Subject
   * The sub claim is a unique identifier (UUID) for the authenticated user. It is not the same as the username which may not be unique.
   */
  sub: string
  /**
   * Issuer
   * The iss claim has the following format:
   * https://cognito-idp.{region}.amazonaws.com/{userPoolId}.
   *
   * For example, if you created a user pool in the us-east-1 region and its user pool ID is u123456,
   * the ID token issued for users of your user pool have an iss claim value of:
   * https://cognito-idp.us-east-1.amazonaws.com/u123456.
   */
  iss: string
  /**
   * Audience
   * The aud claim contains the client_id used in the user authenticated.
   */
  aud: string
  /**
   * Token Use
   * The token_use claim describes the intended purpose of this token. Its value is always id in the case of the ID token.
   */
  token_use: string
  /**
   * Authentication Time
   * The auth_time claim contains the time when the authentication occurred.
   * Its value is a JSON number representing the number of seconds from 1970-01-01T0:0:0Z as measured in UTC format until the date/time.
   * On refreshes, it represents the time when the original authentication occurred, not the time when the token was issued.
   */
  auth_time: number
  email_verified: boolean
  email: string
  given_name: string
  /**
   * Expiration Time
   * The tokens time of expiration represented in Unix time.
   */
  exp: number
  /**
   * Issued At
   * The tokens time of issuance represented in Unix time.
   */
  iat: number
  'cognito:username': string
  'cognito:groups'?: string[]
}
