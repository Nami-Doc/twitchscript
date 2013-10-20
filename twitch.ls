VERSION = "1"

log = -> console?log? "IV-Twitch: #it"
err = -> throw new Error "IV-Twitch ERROR: #it"


colors = let
	colors = <[
		Blue Coral DodgerBlue SpringGreen YellowGreen Green OrangeRed Red
		GoldenRod HotPink CadetBlue SeaGreen Chocolate BlueViolet Firebrick
	]>
	color-idx = 0
	enabled: false
	trigger: !->
		return unless @enabled
		CurrentChat.user_color colors[color-idx] if can-command!
		if colors[color-idx + 1]
			++color-idx
		else color-idx := 0

old-messages = []
old-messages-idx = 0

chat-moderator = !->
	return unless $j '#chat_lines'

	if !CurrentChat.show_timestamps and CurrentChat.toggle_show_timestamps
		toggle_checkbox? 'toggle_chat_timestamps'
		CurrentChat.toggle_show_timestamps!

	tempBan = '<span>&nbsp;<a href="#" class="normal_button tooltip chat_menu_btn" onclick="javascript:CurrentChat.timedBan(1);" title="Purge"><span class="glyph_only"><img src="https://dl.dropboxusercontent.com/u/30070822/ttvchat/trash.gif" /></span></a></span>';
	$j tempBan .insertAfter '#chat_menu_timeout'
	$j '#chat_menu_tools' .insertAfter '#chat_menu_op_tools'

	Chat::insert_chat_line2 = Chat::insert_chat_line
	last-chatter = ""
	Chat::insert_chat_line = !(info) ->
		if info.nickname is PP.login
			colors.trigger! unless info.nickname is last-chatter
			old-messages.unshift info.message
			old-messages-idx := 0
		if info.color in <[springgreen]>
			info.color = 'blue'
		last-chatter := info.nickname
		@insert_chat_line2 info

		if can-moderate and info.nickname not in [PP.login, CurrentChat.last_sender]
			@insert_with_lock do
				'.mod_button.timeout:last'
				"""
<span
 class="inline_purge"
 title="Clear (purge messages from #{info.nickname})"
 onclick="CurrentChat.say('/timeout #{info.nickname} 1')">
	<img src="https://dl.dropboxusercontent.com/u/30070822/ttvchat/trash.gif" />
</span>
				"""

	can-moderate =
		PP.login is PP.channel
		or PP.is_admin is "true"
		or PP.is_subadmin is "true"
		or CurrentChat.staff[PP.login]
		or CurrentChat.admins[PP.login]
		or CurrentChat.moderators[PP.login]

	banlist = []
	CurrentChat.handlers.clear_chat = !({target, user}) ->
		switch target
		| 'all'
			@admin_message "Chat cleared by a moderator (Prevented by IV-Twitch)."
		| 'user'
			nickname = sanitize-nickname user
			
			return if nickname in banlist
			idx = banlist.push nickname
			(`setTimeout` 5000ms) <| !-> banlist.slice idx-1 1
			
			$j "\#chat_line_list .chat_from_#nickname .chat_line"
				.addClass 'banned_user_line'

			@admin_message "#{twitch-link nickname}'s messages have been hidden by a moderator (IV-Twitch)."
		| otherwise
			log "Got a #target unhandled event"
	
	function sanitize-nickname
		it = CurrentChat.real_username it
		it.replace /%/g '_' .replace /[<>,]/g '' .to-lower-case!

	CurrentChat.timedBan = !(time) ->
		CurrentChat.say "/timeout #{$j '#user_info .nick' .html!} #time"

create-box = !->
	return unless settings-menu = $j '#chat_settings_dropmenu'

	check-narrow = invert-strbool localStorage.narrowchat
	check-color = invert-strbool localStorage.colorswitcher

	bttvdiv = document.createElement 'div'
		..setAttribute 'align' 'left'
		..className = 'bttvdiv'
		..innerHTML = """
<ul class="dropmenu_col inline_all">
	<li id="chat_section_chatroom" class="dropmenu_section">
		<br />
		&nbsp;&nbsp;&nbsp;&raquo;&nbsp;IV-Twitch
		<a class="dropmenu_action g18_gear-00000020" href="#" onclick="bttvAction('dark'); return false;">
			Darken Chat
		</a>
		<a class="dropmenu_action g18_trash-00000020" href="#" onclick="bttvAction('clear'); return false;">
			Clear My Chat
		</a>
		<p onclick="bttvAction('narrowchat'); document.getElementById('narrowchat').checked=#check-narrow;" class="dropmenu_action">
			<input type="checkbox" id="narrowchat" class="left"> Narrow Chat
		</p>
		<p onclick="bttvAction('colorswitcher'); document.getElementById('colorswitcher').checked=#check-color;" class="dropmenu_action">
			<input type="checkbox" id="colorswitcher" class="left"> Enable Auto Color Switcher
		</p>
	</li>
</ul>
		"""
	settings-menu.append bttvdiv

	for setting in <[narrowchat colorswitcher]>
		if localStorage[setting] is 'true'
			$j "##setting" .attr 'checked' true

chat-history = !->
	const KEY_ARROWUP = 38
		KEY_ARROWDOWN = 40
	$j '#chat_text_input' .keyup !->
		return if @value and @value not in old-messages
		return unless old-messages.length
		switch it.which
		| KEY_ARROWUP
			message = old-messages[old-messages-idx++]
		| KEY_ARROWDOWN
			message = old-messages[old-messages-idx--]
		| _ => return
		@value = message ? old-messages[old-messages-idx := 0]
		false

over18 = !->
	$j '#roadblock_button' ?.click!

init-options = !->
	if localStorage.colorswitcher is 'true'
		colors.enabled = true
		log "Color switcher enabled"

delayed = !->
	log "CALL:delayed"
	chat-moderator!
	chat-history!
	create-box!

# options
document.body.classList.add if localStorage.narrowchat is 'true'
	'chat-narrowed'
else 'chat-expanded'

# checks
loc = document.URL
if ~loc.search 'meebo.html'
	return console.log ':( meebo'
unless $j?
	return console.log ':( $j'

# let's go !
log "CALL:init (from #loc)"
over18!
init-options!
setTimeout delayed, 1_000ms

# exports and functions

export bttv-action = !->
	switch it
	| 'dark'
		$j '#twitch_chat' .addClass 'dark-chat'
	| 'clear'
		$j 'chat_line_list' .html ''
		CurrentChat.admin_message "IV-Twitch: Cleared chat."
	| _
		localStorage[it] = invert-strbool localStorage[it]
		switch it
		| 'narrowchat'
			window.location.reload!
		| 'colorswitcher'
			! = colors.enabled

last-command = Date.now!
function can-command
	if Date.now! > last-command + 2_000ms
		last-command := Date.now!
		true
	else
		log "Command not executed because of timeout"
		false

function twitch-link
	"<a href='http://twitch.tv/#it'>#it</a>"

# inverts a string boolean
function invert-strbool
	if it is 'true'
		'false'
	else 'true'