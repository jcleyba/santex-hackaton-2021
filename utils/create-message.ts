import axios from 'axios';

export async function createMessage(channel: string, text: string) {
  const { data } = await axios.post(
    'https://slack.com/api/chat.postMessage',
    {
      channel,
      text,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.SLACK_TOKEN}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return data;
}
