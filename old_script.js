/*
This code is based off of code from BetterJTV and BetterTTV by nightwalker925.

hope this shit doesnt break because im lazy as fuck.

modified by Kadgar34
changed:
- fixed sub emoticons
- removed custom emoticons
- changed how darken works
- made narrower chat a bit more narrow
*/

BetterTtvEngine = function()
{
	var bdebug = {
		log: function(string) { if(window.console && console.log) console.log("Itaku: "+string); },
		warn: function(string) { if(window.console && console.warn) console.warn("Itaku: "+string); },
		error: function(string) { if(window.console && console.error) console.error("Itaku: "+string); },
		info: function(string) { if(window.console && console.info) console.info("Itaku: "+string); }
	}

	// Chat Functions
	function replaceAll(str, s1, s2) {
		return str.split(s1).join(s2);
	}

	// Core Functions
	function bhook(hooklist) {
		var results,search,found;
		results = {};
		for ( key in hooklist ) {
			search = hooklist[key];
			found = $$(search);
			if(found.length == 0) {
				bdebug.error("Couldn't find "+search);
				return null;
			}
			results[key] = found[0];
		}
		bdebug.log("HOOK SEARCH COMPLETE");
		return results;
	}
	function wrapperresize()
	{
		bdebug.log("Running wrapperresize");
		var hooks,channelheader,getarc,getad,getsub;
		if(!document.getElementById("player_column")) return;
		hooks = bhook({
			wrapper: '.c12',
			chat: '#chat_column',
			chantabs: '.tabs',
		});
		if(!hooks) return;
		hooks['chat'].style.MozBorderRadius="5px";
		hooks['chat'].style.webkitBorderRadius="5px";
		hooks['chat'].style.borderRadius="5px";
		hooks['chat'].style.background="#ffffff";
		hooks['chat'].style.padding="5px 5px 0px 5px";
		hooks['chat'].style.marginLeft="-10px";
		channelheader = document.getElementById("header_banner");
		if(channelheader) {
			chanhead=130;
		} else {
			chanhead=0;
		}
		if(localStorage.getItem("narrowchat") == "no") {
			hooks['chat'].style.width="410px";
			//hooks['chat'].style.marginTop=chanhead+15 + "px";
			hooks['chat'].style.marginTop="20px";
			hooks['wrapper'].style.width="1100px";
		} else {
			hooks['wrapper'].style.width="1000px";
			hooks['chat'].style.marginTop="20px";
			hooks['chat'].style.width="315px";
		}
	}

	function chatformatting()
	{
		bdebug.log("Running chatformatting");
		var hooks,getpo,channelheader;
		if(!document.getElementById("chat_lines")) return;
		hooks = bhook({
			chat_container: '.chat_box',
			chat_lines: '#chat_lines',
			chat_colors: '#extra_colors',
			chat_line_list: '#chat_line_list'
		});
		if(!hooks) return;
		hooks['chat_line_list'].style.fontSize="13.33333px";
		hooks['chat_line_list'].style.lineHeight="17.333333px";
		hooks['chat_colors'].style.display="inline";
		hooks['chat_lines'].style.overflowX="hidden";
		hooks['chat_lines'].style.overflowY="auto";
		hooks['chat_lines'].style.fontFamily='"Helvetica Neue", Helvetica, Arial, sans-serif';
		getpo = document.getElementById("header_banner");
		if(!getpo) { return; }
		if(localStorage.getItem("narrowchat") == "no") {
			channelheader = document.getElementById("header_banner");
			if(channelheader) {
				chatheight=125;
			} else {
				chatheight=0;
			}
			hooks['chat_lines'].style.height=chatheight+411 + "px";
			hooks['chat_lines'].style.maxHeight=chatheight+411 + "px";
			//hooks['chat_lines'].style.height="410px";
			//hooks['chat_lines'].style.maxHeight="410px";
			hooks['chat_lines'].style.width="100%";
			hooks['chat_line_list'].style.width="100%";
			hooks['chat_container'].style.width="97%";
		} else {
			channelheader = document.getElementById("header_banner");
			if(channelheader) {
				chatheight=125;
			} else {
				chatheight=0;
			}
			hooks['chat_lines'].style.height=chatheight+411 + "px";
			hooks['chat_lines'].style.maxHeight=chatheight+411 + "px";
			hooks['chat_lines'].style.width="100%";
			hooks['chat_line_list'].style.width="100%";
			hooks['chat_container'].style.width="95%";
		}
	}


	function brand()
	{
		bdebug.log("Running brand & BetterJTV Check");
		var logo,search,watermark,growlwindow,proauth,messagesnum,header_broadcast;
		logo = document.getElementById("header_logo");
		getdir = document.getElementById("channelcnt");
		if(!logo) return;
		search = logo.innerHTML.search(/Better/);
		if(search != -1) confirm("Please disable BetterJtv/BetterTTV! Itakus Twitch Chat cannot function correctly anymore with it enabled.");
		growlwindow = document.createElement("div");
		growlwindow.innerHTML = '<style type="text/css">#habla_beta_container_do_not_rely_on_div_classes_or_names { display: none !important; } #growl_container {left: 0; overflow: hidden; padding-top: 0.7143em; position: fixed; top: 60px; z-index: 999999;} .notification_holder {padding: 0 0.7143em 0.7143em;} .notification {background-color: rgba(34, 34, 34, 0.85); border: 3px solid transparent; border-radius: 10px 10px 10px 10px; box-shadow: 0 0 5px rgba(0, 0, 0, 0.5); color: #FFFFFF; cursor: pointer; min-height: 4.28em; padding: 0.7143em; position: relative; width: 14.29em;}.notification .close { background: none repeat scroll 0 0 #000000; border-radius: 0.75em 0.75em 0.75em 0.75em; color: #FFFFFF; display: none; height: 1.4em; padding: 0 6px; position: absolute; right: 0.3575em; top: 0.3575em;} .notification:hover {border: 3px solid #FFFFFF;} .notification a {color: #3399FF;}</style><div class="below_header" id="growl_container"><div style="position:relative;"><div id="growl_slider"></div></div>';
		if(PP['notifications'] !== 0) {
			messagesnum = document.createElement("a");
			header_broadcast = document.getElementById("header_broadcast");
			messagesnum.setAttribute("id","user_display_name");
			messagesnum.setAttribute("href","/inbox");
			messagesnum.setAttribute("style","background-image:url(\'http://dl.dropboxusercontent.com/u/30070822/ttvchat/messages.png\');background-position: 0px -1px;padding-top:-1px;background-repeat: no-repeat;padding-left: 21px;color:white;");
			messagesnum.innerHTML = PP['notifications'];
			//header_broadcast.parentNode.insertBefore(messagesnum, header_broadcast);
		}
	}

	function over18bypass()
	{
		var mature = document.getElementById("roadblock_button");
		if(!mature) return;
		mature.click();
	}

	function chat_moderator()
	{
		bdebug.log("Running chat_moderator");
		if(!document.getElementById("chat_lines")) return;
	//	CurrentChat.admin_message("<center><small>For chat mods: Click someone's name, theres a new icon. <a href=\"http://www.youtube.com/watch?v=79ia-c2BQwY\" target=\"_blank\">You're welcome.</a></small></center>");
		if(!CurrentChat.show_timestamps && CurrentChat.toggle_show_timestamps) {
			if(typeof toggle_checkbox != "undefined") {
				toggle_checkbox("toggle_chat_timestamps");
			}
			CurrentChat.toggle_show_timestamps();
		}
		Chat.prototype.insert_chat_line2=Chat.prototype.insert_chat_line;
		Chat.prototype.insert_chat_line=function(info)
		{
			//if(info.nickname == "itaku") { info.tagtype = "admin"; }
			if (info.nickname == "Vendethiel")
				info.tagtype = "admin";
			if(info.color == "springgreen") { info.color = "blue"; }
			//if(info.nickname == "saladloser") { info.nickname = "Mr. Fister"; }
			//info.pro = false;
			this.insert_chat_line2(info);
		}
		Chat.prototype.emoticonize2=Chat.prototype.emoticonize;
		Chat.prototype.emoticonize=function(msg,user)
		{
			msg = replaceAll(msg, "<wbr />", "");
			msg = this.emoticonize2(msg,user);
	        if(localStorage.getItem("custom_emotes") !== "true")	msg = smilize(msg);
			msg = "<span style=\"word-wrap: break-word;\">"+msg+"</span>";
			return msg;
		}
		CurrentChat.handlers.clear_chat = function(info) {
			var nickname = CurrentChat.real_username(info.user);
			if (info.target == "all") {
			this.admin_message(_("Chat was cleared by a moderator (Prevented by Itakus Twitch Chat)"));
			} else if (info.target == "user") {
			var nickname = CurrentChat.real_username(info.user);
			$$('#chat_line_list .chat_from_' + info.user.replace(/%/g, '_').replace(/[<>,]/g, '') + ' .chat_line').each(function (message) {
				message.innerHTML = "<SPAN style=\"BACKGROUND-COLOR: #000000; color: white;\">" + message.innerHTML + "</span></span>";
			});
			this.admin_message(nickname+"'s messages have been hidden. Click them to have them appear.");
			}
		}
		var tempBan = '<span>&nbsp;<a href="#" class="normal_button tooltip chat_menu_btn" onclick="javascript:CurrentChat.timedBan(1);" title="Purge"><span class="glyph_only"><img src="https://dl.dropboxusercontent.com/u/30070822/ttvchat/trash.gif" /></span></a></span>';
		$j(tempBan).insertAfter("#chat_menu_timeout");
		$j("#chat_menu_tools").insertAfter("#chat_menu_op_tools");
			
		CurrentChat.timedBan = function(time) {
			CurrentChat.say("/timeout "+$("user_info").current_login+" "+time);
		}
	}	

	function generate_emoticon_css(a) {
			var b = "";
			18 < a.height && (b = "margin: -" + (a.height - 18) / 2 + "px 0px");
			return ".emo-" + a.image_name + ' {background-image: url("' + a.url + '") !important;vertical-align: baseline !important;height: ' + a.height + "px;width: " + a.width + "px;" + b + "}"
	}
	function preloadchatimages()
	{
		(function($) {
		  var cache,args_len,i,cacheImage
		  cache = [];
		  // Arguments are image paths relative to the current page.
		  $.preLoadImages = function() {
			args_len = arguments.length;
			for (i = args_len; i--;) {
			  cacheImage = document.createElement('img');
			  cacheImage.src = arguments[i];
			  cache.push(cacheImage);
			}
		  }
		})(jQuery);
		/*
			jQuery.preLoadImages(
				"http://s3.amazonaws.com/betterjtv/smileys/cry.png",
				"http://s3.amazonaws.com/betterjtv/smileys/mw.jpg",
				"http://s3.amazonaws.com/betterjtv/smileys/aww.png",
				"http://s3.amazonaws.com/betterjtv/smileys/trollface.png",
				"http://betterttv.nightdev.com/kona.png",
				"http://betterttv.nightdev.com/foreveralone.png",
				"http://betterttv.nightdev.com/black.png",
				"http://betterttv.nightdev.com/rage.png",
				"http://betterttv.nightdev.com/chaccept.png",
				"http://betterttv.nightdev.com/fuckyea.png",
				"http://betterttv.nightdev.com/pancakemix.png",
				"http://betterttv.nightdev.com/pedobear.png",
				"http://betterttv.nightdev.com/luda.png",
				"http://betterttv.nightdev.com/blackhawk.png",
				"http://betterttv.nightdev.com/sdaw.png",
				"http://betterttv.nightdev.com/hydro.png",
				"http://betterttv.nightdev.com/basedgod.png",
				"http://betterttv.nightdev.com/socal.png",
				"http://betterttv.nightdev.com/vos.png",
				"http://betterttv.nightdev.com/fishmoley.png",
				"http://betterttv.nightdev.com/herbert.png",
				"http://betterttv.nightdev.com/panda.png",
				"http://betterttv.nightdev.com/mandm.png",
				"http://betterttv.nightdev.com/ohgod.png",
				"http://betterttv.nightdev.com/shado.png",
				"http://betterttv.nightdev.com/adz.png",
				"http://betterttv.nightdev.com/chez.png",
				"http://betterttv.nightdev.com/namja.png",
				"http://betterttv.nightdev.com/updog.png",
				"http://betterttv.nightdev.com/striker.png",
				"http://betterttv.nightdev.com/azzy.png",
				"http://betterttv.nightdev.com/pedonam.png",
				"http://betterttv.nightdev.com/fapmeme.png",
				"http://betterttv.nightdev.com/pokerface.png",
				"http://betterttv.nightdev.com/XLS17.png",
				"http://betterttv.nightdev.com/angry.png",
				"http://betterttv.nightdev.com/jamontoast.png",
				"http://betterttv.nightdev.com/nyan-cat.gif",
				"http://betterttv.nightdev.com/jokko.png",
				"http://betterttv.nightdev.com/chanz.png",
				"http://s3.amazonaws.com/betterjtv/smileys/puke.png",
				"http://s3.amazonaws.com/betterjtv/smileys/mooning.png",
				"http://s3.amazonaws.com/betterjtv/smileys/poolparty.png",
				"http://i52.tinypic.com/kcg1g.png",
				"http://i52.tinypic.com/iqkmmv.png",
				"http://dl.dropboxusercontent.com/u/30070822/ttvchat/MyBJTVface.png",
				"http://dl.dropboxusercontent.com/u/30070822/ttvchat/cupcake.jpg",
				"http://dl.dropboxusercontent.com/u/30070822/ttvchat/fredburger.jpg",
				"http://dl.dropboxusercontent.com/u/30070822/ttvchat/yuno.png",
				"http://dl.dropboxusercontent.com/u/30070822/ttvchat/Nuc.jpg",
				"http://dl.dropboxusercontent.com/u/30070822/ttvchat/juanito.png",
				"http://dl.dropboxusercontent.com/u/30070822/ttvchat/moog.png",
				"http://dl.dropboxusercontent.com/u/30070822/ttvchat/black.png",
				"http://i.imgur.com/xxciG.jpg",
				"http://dl.dropboxusercontent.com/u/30070822/ttvchat/ghostman.png",
				"http://dl.dropboxusercontent.com/u/30070822/ttvchat/tinyface.gif",
				"http://dl.dropboxusercontent.com/u/30070822/ttvchat/itakubot.png",
				"http://dl.dropboxusercontent.com/u/30070822/ttvchat/deadmau5.png",
				"http://dl.dropboxusercontent.com/u/30070822/saladtoaster.png",
				"https://dl.dropboxusercontent.com/u/30070822/akikanmelon.png",
				"https://dl.dropboxusercontent.com/u/30070822/ttvchat/bmo.png",
				"https://dl.dropboxusercontent.com/u/30070822/ttvchat/jake.png",
				"https://dl.dropboxusercontent.com/u/30070822/ttvchat/finn.png",
				"https://dl.dropboxusercontent.com/u/30070822/ttvchat/lich.png",
				"https://dl.dropboxusercontent.com/u/30070822/ttvchat/fireprincess.png",
				"https://dl.dropboxusercontent.com/u/30070822/ttvchat/rainicorn.png",
				"https://dl.dropboxusercontent.com/u/30070822/addondolan.gif",
				"https://dl.dropboxusercontent.com/u/30070822/ttvchat/targaryen.png"
			)
		*/
	}
	function smilize(message)
	{
		message = replaceAll(message, "&gt;(", "<img src='http://www-cdn.jtvnw.net/images/emoticons/angry.gif'>");
		message = replaceAll(message, "BeeMO", "<img src='https://dl.dropboxusercontent.com/u/30070822/ttvchat/bmo.png'>");
		message = replaceAll(message, "JakeTheDog", "<img src='https://dl.dropboxusercontent.com/u/30070822/ttvchat/jake.png'>");
		message = replaceAll(message, "FinnTheHuman", "<img src='https://dl.dropboxusercontent.com/u/30070822/ttvchat/finn.png'>");
		message = replaceAll(message, "LichTheSnail", "<img src='https://dl.dropboxusercontent.com/u/30070822/ttvchat/lich.png'>");
		message = replaceAll(message, ";P", "<img src='http://www-cdn.jtvnw.net/images/emoticons/winkberry.gif'>");
		message = replaceAll(message, ";p", "<img src='http://www-cdn.jtvnw.net/images/emoticons/winkberry.gif'>");
		message = replaceAll(message, ":P", "<img src='http://www-cdn.jtvnw.net/images/emoticons/raspberry.gif'>");
		message = replaceAll(message, ":p", "<img src='http://www-cdn.jtvnw.net/images/emoticons/raspberry.gif'>");
		message = replaceAll(message, ":trollface:", "<img src='http://s3.amazonaws.com/betterjtv/smileys/trollface.png'>");
		message = replaceAll(message, ":tf:", "<img src='http://s3.amazonaws.com/betterjtv/smileys/trollface.png'>");
		message = replaceAll(message, ":D", "<img src='http://s3.amazonaws.com/betterjtv/smileys/mw.jpg'>");
		message = replaceAll(message, ":d", "<img src='http://s3.amazonaws.com/betterjtv/smileys/mw.jpg'>");
		message = replaceAll(message, ":'(", "<img src='http://s3.amazonaws.com/betterjtv/smileys/cry.png'>");
		message = replaceAll(message, "KKona", "<img src='http://betterttv.nightdev.com/kona.png'>");
		message = replaceAll(message, "ForeverAlone", "<img src='http://betterttv.nightdev.com/foreveralone.png'>");
		message = replaceAll(message, "TwaT", "<img src='http://betterttv.nightdev.com/chez.png'>");
		message = replaceAll(message, "RageFace", "<img src='http://betterttv.nightdev.com/rage.png'>");
		message = replaceAll(message, "rStrike", "<img src='http://betterttv.nightdev.com/striker.png'>");
		message = replaceAll(message, "CHAccepted", "<img src='http://betterttv.nightdev.com/chaccept.png'>");
		message = replaceAll(message, "shaDO", "<img src='http://betterttv.nightdev.com/shado.png'>");
		message = replaceAll(message, "FuckYea", "<img src='http://betterttv.nightdev.com/fuckyea.png'>");
		message = replaceAll(message, "ManlyScreams", "<img src='http://betterttv.nightdev.com/namja.png'>");
		message = replaceAll(message, "PancakeMix", "<img src='http://betterttv.nightdev.com/pancakemix.png'>");
		message = replaceAll(message, "PedoBear", "<img src='http://betterttv.nightdev.com/pedobear.png'>");
		message = replaceAll(message, "PedoNam", "<img src='http://betterttv.nightdev.com/pedonam.png'>");
		message = replaceAll(message, "LLuda", "<img src='http://betterttv.nightdev.com/luda.png'>");
		message = replaceAll(message, "iDog", "<img src='http://betterttv.nightdev.com/updog.png'>");
		message = replaceAll(message, "FishMoley", "<img src='http://betterttv.nightdev.com/fishmoley.png'>");
		message = replaceAll(message, "ShoopDaWhoop", "<img src='http://betterttv.nightdev.com/sdaw.png'>");
		message = replaceAll(message, "HHydro", "<img src='http://betterttv.nightdev.com/hydro.png'>");
		message = replaceAll(message, "OhGodchanZ", "<img src='http://betterttv.nightdev.com/chanz.png'>");
		message = replaceAll(message, "OhGod", "<img src='http://betterttv.nightdev.com/ohgod.png'>");
		message = replaceAll(message, "FapFapFap", "<img src='http://betterttv.nightdev.com/fapmeme.png'>");
		message = replaceAll(message, "iAMbh", "<img src='http://betterttv.nightdev.com/blackhawk.png'>");
		message = replaceAll(message, "iamsocal", "<img src='http://betterttv.nightdev.com/socal.png'>");
		message = replaceAll(message, "cabbag3", "<img src='http://betterttv.nightdev.com/angry.png'>");
		message = replaceAll(message, "VVostik", "<img src='http://betterttv.nightdev.com/vos.png'>");
		message = replaceAll(message, "HerbPerve", "<img src='http://betterttv.nightdev.com/herbert.png'>");
		message = replaceAll(message, "SexPanda", "<img src='http://betterttv.nightdev.com/panda.png'>");
		message = replaceAll(message, "M&Mjc", "<img src='http://betterttv.nightdev.com/mandm.png'>");
		message = replaceAll(message, "SwedSwag", "<img src='http://betterttv.nightdev.com/jokko.png'>");
		message = replaceAll(message, "OhGodchanZ", "<img src='http://betterttv.nightdev.com/chanz.png'>");
		message = replaceAll(message, "adZ", "<img src='http://betterttv.nightdev.com/adz.png'>");
		message = replaceAll(message, "aZZy", "<img src='http://betterttv.nightdev.com/azzy.png'>");
		message = replaceAll(message, "PokerFace", "<img src='http://betterttv.nightdev.com/pokerface.png'>");
		message = replaceAll(message, "XLS17", "<img src='http://betterttv.nightdev.com/XLS17.png'>");
		message = replaceAll(message, "ToasTy", "<img src='http://betterttv.nightdev.com/jamontoast.png'>");
		message = replaceAll(message, "BasedGod", "<img src='http://betterttv.nightdev.com/basedgod.png'>");
		message = replaceAll(message, "(puke)", "<img src='http://s3.amazonaws.com/betterjtv/smileys/puke.png'>");
		message = replaceAll(message, "(mooning)", "<img src='http://s3.amazonaws.com/betterjtv/smileys/mooning.png'>");
		message = replaceAll(message, "(poolparty)", "<img src='http://s3.amazonaws.com/betterjtv/smileys/poolparty.png'>");
		message = replaceAll(message, "~=[,,_,,]:3", "<img src='http://betterttv.nightdev.com/nyan-cat.gif' height='30'>");
		message = replaceAll(message, "ShrugFace", "Â¯\\_(ãƒ„)_/Â¯");
		message = replaceAll(message, "TableFlip", "(â•¯Â°â–¡Â°ï¼‰â•¯ï¸µ â”»â”â”»");
		message = replaceAll(message, "LikeABoss", "<img src='http://i52.tinypic.com/kcg1g.png'>");
		message = replaceAll(message, "ApertureLab", "<img src='http://i52.tinypic.com/iqkmmv.png'>");
		message = replaceAll(message, "Raccoon", "<img src='http://dl.dropboxusercontent.com/u/30070822/ttvchat/MyBJTVface.png'>");
		message = replaceAll(message, "(cupcake)", "<img src='http://dl.dropboxusercontent.com/u/30070822/ttvchat/cupcake.jpg'>");
		message = replaceAll(message, "FredBurger", "<img src='http://dl.dropboxusercontent.com/u/30070822/ttvchat/fredburger.jpg'>");
		message = replaceAll(message, "YUNo", "<img src='http://dl.dropboxusercontent.com/u/30070822/ttvchat/yuno.png'>");
		message = replaceAll(message, "(Nuc)", "<img src='http://dl.dropboxusercontent.com/u/30070822/ttvchat/Nuc.jpg'>");
		message = replaceAll(message, ":Juanito:", "<img src='http://dl.dropboxusercontent.com/u/30070822/ttvchat/juanito.png'>");
		message = replaceAll(message, "FancyMoog", "<img src='http://dl.dropboxusercontent.com/u/30070822/ttvchat/moog.png'>");
		message = replaceAll(message, "RebeccaBlack", "<img src='http://dl.dropboxusercontent.com/u/30070822/ttvchat/black.png'>");
		message = replaceAll(message, "iTroll", "<img src='http://i.imgur.com/xxciG.jpg'>");
		message = replaceAll(message, "GhostMan", "<img src='http://dl.dropboxusercontent.com/u/30070822/ttvchat/ghostman.png'>");
		message = replaceAll(message, "'-'", "<img src='http://dl.dropboxusercontent.com/u/30070822/ttvchat/tinyface.gif'>");
		message = replaceAll(message, "ItakuBot", "<img src='http://dl.dropboxusercontent.com/u/30070822/ttvchat/itakubot.png'>");
		message = replaceAll(message, "DeadMau5", "<img src='http://dl.dropboxusercontent.com/u/30070822/ttvchat/deadmau5.png'>");
		message = replaceAll(message, "SaladToaster", "<img src='http://dl.dropboxusercontent.com/u/30070822/saladtoaster.png'>");
	    	message = replaceAll(message, "CloudMelon", "<img src='https://dl.dropboxusercontent.com/u/30070822/akikanmelon.png'>");
		message = replaceAll(message, "GoobyPls", "<img src='https://dl.dropboxusercontent.com/u/30070822/addondolan.gif'>");
		message = replaceAll(message, "FlamePrincess", "<img src='https://dl.dropboxusercontent.com/u/30070822/ttvchat/fireprincess.png'>");
		message = replaceAll(message, "LadyRainicorn", "<img src='https://dl.dropboxusercontent.com/u/30070822/ttvchat/rainicorn.png'>");
		message = replaceAll(message, "FireAndBlood", "<img src='https://dl.dropboxusercontent.com/u/30070822/ttvchat/targaryen.png'>");
		return message;
	}

	function bttvbox()
	{
		var settingsmenu,bttvdiv,checktf,checktfad,checktfsub,checktfrel;
		settingsmenu = document.getElementById("chat_settings_dropmenu");
		if(!settingsmenu) return;
		bttvdark="false";
		bttvdiv = document.createElement("div");
		bttvdiv.setAttribute("align","left");
		bttvdiv.style.margin = "0px auto";
		if(localStorage.getItem("narrowchat") == "yes") { checktf = "false"; } else { checktf = "true"; }
		if(localStorage.getItem("related") !== "true") { checktfrel = "false"; } else { checktfrel = "true"; }
	    if(localStorage.getItem("custom_emotes") !== "true") { checktfcustom = "false"; } else { checktfcustom = "true"; }
		bttvdiv.innerHTML = '<ul class="dropmenu_col inline_all"> \
	<li id="chat_section_chatroom" class="dropmenu_section"> \
	<br /> \
	&nbsp;&nbsp;&nbsp;&raquo;&nbsp;Itakus Twitch Chat \
	<a class="dropmenu_action g18_gear-00000020" href="#" onclick="bttv_action(\'dark\'); return false;">Darken Chat</a> \
	<a class="dropmenu_action g18_trash-00000020" href="#" onclick="bttv_action(\'clear\'); return false;">Clear My Chat</a> \
	<p onclick="bttv_action(\'narrowchat\');document.getElementById(\'narrowchat\').checked=' + checktf + ';" class="dropmenu_action"> \
	<input type="checkbox" id="narrowchat" class="left"> Narrow Chat</p> \
	<p onclick="bttv_action(\'related\');document.getElementById(\'related\').checked=' + checktfrel + ';" class="dropmenu_action"> \
	<input type="checkbox" id="related" class="left"> Show Related Channels</p> \
	<p onclick="bttv_action(\'custom_emotes\');" class="dropmenu_action"> \
	<input type="checkbox" id="custom_emotes" class="left"> Hide Custom Emoticons</p> \
	</li> \
	</ul>';
		settingsmenu.appendChild(bttvdiv);
		if(localStorage.getItem("narrowchat") == "yes") document.getElementById("narrowchat").checked = true;
		if(localStorage.getItem("related") == "true") document.getElementById("related").checked = true;
	    if(localStorage.getItem("custom_emotes") == "true") document.getElementById("custom_emotes").checked = true;
	}

	function init()
	{
		var loc = document.URL;
		if(loc.indexOf("meebo.html") != -1)
		{
			console.log(':( meebo');
			return;
		}
		if(typeof($) === 'undefined')
		{
			console.log(':( $');
			return;
		}
		if(typeof(Array.prototype.each) === 'undefined')
		{
			console.log(':( each')
			return;
		}
		itakutwitchver = "1.0";
		bdebug.log("itakuchat v"+itakutwitchver);
		bdebug.log("CALL init "+loc);
		over18bypass();
		setTimeout(delayed, 1000);
		wrapperresize();
		chatformatting();
	}

	function delayed()
	{
		bdebug.log("CALL delayed");
		brand();
		chat_moderator();
		bttvbox();
		preloadchatimages();
	}

	init();

} ();

