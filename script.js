const apiKey = 'AIzaSyD2h5mR0OrZY8adoxSmsWo6PSgZY3mQHZs'; // Replace with your actual API key
const channelId = 'UCHhpXyvjFxkKg2WYGKcvxMg';

// Function to fetch channel statistics
const fetchChannelStatistics = () => {
  const apiUrl = `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`;

  return fetch(apiUrl)
    .then(response => response.json())
    .then(data => data.items[0].statistics)
    .catch(error => console.error('Error fetching channel statistics:', error));
};

// Function to fetch the most-viewed video
const fetchMostViewedVideo = () => {
  const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=viewCount&type=video&maxResults=1&key=${apiKey}`;
console.log(apiUrl)
  return fetch(apiUrl)
    .then(response => response.json())
    .then(data => data.items[0].snippet)
    .catch(error => console.error('Error fetching most-viewed video:', error));
};

// Function to fetch the latest video
const fetchLatestVideo = () => {
  const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=1&key=${apiKey}`;
  console.log(apiUrl)
  return fetch(apiUrl)
    .then(response => response.json())
    .then(data => data.items[0].snippet)
    .catch(error => console.error('Error fetching latest video:', error));
};

// Function to calculate total watch hours
const calculateTotalWatchHours = (videoCount, averageWatchTime) => {
  // Assuming averageWatchTime is in seconds
  const totalSeconds = videoCount * averageWatchTime;
  const totalHours = totalSeconds / 3600;

  return totalHours;
};

// Get channel statistics
fetchChannelStatistics()
  .then(statistics => {
    const subscriberCount = statistics.subscriberCount;
    const viewCount = statistics.viewCount;
    const videoCount = statistics.videoCount;

    console.log(`Subscriber Count: ${subscriberCount}`);
    console.log(`View Count: ${viewCount}`);
    console.log(`Video Count: ${videoCount}`);
  })
  .then(() => {
    // Get most-viewed video
    return fetchMostViewedVideo();
  })
  .then(mostViewedVideo => {
    console.log('Most-Viewed Video:');
    console.log(`Title: ${mostViewedVideo.title}`);
    console.log(`Video ID: ${mostViewedVideo.videoId}`);
  })
  .then(() => {
    // Get latest video
    return fetchLatestVideo();
  })
  .then(latestVideo => {
    console.log('Latest Video:');
    console.log(`Title: ${latestVideo.title}`);
    console.log(`Video ID: ${latestVideo.videoId}`);
  })
  .catch(error => console.error('Error:', error));
