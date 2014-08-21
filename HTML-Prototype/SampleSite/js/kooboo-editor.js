(function($){
	var Mask = function(target){
		var targetLeft = target.offset().left;
		var targetTop = target.offset().top;
		var targetWidth = target.outerWidth();
		var targetRight = $(window).width()-targetLeft-targetWidth;
		var targetHeight = target.outerHeight();
		var targetBottom = $(window).height()-targetTop-targetHeight;
		$('.kooboo-mask .left').css({
			right:targetWidth + targetRight
		});
		$('.kooboo-mask .right').css({
			left:targetLeft + targetWidth
		});
		$('.kooboo-mask .top').css({
			left:targetLeft,
			right:targetRight,
			bottom:targetHeight + targetBottom
		});
		$('.kooboo-mask .bottom').css({
			left:targetLeft,
			right:targetRight,
			top:targetTop + targetHeight
		});
	}
	var MaskScroll = function(target){
		var scrollHeight = $(window).scrollTop();
		var scrollWidth = $(window).scrollLeft();
		$('.kooboo-mask .left, .kooboo-mask .right, .kooboo-mask .bottom').css({
			bottom: -scrollHeight
		});
		$('.kooboo-mask .right').css({
			right: -scrollWidth
		});
	}
	$.fn.KoobooMask = function(){
		return this.each(function(){
			var target = $(this);
			var wrap = $('<div class="kooboo-mask">');
			wrap.append('<div class="left"></div>');
			wrap.append('<div class="right"></div>');
			wrap.append('<div class="top"></div>');
			wrap.append('<div class="bottom"></div>');
			wrap.appendTo('body');
			Mask(target);
			$(window).resize(function(){
				Mask(target);
			});
			$(window).scroll(function(){
				MaskScroll(target);
			});
		})
	}
})(jQuery);
(function($){
	var defaults = {
		activeEvent:'mouseover'
    };
	var ElementHighlight = function(target){
		var borderWidth  = $('.kooboo-highlight .left').width();
		$('.kooboo-highlight').show();
		$('.kooboo-highlight .left').css({
			left:target.offset().left - borderWidth,
			top:target.offset().top - borderWidth,
			height:target.outerHeight() + borderWidth * 2
		});
		$('.kooboo-highlight .right').css({
			left:target.offset().left + target.outerWidth(),
			top:target.offset().top - borderWidth,
			height:target.outerHeight() + borderWidth * 2
		});
		$('.kooboo-highlight .top').css({
			left:target.offset().left - borderWidth,
			top:target.offset().top - borderWidth,
			width:target.outerWidth() + borderWidth * 2
		});
		$('.kooboo-highlight .bottom').css({
			left:target.offset().left - borderWidth,
			top:target.offset().top + target.outerHeight(),
			width:target.outerWidth() + borderWidth * 2
		});
	}
	$.fn.KoobooHighlight = function(options){
		var options = $.extend(defaults, options);
		
		return this.each(function(){
			var wrap = $('<div class="kooboo-highlight">');
			wrap.append('<div class="left"></div>');
			wrap.append('<div class="right"></div>');
			wrap.append('<div class="top"></div>');
			wrap.append('<div class="bottom"></div>');
			wrap.appendTo('body');
			$(this).find('*').click(function(e){
				e.preventDefault();
				e.stopPropagation();
				ElementHighlight($(e.target));
				//$.fn.KoobooToolbar.show(this);
			});
			if($(this).find('[data-kooboo="repeat-item"]').length==0){
				$(this).find('*').bind(options.activeEvent,function(e){
					ElementHighlight($(e.target));
				});
			}else{
				$(this).find('[data-kooboo="repeat-item"] *').bind(options.activeEvent,function(e){
					ElementHighlight($(e.target));
				});
			}
		});
    }
})(jQuery);
(function($){
	var Toolbar = $('<div class="kooboo-toolbar">');
	var ToolbarWrap = $('<ul>');
	Toolbar.append(ToolbarWrap);
	var ForeachButton = $('<li><a href="javascript:;">Repeated element</a></li>');
	var TextButton = $('<li><a href="javascript:;">Text element</a></li>');
	ForeachButton.appendTo(ToolbarWrap);
	TextButton.appendTo(ToolbarWrap);
	
	var ToolbarTarget = null;
	
	ForeachButton.click(function(){
		if(ToolbarTarget!=null){
			$(ToolbarTarget).attr("data-kooboo","repeat-item");
			alert("marked");
		}
	});
	$.fn.KoobooToolbar = function(){
		return this.each(function(){
			Toolbar.appendTo('body');
		})
	}
	$.fn.KoobooToolbar.show = function(target){
		ToolbarTarget = target;
		var targetLeft = $(target).offset().left;
		var targetTop = $(target).offset().top;
		Toolbar.css({
			left:targetLeft,
			top:targetTop - Toolbar.outerHeight()
		});
		Toolbar.show();
	};
})(jQuery);
(function($){
	var CopyMask = $('<div class="kooboo-copy-mask">');
	CopyMaskInit = function(container){
		CopyMask.css({
			left:container.offset().left,
			right:$(window).width()-container.offset().left-container.outerWidth(),
			top:container.offset().top+container.find('.kooboo-repeated').outerHeight(),
			bottom:$(window).height()-container.offset().top-container.outerHeight()
		})
	}
	$.fn.KoobooCopyMask = function(){
		CopyMask.appendTo('body');
		return this.each(function(){
			var Container = $(this);
			CopyMaskInit(Container);
			$(window).resize(function(){
				CopyMaskInit(Container);
			});
		})
	}
})(jQuery);