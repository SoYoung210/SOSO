---
title: 'Navigator Knowledge Worth Knowing'
date: 2020-03-27 08:00:09
category: web
thumbnail: './images/navigator/thumbnail.png'
---

![image-thumbnail](./images/navigator/thumbnail.png)

In frontend development, using the `navigator` object is unavoidable. This post looks at various properties of the navigator object.

The `navigator` object holds not only the well-known User Agent but also various pieces of information about the user's state. Navigator's properties can only be accessed as read-only.

## [react-adaptive-hooks](https://github.com/GoogleChromeLabs/react-adaptive-hooks)

These are hooks built by ChromeLabs that hold information about the user's device and network environment. This hooks code was built using several properties of the navigator object.

In this post, we'll look at which navigator properties are "worth knowing," including the ones react-adaptive-hooks uses.

## Before We Begin

Some properties have very limited browser support. I've split them into three tiers based on their support range.

- 🚨: Deprecated
- ⚠️: Not supported in a few browsers
- ✅: Supported in most browsers, or 100% support

## [⚠️ connection](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/connection)

Provides information about the network environment the user is currently on, and lets you check the following information.

```ts
navigator.connection
---
[Result]
NetworkInformation: {
 onchange: null
 effectiveType: "4g"
 rtt: 100
 downlink: 10
 saveData: false
}
```

- **onchange:** The change event handler for the connection object. It can be used as follows.

```js
// Browser Support
const connection = navigator.connection
|| navigator.mozConnection
|| navigator.webkitConnection;

function updateConnectionStatus() {
  alert("Connection bandwidth: " + connection.effectiveType + " MB/s");
}

connection.addEventListener("change", updateConnectionStatus);
updateConnectionStatus();
```

!['./images/navigator/navigator1.gif'](./images/navigator/navigator1.gif)

- **effectiveType:** Returns one of slow-2g, 2g, 3g, or 4g depending on the current network conditions. It's determined by combining the round-trip value and downlink value from the most recent network communication.
- **rtt:** The estimated round-trip time, rounded to the nearest multiple of 25ms.
- **downlink:** The estimated bandwidth, rounded to the nearest multiple of 25KB per second and then converted to MB (Megabytes).
- **saveData:** Whether the user has "battery saving mode" enabled.

The photo below was taken after switching from a 4g network connection to Fast 3G in the Chrome Network tab. You can actually see the effectiveType and downlink values change.

!['./images/navigator/navigator9.png'](./images/navigator/navigator9.png)

### Browser Support

This feature is currently experimental, so browser support is limited.

!['./images/navigator/navigator2.png'](./images/navigator/navigator2.png)

