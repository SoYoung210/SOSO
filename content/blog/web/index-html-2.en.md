---
title: 'Revisiting index.html - Part 2'
date: 2020-02-22 16:00:09
category: web
thumbnail: './images/thumbnail2.png'
---

![image-thumbnail](./images/thumbnail2.png)

[Part 1](https://so-so.dev/web/index-html-1/) covered the link tag and the script tag. This time we're covering OpenGraph (og from here on), favicon, charset, and lang.

## OpenGraph Protocol

![og-logo](./images/og-image.png)

The OpenGraph Protocol (og for short) is Facebook's spec for how to write _an HTML document's metadata_. When you share a url, the title, thumbnail, and everything else you see get pulled together by that site's bot, based on the og info it finds.

## 🖼 What shows up when you share a URL

Share a web page's url, and you'll see something like this, though it varies a bit by platform.

![thumbnail_example](./images/thumbnail_example.png)

So where does each piece actually come from?

### Title

'Revisiting index.html - Part 1' is the content of the document's `<meta property="og:title">`. Open the [link](https://so-so.dev/web/index-html-1/) and check dev tools, and you'll see this.

![title_example](./images/title_example.png)

### description

That's the content of `<meta property="og:description">`. In the screenshot above it's been truncated with an ellipsis because the description ran long.

![description_example](./images/description_example.png)

### thumbnail(og:image)

This one's the content of `<meta property="og:image">`. The catch with `og:image` is that its content has to spell out **exactly** what the bot needs, nothing vague.

```html
<!-- ❌ An absolute path for the image gets treated as invalid og:image info -->
<meta property="og:image" content="/static/image.png">

<!-- ⭕️ A correct example -->
<meta property="og:image" content="https://so-so.dev/static/image.png">
```

> On this blog, I use _siteUrl_ to write it out [like this]([https://github.com/SoYoung210/SOSO/blob/0321ca7b6fa8edf6965faead85ea9953b942ffad/src/components/head/index.jsx#L39](https://github.com/SoYoung210/SOSO/blob/0321ca7b6fa8edf6965faead85ea9953b942ffad/src/components/head/index.jsx#L39)).
> ![thumbnail_tag_example](./images/thumbnail_tag_example.png)

Filling in this page info isn't just about how it looks when a url gets shared. It also feeds into search results and pushes your SEO score up.

![search_result](./images/search_result.png)

## 🤖 Favicon

Open any page in Chrome, and you'll spot a small icon sitting right next to the tab's title.

That's the `favicon`.

![favicon_example](./images/favicon_example.png)

Drop in an icon file with an `ico` or `png` extension and write this, and your site has a favicon.

```html
<link rel="shortcut icon" href="favicon.ico" type="image/x-icon">
```

> Supporting IE means the _ico_ format is non-negotiable.

An ico favicon can hold multiple sizes in one file, so you just pack them all in and go. A png favicon can't do that, so you have to declare every size you need separately, like below.

```html
<link rel="icon" href="favicon-32.png" sizes="32x32">
<link rel="icon" href="favicon-16.png" sizes="16x16">
<link rel="icon" href="favicon-48.png" sizes="48x48">
<link rel="icon" href="favicon-64.png" sizes="64x64">
<link rel="icon" href="favicon-128.png" sizes="128x128">
```

With a png favicon, here's which one each browser actually picks:

- Firefox and Safari go with whichever favicon is declared last.
- Chrome on Mac reaches for the 32x32 favicon unless there's an ico one available.
- Chrome on Windows falls back to the ico favicon unless a 16x16 is declared first.
- If none of the above are available, both Chromes take whichever is declared first, while Firefox and Safari take whichever is declared last. Chrome on Mac, in practice, actually ignores 16x16 entirely and only pulls in the 32x32 favicon when it needs to shrink one down for a non-retina display.
- Opera just picks one of the available icons more or less at random.

so-so.dev also ships a whole set of files under the name `apple-touch-icon`, which cover things like the iOS home-screen shortcut icon and Safari bookmarks.

![apple_touch_tag](./images/apple_touch_tag.png)

## 👻 Invisible pieces that still matter

The head isn't only home to things you're meant to notice. Some of its most important pieces never show themselves at all.

### charset

This sets the encoding a page will accept. Almost everyone uses `utf-8`, because it covers a huge range of characters: Korean, English, Japanese, and plenty more.

![charset-1](./images/charset-1.png)

Switch it to `ISO-8859-1` for Latin characters instead, and the page above stops rendering correctly.

![charset-2](./images/charset-2.png)

### lang

`lang` is the attribute that sets a page's language. Below, in order: default, ko, ja (Japanese), and zh (Chinese). Same sans-serif font, but it renders noticeably differently depending on the language.

![lang](./images/lang.png)

Get the `lang` attribute right, and you avoid font-rendering issues down the line.

> Source: [Font-rendering problems you'll run into once you ship a global service](https://drive.google.com/file/d/1abjV5imziJNg62ZE5dH5LS4VJK0f3nZf/view)

Usually you set `lang` once, on `<html>` at the very top of the document, but if one specific tag needs a different language, you can scope it like this.

```html
<p>Japanese example: <span lang="jp">ご飯が熱い。</span>.</p>
```

### 📝[TIP] Facebook and Twitter thumbnails

Thumbnails don't render the same way everywhere. Let's compare Facebook and Twitter.

You can preview exactly how any link will look, before you even share it, at these sites.

- [Facebook debugger](https://developers.facebook.com/tools/debug/)
- [Twitter validator](https://cards-dev.twitter.com/validator)

### Facebook

Facebook supports two thumbnail shapes.
> See [Facebook's image requirements](https://developers.facebook.com/docs/sharing/webmasters/images#requirements) and the [Facebook link-sharing FAQ](https://developers.facebook.com/docs/sharing/webmasters/faq?locale=ko_KR).

- large (600 x 315 pixels or bigger)
![facebook-large](./images/facebook-large.png)

- small (anything smaller than 600 x 315)
![facebook-large](./images/facebook-small.png)

If your thumbnail unexpectedly shows up `small`, open dev tools, grab the actual image behind `og:image`'s content, and check its dimensions. **It's almost certainly been compressed down below 600, for one reason or another.**

### Twitter

Twitter shows thumbnails as a Card, so on top of `og:image` you also need Twitter-specific meta tags.

1. Which image becomes the thumbnail (og:image)
2. How it's rendered as a card (meta tag)
Check [Twitter's card guide](https://developer.twitter.com/en/docs/tweets/optimize-with-cards/guides/getting-started) and you'll see a `<meta name="twitter:card">` tag is mandatory.

![twitter-empty-card](./images/twitter-empty-card.png)

The example above has meta tag info but no `og:image` at all.
> Platforms like Facebook or KakaoTalk will sometimes fill in a missing _og:image_ "on their own," but Twitter **flatly refuses to show a thumbnail without one.**

- large(summary_large_image)
![twitter-large](./images/twitter-large.png)

Want the large card look? Set `twitter:card`'s content to `summary_large_image`.

- small(summary)
![twitter-small](./images/twitter-small.png)

Set it to `summary` instead, and it renders small, like above.

## Ref

- [https://developer.mozilla.org/ko/docs/Learn/HTML/Introduction_to_HTML/The_head_metadata_in_HTML](https://developer.mozilla.org/ko/docs/Learn/HTML/Introduction_to_HTML/The_head_metadata_in_HTML)

- [https://drive.google.com/file/d/1abjV5imziJNg62ZE5dH5LS4VJK0f3nZf/view](https://drive.google.com/file/d/1abjV5imziJNg62ZE5dH5LS4VJK0f3nZf/view)

- [https://webdir.tistory.com/337](https://webdir.tistory.com/337)
