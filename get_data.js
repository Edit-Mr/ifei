/** @format */

const axios = require("axios");
const fs = require("fs");

async function getSubscriberCount() {
    try {
        const apiKey = process.argv[2];
        const channelId = "UCHhpXyvjFxkKg2WYGKcvxMg";

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
        const ceylanSub =
            ceylanResponse.data.items[0].statistics.subscriberCount;

        // Fetch the most-viewed video
        const mostViewResponse = await axios.get(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=viewCount&type=video&maxResults=1&key=${apiKey}`
        );
        const mostView = {
            title: mostViewResponse.data.items[0].snippet.title,
            videoId: mostViewResponse.data.items[0].id.videoId,
            description: mostViewResponse.data.items[0].snippet.description,
            thumbnail:
                mostViewResponse.data.items[0].snippet.thumbnails.high.url,
            releaseDate: mostViewResponse.data.items[0].snippet.publishedAt,
        };

        // Fetch the latest video
        const latestVideoResponse = await axios.get(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&order=date&type=video&maxResults=10&key=${apiKey}`
        );

        // Find the latest non-streaming or non-shorts video
        let latestVideo;
        for (let i = 0; i < latestVideoResponse.data.items.length; i++) {
            const video = latestVideoResponse.data.items[i];
            if (video.snippet.liveBroadcastContent !== "live" && video.snippet.categoryId !== "10") {
                latestVideo = {
                    title: video.snippet.title,
                    videoId: video.id.videoId,
                    description: video.snippet.description,
                    thumbnail: video.snippet.thumbnails.high.url,
                    releaseDate: video.snippet.publishedAt,
                };
                break;
            }
        }

        console.log(latestVideo);

        // Fetch the latest comment
        let latestCommentResponse;
        let latestComment;

        for (let i = 0; i < latestVideoResponse.data.items.length; i++) {
            const video = latestVideoResponse.data.items[i];
            try {
                latestCommentResponse = await axios.get(
                    `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${video.id.videoId}&order=time&maxResults=1&key=${apiKey}`
                );
                latestComment = {
                    comment: latestCommentResponse.data.items[0].snippet.topLevelComment.snippet.textDisplay,
                    author: latestCommentResponse.data.items[0].snippet.topLevelComment.snippet.authorDisplayName,
                    authorProfile: latestCommentResponse.data.items[0].snippet.topLevelComment.snippet.authorChannelUrl,
                    authorProfilePhoto: latestCommentResponse.data.items[0].snippet.topLevelComment.snippet.authorProfileImageUrl,
                };
                break;
            } catch (error) {
                if (error.response && error.response.status === 403) {
                    console.log(`Permission denied for video ${video.id.videoId}. Trying the next video...`);
                } else {
                    console.error("Error:", error.message);
                    process.exit(1);
                }
            }
        }

        console.log(latestComment);
        const data = {
            ifeiSub: parseInt(ifeiSub),
            ceylanSub: parseInt(ceylanSub),
            date: new Date().toLocaleString("zh-TW", {
                timeZone: "Asia/Taipei",
            }),
            viewCount: parseInt(viewCount),
            videoCount: parseInt(videoCount),
            mostView: mostView,
            latestVideo: latestVideo,
            latestComment: latestComment,
        };

        fs.writeFileSync("./public/data.json", JSON.stringify(data, null, 2));
        } catch (error) {
        console.error("Error:", error.message);
        process.exit(1);
        }
        }

        getSubscriberCount();
