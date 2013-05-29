(function(){
  var replace$ = ''.replace;
  function emoticon_css(it){
    var b;
    b = "";
    if (18 < it.height) {
      b = "margin: -" + (it.height - 18) / 2 + "px 0px";
      return ".emo-" + it.image_name + " {\n	background-image: url('" + it.url + "') !important;\n	vertical-align: baseline !important;\n	height: " + it.height + "px;\n	width: " + it.width + "px\n	" + b + "\n	}";
    }
  }
  Chat.prototype.emoticonize2 = Chat.prototype.emoticonize;
  Chat.prototype.emoticonize = function(msg, user){
    msg = replace$.call(msg, /<wbr\/>/, '');
    msg = this.emoticonize2(msg, user);
    if (localStorage.customEmotes !== 'true') {
      msg = smilize(msg);
    }
    "<span style='word-wrap: break-work;'>" + msg + "</span>";
  };
}).call(this);
