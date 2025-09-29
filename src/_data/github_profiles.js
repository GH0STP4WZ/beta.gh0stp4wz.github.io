const EleventyFetch = require("@11ty/eleventy-fetch");

async function fetchGithubProfile(username) {
    try {
        const data = await EleventyFetch(`https://api.github.com/users/${username}`, {
            duration: "1d", // Cache for 1 day
            type: "json"    // Parse JSON response
        });
        
        return {
            name: data.name || data.login,
            quote: data.bio ? `"${data.bio}"` : `"GitHub Developer"`,
            url: data.html_url,
            avatar: data.avatar_url
        };
    } catch (e) {
        console.warn(`Failed to fetch GitHub profile for ${username}:`, e);
        return null;
    }
}

async function isGithubUrl(url) {
    return url.toLowerCase().includes('github.com/');
}

async function extractGithubUsername(url) {
    const match = url.match(/github\.com\/([^\/]+)/i);
    return match ? match[1] : null;
}

module.exports = async function() {
    const yaml = require('js-yaml');
    const fs = require('fs');
    const path = require('path');

    // Read the friends_base.yaml file
    const friendsPath = path.join(__dirname, 'friends_base.yaml');
    const friendsData = yaml.load(fs.readFileSync(friendsPath, 'utf8'));

    // Process each friend
    const processedFriends = await Promise.all(
        friendsData.map(async (friend) => {
            // If it's a GitHub URL, fetch the profile
            if (await isGithubUrl(friend.url)) {
                const username = await extractGithubUsername(friend.url);
                if (username) {
                    const githubProfile = await fetchGithubProfile(username);
                    if (githubProfile) {
                        // Merge GitHub data with existing data, preferring existing data if set
                        return {
                            ...githubProfile,
                            ...friend,
                            // Always use GitHub avatar if it's a GitHub profile
                            avatar: githubProfile.avatar
                        };
                    }
                }
            }
            return friend;
        })
    );

    return processedFriends;
};