VERSION = "1"

log = -> console?log? "IV-Twitch: #it"
err = -> throw new Error "IV-Twitch ERROR: #it"

var bttvdark

let
	chat-moderator = !->
		return unless $j '#chat_lines'

		if !CurrentChat.show_timestamps and CurrentChat.toggle_show_timestamps
			toggle_checkbox? 'toggle_chat_timestamps'
			CurrentChat.toggle_show_timestamps!

		tempBan = '<span>&nbsp;<a href="#" class="normal_button tooltip chat_menu_btn" onclick="javascript:CurrentChat.timedBan(1);" title="Purge"><span class="glyph_only"><img src="https://dl.dropboxusercontent.com/u/30070822/ttvchat/trash.gif" /></span></a></span>';
		$j tempBan .insertAfter '#chat_menu_timeout'
		$j '#chat_menu_tools' .insertAfter '#chat_menu_op_tools'

		Chat::insert_chat_line2 = Chat::insert_chat_line
		Chat::insert_chat_line = !(info) ->
			if info.nickname in <[itaku Vendethiel]>
				info.tagtype = 'admin'
			if info.color in <[springgreen]>
				info.color = 'blue'
			
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
				(`setTimeout` 5000ms) !-> banlist.slice idx-1 1
				
				$j "\#chat_line_list .chat_from_#nickname .chat_line"
					.addClass 'banned_user_line'

				@admin_message "#{twitch-link nickname}'s messages have been hidden by a moderator (IV-Twitch)."
			| otherwise
				log "Got a #target unhandled event"
		
		function sanitize-nickname
			it = CurrentChat.real_username it
			it.replace /%/g '_' .replace /[<>,]/g ''

		CurrentChat.timedBan = !(time) ->
			CurrentChat.say "/timeout #{$j '#user_info' .current_login} #time"

	bttvbox = !->
		return unless settings-menu = $j '#chat_settings_dropmenu'
		bttvdark := 'false'

		check-tf = invert-strbool localStorage.narrowchat
		check-tf-rel = invert-strbool localStorage.related

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
						<p onclick="bttvAction('narrowchat'); document.getElementById('narrowchat').checked=#check-tf;" class="dropmenu_action">
							<input type="checkbox" id="narrowchat" class="left"> Narrow Chat
						</p>
						<p onclick="bttvAction('related'); document.getElementById('related').checked=#check-tf-rel;" class="dropmenu_action">
							<input type="checkbox" id="related" class="left"> Show Related Channels
						</p>
					</li>
				</ul>
			"""
		settings-menu.append bttvdiv

		for setting in <[narrowchat related]>
			if localStorage[setting] is 'true'
				$j "##setting" .checked = true

	over18 = !->
		$j '#roadblock_button' ?.click!


	delayed = !->
		log "CALL:delayed"
		chat-moderator!
		bttvbox!

	do init = !->
		document.body.classList.add if localStorage.narrowchat is 'true'
			'chat-narrowed'
		else 'chat-expanded'

		loc = document.URL
		if ~loc.search 'meebo.html'
			console.log ':( meebo'
			return
		unless $j?
			console.log ':( $j'
			return

		log "CALL:init (from #loc)"
		over18!
		setTimeout delayed, 1_000ms

export bttv-action = !->
	switch it
	| 'dark'
		bttvdark := 'true'
		# this would work so much better with css!
		for el in $j '#chat_column'
			el.style.background = '#111'
		for el in $j '#chat_lines'
			el.style <<<
				background: '#111'
				color: '#eee'
				border: '#fff'
		for el in '#chat_text_input'
			el.style <<<
				background: '#000'
				color: '#fff'
				border: 'solid 1px #666'
	| 'clear'
		$j 'chat_line_list' .html ''
		CurrentChat.admin_message "IV-Twitch: Cleared chat."
	| 'narrowchat'
		localStorage.narrowchat = invert-strbool localStorage.narrowchat
		window.location.reload!
	| 'related'
		localStorage.related = invert-strbool localStorage.related
		window.location.reload!

function twitch-link
	"<a href='http://twitch.tv/#it'>#it</a>"

# inverts a string boolean
function invert-strbool
	if it is 'true'
		'false'
	else 'true'