function bttv_action(action) {
  if(action == "dark") {
	bttvdark="true";
	$$('#chat_column').each(function(element) {
		element.style.background = '#111';
	});
	$$('#chat_lines').each(function(element) {
		element.style.background = '#111';
		element.style.color = '#eee';
		element.style.border = '#fff';
	});
	$$('#chat_text_input').each(function(element) {
		element.style.background = '#000';
		element.style.color = '#fff';
		element.style.border = 'solid 1px #666';
	});
  }
  if(action == "clear") {
	$('chat_line_list').innerHTML = "";
	CurrentChat.admin_message("You cleared your own chat (Itaku Twitch Chat)");
  }
  if(action == "narrowchat") {
	if(localStorage.getItem("narrowchat") == "yes") {
		localStorage.setItem("narrowchat", "no");
	} else {
		localStorage.setItem("narrowchat", "yes");
	}
	window.location.reload();
  }
  if(action == "related") {
	if(localStorage.getItem("related") == "true") {
		localStorage.setItem("related", "false");
	} else {
		localStorage.setItem("related", "true");
	}
	window.location.reload();
  }
  if(action == "custom_emotes") {
      if(localStorage.getItem("custom_emotes") == "true") {
          localStorage.setItem("custom_emotes", "false");
          document.getElementById("custom_emotes").checked = false;
      } else {
          localStorage.setItem("custom_emotes", "true");
          document.getElementById("custom_emotes").checked = true;
      }
  }
}