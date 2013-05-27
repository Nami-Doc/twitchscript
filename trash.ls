

	function emoticon_css
		b = ""
		if 18 < it.height
			b = "margin: -#{(it.height - 18) / 2}px 0px"
			"""
			.emo-#{it.image_name} {
				background-image: url('#{it.url}') !important;
				vertical-align: baseline !important;
				height: #{it.height}px;
				width: #{it.width}px
				#b
				}
			"""


		Chat::emoticonize2 = Chat::emoticonize
		Chat::emoticonize = !(msg, user) ->
			msg -= //<wbr />//
			msg = @emoticonize2 msg, user
			
			if localStorage.custom-emotes isnt 'true'
				msg = smilize msg

			"<span style='word-wrap: break-work;'>#msg</span>"