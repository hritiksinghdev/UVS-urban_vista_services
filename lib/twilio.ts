import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID || 'AC_dummy_sid'
const authToken = process.env.TWILIO_AUTH_TOKEN || 'dummy_token'

export const twilioClient = twilio(accountSid, authToken)
export const TWILIO_PHONE = process.env.TWILIO_PHONE_NUMBER!
