import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

export const GenerateAccessCode = () => {
  const code = Math.floor(10000 + Math.random() * 10000);
  const expiry = new Date();
  expiry.setTime(new Date().getTime() + 30 * 60 * 1000);

  return { code, expiry };
};

export const SendVerificationCode = async (
  code: number,
  toPhonenumber: string
) => {
  const response = await client.messages.create({
    from: "+18566441017",
    body: `Your verification code is ${code}, It will expire in 30 min.`,
    to: toPhonenumber.trim(),
  });

  console.log(response, "Notification Response");
  return response;
};
