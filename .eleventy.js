module.exports = (eleventyConfig) => {
    // Copy static assets
    eleventyConfig.addPassthroughCopy("src/assets")
    eleventyConfig.addPassthroughCopy("src/css")
    eleventyConfig.addPassthroughCopy("src/js")

    // Watch CSS files for changes
    eleventyConfig.addWatchTarget("src/css/")

    // Configure markdown processing
    const markdownIt = require("markdown-it")
    const markdownItAnchor = require("markdown-it-anchor")
    const markdownItToc = require("markdown-it-toc-done-right")

    const markdownLib = markdownIt({
        html: true,
        breaks: true,
        linkify: true,
    })
        .use(markdownItAnchor, {
            permalink: markdownItAnchor.permalink.ariaHidden({
                placement: "after",
            }),
        })
        .use(markdownItToc)

    eleventyConfig.setLibrary("md", markdownLib)

    // Create posts collection from markdown files in posts folder
    eleventyConfig.addCollection("posts", (collectionApi) =>
        collectionApi.getFilteredByGlob("src/posts/*.md").sort((a, b) => {
            return new Date(b.data.date) - new Date(a.data.date)
        }),
    )

    // Create tags collection for blog post tags (filtered to avoid system tags)
    eleventyConfig.addCollection("tagList", (collectionApi) => {
        const tagSet = new Set()
        // Only get tags from actual blog posts, not from other templates
        collectionApi.getFilteredByGlob("src/posts/*.md").forEach((item) => {
            if (item.data.tags) {
                item.data.tags
                    .filter(tag => {
                        // Filter out system tags that shouldn't have tag pages
                        const systemTags = ['all', 'nav', 'post', 'posts', 'page', 'pages'];
                        return !systemTags.includes(tag) && typeof tag === 'string';
                    })
                    .forEach((tag) => tagSet.add(tag))
            }
        })
        return Array.from(tagSet).sort()
    })

    // Add date filter for formatting dates
    eleventyConfig.addFilter("dateFormat", (date) =>
        new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        }),
    )

    eleventyConfig.addFilter("date", function(dateObj, format) {
        const date = new Date(dateObj);
        if (format === 'Y-m-d') {
            return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
        }
        return date.toISOString().split('T')[0]; // Default to YYYY-MM-DD
    });

    // Add excerpt filter for post previews
    eleventyConfig.addFilter("excerpt", (content) => {
        const excerpt = content.replace(/<[^>]*>/g, "").substring(0, 200)
        return excerpt + (excerpt.length >= 200 ? "..." : "")
    })

    // Set custom directories for input, output, includes, and data
    return {
        dir: {
            input: "src",
            includes: "_includes",
            data: "_data",
            output: "_site",
        },
        markdownTemplateEngine: "njk",
        htmlTemplateEngine: "njk",
    }
}