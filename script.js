// ==UserScript==
// @author 		   Vendethiel & Itaku
// @name           IV Twitch
// @version 	   1.0.0
// @description    IV Twitch
// @include        http://twitch.tv/*
// @include        http://*.twitch.tv/*
// ==/UserScript==

salt = Math.round(Math.random() * 1000000)

var script = document.createElement('script')
script.type = 'text/javascript'
script.src = "https://dl.dropboxusercontent.com/u/105712836/twitchscript/twitch.js?"+salt
head = document.getElementsByTagName('head')[0]

var style = document.createElement('link')
style.rel = 'stylesheet'
style.href = "https://dl.dropboxusercontent.com/u/105712836/twitchscript/twitch.css?"+salt


if (head) {
	head.appendChild(script)
	head.appendChild(style)
}

console.log('injecting with salt', salt, script, style)