import axios from 'axios';

export async function createSlackConversation(name: string) {
  try {
    const { data } = await axios.post(
      'https://slack.com/api/conversations.create',
      { name, is_private: true },
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
