const axios = require('axios');
const fs = require('fs');

async function getSubscriberCount() {
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
      params: {
        part: 'statistics',
        id: 'UCHhpXyvjFxkKg2WYGKcvxMg',
        key: 'AIzaSyCD0u5WKys4mkmatSVwVxWA0SXJpzAKRqc', // Replace with your YouTube API key
      },
    });

    const subscriberCount = response.data.items[0].statistics.subscriberCount;
    const data = { sub: parseInt(subscriberCount) };

    fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

getSubscriberCount();
