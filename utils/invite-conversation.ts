import axios from 'axios';

export async function inviteToSlackConversation(
  channel: string,
  users: string[]
) {
  const { data } = await axios.post(
    'https://slack.com/api/conversations.invite',
    {
      channel,
      users,
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
