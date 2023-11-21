/** @format */

const axios = require("axios");
const fs = require("fs");

async function getSubscriberCount() {
    try {
        const apiKey = "YOUR_API_KEY"; // Replace with your actual API key
        const channelId = "YOUR_CHANNEL_ID"; // Replace with your actual channel ID

        // Fetch channel statistics
        const response = await axios.get(
            `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`
        );
        const ifeiSub = response.data.items[0].statistics.subscriberCount;
        const viewCount = response.data.items[0].statistics.viewCount;
        const videoCount = response.data.items[0].statistics.videoCount;

        // Fetch Ceylan subscriberCount
        const ceylanResponse = await axios.get(
            `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=UCVjmBo22Mimyc4NR4Nz89MA&key=${apiKey}`
        );
        const ceylanSub = ceylanResponse.data.items[0].statistics.subscriberCount;

        // Fetch the most-viewed video
        const mostViewResponse = await axios.get(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=viewCount&type=video&maxResults=1&key=${apiKey}`
        );
        const mostView = {
            title: mostViewResponse.data.items[0].snippet.title,
            videoId: mostViewResponse.data.items[0].id.videoId,
            description: mostViewResponse.data.items[0].snippet.description,
            thumbnail: mostViewResponse.data.items[0].snippet.thumbnails.high.url,
            releaseDate: mostViewResponse.data.items[0].snippet.publishedAt,
        };

        // Fetch the latest video
        const latestVideoResponse = await axios.get(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=1&key=${apiKey}`
        );
        const latestVideo = {
            title: latestVideoResponse.data.items[0].snippet.title,
            videoId: latestVideoResponse.data.items[0].id.videoId,
            description: latestVideoResponse.data.items[0].snippet.description,
            thumbnail: latestVideoResponse.data.items[0].snippet.thumbnails.high.url,
            releaseDate: latestVideoResponse.data.items[0].snippet.publishedAt,
        };

        // Fetch the total watch hours
        const videosResponse = await axios.get(
            `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&chart=mostPopular&regionCode=US&maxResults=100&key=${apiKey}`
        );
        const videos = videosResponse.data.items;
        let totalWatchHours = 0;
        videos.forEach((video) => {
            const duration = video.contentDetails.duration;
            const hours = parseInt(duration.match(/(\d+)H/)?.[1]) || 0;
            const minutes = parseInt(duration.match(/(\d+)M/)?.[1]) || 0;
            const seconds = parseInt(duration.match(/(\d+)S/)?.[1]) || 0;
            const watchTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
            totalWatchHours += watchTimeInSeconds / 3600;
        });

        const data = {
            ifeiSub: parseInt(ifeiSub),
            ceylanSub: parseInt(ceylanSub),
            date: new Date().toLocaleString("zh-TW", {
                timeZone: "Asia/Taipei",
            }),
            viewCount: parseInt(viewCount),
            videoCount: parseInt(videoCount),
            totalWatchHours: parseFloat(totalWatchHours),
            mostView: mostView,
            latestVideo: latestVideo,
        };

        fs.writeFileSync("./public/data.json", JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error:", error.message);
        process.exit(1);
    }
}

getSubscriberCount();