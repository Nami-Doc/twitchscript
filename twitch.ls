VERSION = "1"

log = -> console?log? "IV-Twitch: #it"
err = -> throw new Error "IV-Twitch ERROR: #it"

var bttvdark

export BetterTtvEngine = !->
	chat-moderator = !->
		return unless $ 'chat_lines'

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


		CurrentChat.handlers.clear_chat = !({target, user}) ->
			switch target
			| 'all'
				@admin_message "Chat cleared by a moderator (Prevented by IV-Twitch)."
			| 'user'
				nickname = CurrentChat.real_username user
				nickname .= replace /%/g '_' .replace /[<>,]/g ''
				log "#nickname got bent"
				$j "\#chat_line_list .chat_from_#nickname .chatline"
					.addClass 'banned_user_line'

				@admin_message "#{twitch-link nickname}'s messages have been hidden by a moderator."
			| otherwise
				log "Got a #target unhandled event"
			
		CurrentChat.timedBan = !(time) ->
			CurrentChat.say "/timeout #{$ 'user_info' .current_login} #time"

	bttvbox = !->
		return unless settings-menu = $ 'chat_settings_dropmenu'
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
		settings-menu.appendChild bttvdiv

		for setting in <[narrowchat related]>
			if localStorage[setting] is 'true'
				$ setting .checked = true

	over18 = !->
		$ 'roadblock_button' ?.click!


	delayed = !->
		log "CALL:delayed"
		#brand! # what it this supposed to do, exactly ? ...
		chat-moderator!
		bttvbox!
		# preloadchatimages! # OK LOL. no!

	do init = !->
		document.body.classList.add if localStorage.narrowchat is 'true'
			'chat-narrowed'
		else 'chat-expanded'

		loc = document.URL
		if ~loc.search 'meebo.html'
			console.log ':( meebo'
			return
		unless $?
			console.log ':( $'
			return

		log "CALL:init (from #loc)"
		over18!
		setTimeout delayed, 1_000ms
BetterTtvEngine!

export bttv-action = !->
	switch it
	| 'dark'
		bttvdark := 'true'
		for el in $$ '#chat_column' # XXX css?
			el.style.background = '#111'
		for el in $$ '#chat_lines'
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
		$ 'chat_line_list' .innerHTML = ''
		CurrentChat.admin_message "IV-Twitch: Cleared chat."
	| 'narrowchat'
		localStorage.narrowchat = invert-strbool localStorage.narrowchat
		window.location.reload!
	| 'related'
		localStorage.related = invert-strbool localStorage.related
		window.location.reload!

# inverts a string boolean
function invert-strbool
	if it is 'true'
		'false'
	else 'true'