- [Can I use](https://caniuse.com/#search=navigator.connection)

## ✅ [geolocation](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation)

A property for the user's location information. It's only available if the user has granted location access permission in their device settings.

- [getCurrentPosition](https://developer.mozilla.org/ko/docs/Web/API/Geolocation/getCurrentPosition): Retrieves the current location.

```js
navigator.geolocation.getCurrentPosition(function(position) {
  console.log(position);
}, err => console.log(err));

---
[Result]
coords: {
 latitude: longitude
 longitude: latitude
 altitude: altitude
 accuracy: latitude/longitude accuracy
 altitudeAccuracy: accuracy of the altitude
 heading: A number representing the direction of travel. The angle deviated clockwise from true north (true north: 0, east: 90)
 speed: speed
}

timestamp: 1500000000
```

- [watchPosition](https://developer.mozilla.org/ko/docs/Web/API/Geolocation/watchPosition): The callback function runs every time the device's location changes. It can be used as follows.

```js
function success(pos) {
 console.log(pos.coords.latitude, pos.coords.longitude)
}

function error(err) {
  console.warn('ERROR(' + err.code + '): ' + err.message);
}

navigator.geolocation.watchPosition(success, error);
```

> [Can I Use](https://caniuse.com/#search=geolocation)

## 🚨 [getBattery()](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/getBattery)

Information about the device's battery. This function returns a Promise and can be used as follows.

```js
navigator.getBattery().then(res => console.log(res))

---
[Result]
charging: true
chargingTime: 0
dischargingTime: Infinity
level: 1
onchargingchange: null
onchargingtimechange: null
ondischargingtimechange: null
onlevelchange: null
```

- **charging:** Indicates whether the device is currently charging.
- **chargingTime:** The time remaining until the battery is fully charged, in seconds. If it's 0, charging is complete.
- **dischargingTime:** The time remaining, in seconds, until the battery is fully discharged and the system shuts down.
- **level:** The charge level, expressed as a value between 0.0 and 1.0.
- **onchargingchange:** The event handler for the [chargingchange](https://developer.mozilla.org/ko/docs/Web/Events/chargingchange) event. This event fires when the battery's charging state changes. It can be used as follows.

```js
navigator.getBattery().then(battery => {
  battery.addEventListener('chargingchagne', () => {
    console.log('Battery Charging' + battery.charging ? 'yes' : 'no')
  })
})
```

The callback function runs every time the battery's charging state changes.

- **ondischargingtimechange, ondischargingtimechange, onlevelchange:** These are, respectively, the event handlers for [chargingtimechange](https://developer.mozilla.org/en-US/docs/Web/API/BatteryManager/onchargingtimechange), [dischargingtimechange](https://developer.mozilla.org/en-US/docs/Archive/Events/dischargingtimechange), and [levelchange](https://developer.mozilla.org/en-US/docs/Archive/Events/levelchange).

### DEPRECATED

The `getBattery` API has been DEPRECATED and may not work in the latest browser versions. It was phased out due to privacy policy concerns.

!['./images/navigator/navigator3.png'](./images/navigator/navigator3.png)

## ✅ [cookieEnabled](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/cookieEnabled)

Indicates whether cookies are enabled. If the user has set "block cookies" in their browser settings, this value is false.

> [Can I use](cookieEnabled)

## ✅ [language](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorLanguage/language)

Returns the language configured on the device.

!['./images/navigator/navigator4.png'](./images/navigator/navigator4.png)

In Chrome, this is based on whichever language is listed at the top under "Settings > Languages." If it's set to "Korean," `navigator.language` is `ko`, and if it's set to "English (United States)," it's `en-US`.

> [Can I use](https://caniuse.com/#search=geolocation)

## [⚠️ mediaCapabilities](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/mediaCapabilities)

Returns information about whether the device can encode or decode a given format.

### **encodingInfo**

This can only be used if the user has enabled the feature; in Chrome, it can be toggled in [settings](chrome://flags/#enable-experimental-web-platform-features).

```js
//Create media configuration to be tested
const mediaConfig = {
    type : 'record', // or 'transmission'
    video : {
        contentType : "video/webm;codecs=vp8.0", // valid content type
        width : 1920,     // width of the video
        height : 1080,    // height of the video
        bitrate : 120000, // number of bits used to encode 1s of video
        framerate : 48   // number of frames making up that 1s.
     }
};

// check support and performance
navigator.mediaCapabilities.encodingInfo(mediaConfig).then(result => {
    console.log('This configuration is ' +
        (result.supported ? '' : 'not ') + 'supported, ' +
        (result.smooth ? '' : 'not ') + 'smooth, and ' +
        (result.powerEfficient ? '' : 'not ') + 'power efficient.')
});
```

If you enable the feature and run the code above, you'll see the result **"This configuration is supported, not smooth, and not power efficient."**

> If it's not enabled, an `Uncaught TypeError` occurs.

### **decodingInfo**

```js
navigator.mediaCapabilities.decodingInfo({
    type : 'file',
    audio : {
        contentType : "audio/mp3",
        channels : 2,
        bitrate : 132700,
        samplerate : 5200
    }
}).then(function(result) {
  console.log('This configuration is ' +
        (result.supported ? '' : 'not ') + 'supported, ' +
        (result.smooth ? '' : 'not ') + 'smooth, and ' +
        (result.powerEfficient ? '' : 'not ') + 'power efficient.')
});
```

decodingInfo doesn't require enabling any separate feature. As of Chrome 80, running the code above results in **"This configuration is supported, smooth, and power efficient."**

### Browser Support

This feature is still experimental, so it's only supported in some browsers.

!['./images/navigator/navigator5.png'](./images/navigator/navigator5.png)

> [Can I use](https://caniuse.com/#search=mediaCapabilities)

## [⚠️ maxTouchPoints](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/maxTouchPoints)

Returns how many points the device can register touches at simultaneously. It's based on [TouchEvent](https://developer.mozilla.org/en-US/docs/Web/API/TouchEvent), so on a PC, Chrome returns 0 in desktop mode and 1 in mobile mode.

You can try this out on [CodePen](https://codepen.io/soyoung210/pen/GRJPoaV).

```js
// PC - Desktop mode
navigator.maxTouchPoints // result: 0

// PC - Mobile mode
navigator.maxTouchPoints // result: 1

// Mobile Device - iPhoneX
navigator.maxTouchPoints // result: 5
```

### Browser Support

[Can I use](https://caniuse.com/#feat=mdn-api_navigator_maxtouchpoints) says there are limitations in Safari, but in practice it works fine.

!['./images/navigator/navigator6-1.png'](./images/navigator/navigator6-1.png)
!['./images/navigator/navigator6.png'](./images/navigator/navigator6.png)

## [✅ onLine](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorOnLine/onLine)

Returns whether the device is currently connected to the internet.

```js
// Internet connected
navigator.onLine //true

// Internet disconnected
navigator.onLine // false
```

### Browser Support

Available in most browsers, but there are limitations in IE8.

!['./images/navigator/navigator7.png'](./images/navigator/navigator7.png)

> [Can I use](https://caniuse.com/#search=onLine)

## [⚠️ permissions](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/permissions)

Lets you query the permission status for features that require the user's permission (push notifications, location, etc.).

```js
navigator.permissions.query({name: 'geolocation'})
  .then(res => {
    if (res.state === 'granted') {
      console.log('Got permission!')
    } else if (res.state === 'prompt') {
      console.log('Permission has never been requested.');
    }
  })
```

There are three permission states. ([docs](https://developer.mozilla.org/en-US/docs/Web/API/PermissionStatus))

- **granted:** Permission has been granted
- **prompt:** Permission has never been requested from the user
- **denied:** Permission has been explicitly denied

`query` takes a PermissionDescriptor as its argument, and this consists of three properties.

- **name:** The agreed-upon name of the permission. You can find the list of permission names [here](https://w3c.github.io/permissions/#enumdef-permissionname).
- **userVisibleOnly:** (push notifications only)
- **sysex**

### Browser Support

!['./images/navigator/navigator8.png'](./images/navigator/navigator8.png)

> [Can I use](https://caniuse.com/#feat=permissions-api)

## [✅ platform](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorID/platform)

Returns information about the platform it's running on. On a MacBook Pro it's `MacIntel`; representative values are as follows.

- HP-UX
- Linux i686
- Linux armv7l
- Mac68K
- MacPPC
- MacIntel
- SunOS
- Win16
- Win32
- WinCE

> [Can I use](https://caniuse.com/#feat=mdn-api_navigatorid_platform)

## [✅ plugins](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorPlugins/plugins)

A list of the various plugins the browser supports. Querying it in Chrome gives the following result.

```js
navigator.mimeTypes

---
[Result]
0: {
 0: MimeType,
 application/x-google-chrome-pdf: MimeType,
 name: "Chrome PDF Plugin",
 filename: "internal-pdf-viewer",
 description: "Portable Document Format",
 length: 1
}
1: {
 0: MimeType,
 application/pdf: MimeType,
 name: "Chrome PDF Viewer",
 filename: "mhjfbmdgcfjbbpaeojofohoefgiehjai",
 description: "",
 length: 1
}
2: {
 0: MimeType,
 1: MimeType,
 ...
```

You can use the `namedItem` method to check whether a specific plugin is installed.

```js
function getFlashVersion() {
  var flash = navigator.plugins.namedItem('Shockwave Flash');
  if (typeof flash != 'object') {
    // flash is not present
    return undefined;
  }
  if(flash.version){
    return flash.version;
  } else {
    //No version property (e.g. in Chrome)
    return flash.description.replace(/Shockwave Flash /,"");
  }
}
```

> [Can I use](https://caniuse.com/#search=plugins)

## [✅ storage](https://developer.mozilla.org/en-US/docs/Web/API/StorageManager)

Returns a [StorageManager](https://developer.mozilla.org/en-US/docs/Web/API/StorageManager) object. Storage Manager supports three methods.

- **[estimate](https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/estimate):** Lets you find out the current page's available storage space and usage. This method is asynchronous. Here's an example of how to use it.

```js
// https://twitter.com
navigator.storage.estimate().then(
 res => console.log(res)
)

---
[Result]
quota: 150411345100
usage: 18873830
usageDetails: {
 caches: 18312960,
 indexedDB: 413132,
 serviceWorkerRegistrations: 147738
}
```

- **[persist](https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/persist):** Lets you persist storage for pages that satisfy the following conditions.
  - Bookmarked
  - Has a high score on [chrome://site-engagement/](//site-engagement/)
  - Added to the home screen
  - Push notifications are enabled

> [Can I use](https://caniuse.com/#feat=mdn-api_storage)

## [✅ userAgent](https://developer.mozilla.org/en-US/docs/Web/API/NavigatorID/userAgent)

Holds the browser's name, version, and platform information. Every request sent to the server includes an HTTP header called `User-Agent` (hereafter UA), also known as the userAgent string. This string contains information such as the browser type, version number, and host operating system.

Here's what `navigator.userAgent` looks like across various environments.
<details>
<summary><b>Mac, Chrome</b></summary>
<ul>
<li><b>Result:</b> Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36
</li>
<li>👉 This means it's Chrome version 80.0.3987.87, running a Gecko-like KHTML on Mac OS X version 10.14.6, and compatible with AppleWebKit and Safari version 537.36.
</li>
</ul>
</details>

<details>
<summary><b>Mac, Safari</b></summary>
<ul>
<li><b>Result:</b> Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.5 Safari/605.1.15
</li>
</ul>
</details>

<details>
<summary><b>Windows10, Edge</b></summary>
<ul>
<li><b>Result:</b> Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 Edge/18.1836
</li>
</ul>
</details>

<details>
<summary><b>Windows10, IE11</b></summary>
<ul>
<li><b>Result:</b>  Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; Tablet PC 2.0; rv:11.0) like Gecko
</li>
</ul>
</details>

<details>
<summary><b>iPhone X, Chrome</b></summary>
<ul>
<li><b>Result:</b> Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.
</li>
<li>
👉 Mobile devices include strings like `iphone`, `ipod`, `android`, etc.
</li>
</ul>
</details>
<br/>

<details>
<summary style="color: gray; font-weight:bold">Why does every UA start with 'Mozilla/version'?</summary>
<p style="color: gray;">Back when only Netscape Navigator and IE existed, the Netscape browser expressed its version as <b>'Mozilla/version'</b>. Later on, other browsers added Mozilla/version to their userAgent string to signal that they were compatible with a specific version of the Netscape browser (in practice, they weren't actually based on that version). That's why the userAgent of many browsers today starts with <b>'Mozilla/version'</b>.</p>
</details>
<br/>

`UA` is planned to be phased out gradually starting with Chrome 81, because advertisers tracking site visitors and browser support based on string parsing have caused a number of problems.

Going forward, the plan is to stop exposing information about whether a Chrome user is on Windows 7 or using a particular device. The phase-out plan for UA is as follows.

> "On top of those privacy issues, User-Agent sniffing is an abundant source of compatibility issues, in particular for minority browsers, resulting in browsers lying about themselves (generally or to specific sites), and sites (including Google properties) being broken in some browsers for no good reason," - Yoav Weiss, Google Engineer-

- **Chrome 81** (mid-March 2020) - Displays a console warning to let developers know they need to change code that relies on UA.
- **Chrome 83** (early June 2020) - Stops updating the Chrome browser version included in the UA and consolidates the OS version.
- **Chrome 85** (mid-September 2020) - Unifies desktop OS information into a common value, and unifies OS/device information into a common value.

### Client Hints

UA is being replaced by a new spec called [Client Hints](https://wicg.github.io/ua-client-hints/). You need to specify a request header called `Accept-CH`, or use a `meta tag`.

- **request header:** Accept-CH: UA-Full-Version, UA-Platform, UA-Arch
- **meta tag:**

```html
<meta http-equiv="Accept-CH" content="DPR, Width, Viewport-Width, Downlink">
```

- There's also an Accept-CH-Lifetime option that sets how long Accept-CH stays valid.

The way you request information is expressed via a request header or meta tag, separated by commas. Here's the list of information the browser can provide.

- **Browser brand** (for example: "Chrome", "Edge", "The World's Best Web Browser")
- **Browser major versioning** (for example: "72", "3", or "28")
- **Browser minor versioning** (for example: "72.0.3245.12", "3.14159", or "297.70E04154A")
- **OS brand and versioning** (for example: "Windows NT 6.0", "iOS 15", or "AmazingOS 17G")
- **CPU architecture** (for example: "ARM64", or "ia32")
- **Mobile device model name** (for example: "", or "Pixel 2 XL")
- **Whether it's a mobile browser** (for example: ?0 or ?1)

**Example**

By default, the browser returns the following information.

```js
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)
            Chrome/71.1.2222.33 Safari/537.36  
Sec-CH-UA: "Chrome"; v="74"  
Sec-CH-Mobile: ?0
```

Additional information can be requested like this

```js
    Accept-CH: UA-Full-Version, UA-Platform, UA-Arch
```

and the values returned based on the header above look like this.

```js
Sec-CH-UA: "Chrome"; v="74"
Sec-CH-UA-Full-Version: "74.0.3424.124"
Sec-CH-UA-Platform: "macOS"
Sec-CH-UA-Arch: "ARM64"
```

> [Can I use](https://caniuse.com/#search=geolocation)

## Wrap-up

Going through navigator's various properties, I realized there's more you can do on the web than I expected. Having even a rough idea of these built-in browser features seems like it'll come in handy in a variety of situations.

## Ref

- [https://b.limminho.com/archives/1384](https://b.limminho.com/archives/1384)
- [https://wicg.github.io/ua-client-hints/](https://wicg.github.io/ua-client-hints/)
- [https://www.zdnet.com/article/google-to-phase-out-user-agent-strings-in-chrome/](https://www.zdnet.com/article/google-to-phase-out-user-agent-strings-in-chrome/)
- [https://medium.com/@pakss328/http-client-hint-accept-ch-45c62b393867](https://medium.com/@pakss328/http-client-hint-accept-ch-45c62b393867)
- [https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/client-hints](https://developers.google.com/web/fundamentals/performance/optimizing-content-efficiency/client-hints)
- [https://github.com/WICG/ua-client-hints](https://github.com/WICG/ua-client-hints)
