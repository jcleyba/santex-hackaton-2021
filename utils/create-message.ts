import axios from 'axios';

export async function createMessage(channel: string, text: string) {
  try {
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
  } catch (e) {
    console.error('Error: ', e);
  }
}
