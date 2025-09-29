module.exports = (eleventyConfig) => {
    // Add YAML support
    const yaml = require('js-yaml');
    eleventyConfig.addDataExtension("yaml", contents => yaml.load(contents));
    eleventyConfig.addDataExtension("yml", contents => yaml.load(contents));

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

    // Create tags collection for blog post tags - Fixed to prevent duplicates
    eleventyConfig.addCollection("tagList", (collectionApi) => {
        const tagMap = new Map() // Use Map to track original case
        collectionApi.getAll().forEach((item) => {
            if (item.data.tags && Array.isArray(item.data.tags)) {
                item.data.tags.forEach((tag) => {
                    const normalizedTag = tag.toString().trim()
                    if (normalizedTag) {
                        const lowerTag = normalizedTag.toLowerCase()
                        // Keep the first occurrence's case (prefer lowercase if it exists)
                        if (!tagMap.has(lowerTag)) {
                            tagMap.set(lowerTag, normalizedTag)
                        } else if (normalizedTag === lowerTag) {
                            // If we find a lowercase version, prefer it
                            tagMap.set(lowerTag, normalizedTag)
                        }
                    }
                })
            }
        })
        return Array.from(tagMap.values()).sort()
    })

    // Create normalized tag collections (case-insensitive)
    eleventyConfig.addCollection("tagCollections", (collectionApi) => {
        const tagCollections = {}

        collectionApi.getAll().forEach((item) => {
            if (item.data.tags && Array.isArray(item.data.tags)) {
                item.data.tags.forEach((tag) => {
                    const normalizedTag = tag.toString().trim().toLowerCase()
                    if (normalizedTag) {
                        if (!tagCollections[normalizedTag]) {
                            tagCollections[normalizedTag] = []
                        }
                        tagCollections[normalizedTag].push(item)
                    }
                })
            }
        })

        return tagCollections
    })

    // Add date filter for formatting dates
    eleventyConfig.addFilter("date", (date, format) => {
        const d = new Date(date)
        if (format === "Y-m-d") {
            return d.toISOString().split("T")[0]
        }
        return d.toISOString()
    })

    // Add date filter for formatting dates
    eleventyConfig.addFilter("dateFormat", (date) =>
        new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        }),
    )

    // Add excerpt filter for post previews
    eleventyConfig.addFilter("excerpt", (content) => {
        if (!content) return ""
        const excerpt = content.replace(/<[^>]*>/g, "").substring(0, 200)
        return excerpt + (excerpt.length >= 200 ? "..." : "")
    })

    // Fixed slugify filter to be more robust and consistent
    eleventyConfig.addFilter("slugify", (str) => {
        if (!str) return ""
        return str
            .toString()
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "") // Remove special chars except spaces and hyphens
            .replace(/\s+/g, "-") // Replace spaces with hyphens
            .replace(/-+/g, "-") // Replace multiple hyphens with single
            .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
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