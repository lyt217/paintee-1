// 상세화면의 구조
function DetailStructure(paintingId, fileId, artistName, artistId, artistSentence, uploadDate, postedNum){
    this.paintingId     = paintingId;

    this.fileId          = fileId;
    this.artistName     = artistName;
    this.artistId       = artistId;
    this.artistSentence = artistSentence;
    this.uploadDate     = uploadDate;
    this.postedNum      = postedNum;

    this.detail             =$(".detail");

    this.detailBgContainer  =$("<div>").addClass("detail_bg_container");
    this.detailBgImg        =$("<img>").addClass("detail_bg_img");
    this.detailBgBottom     =$("<div>").addClass("detail_bg_bottom");

    this.detailContainer    =$("<div>").addClass("detail_container").addClass("swiper_container_detail");
    this.wrapper            =$("<div>").addClass("swiper-wrapper");

    this.detailMargin       =$("<div>").addClass("detail_margin").addClass("swiper-slide");
    this.detailCloseIcon    =$("<i>").addClass("material-icons").addClass("detail_margin_close").html("close");
    this.detailMarginIcon   =$("<i>").addClass("material-icons").addClass("detail_margin_guide").html("keyboard_arrow_up");

    this.detailArtist       =$("<div>").addClass("detail_artist").addClass("swiper-slide");
    this.detailArtistTop    =$("<div>").addClass("detail_artist_top");
    this.detailArtistBtn    =$("<div>").addClass("detail_artist_btn");
    this.detailArtistFollow =$("<div>").addClass("detail_artist_follow");
    this.detailArtistSentence=$("<div>").addClass("detail_artist_sentence");
    this.detailArtistDate   =$("<div>").addClass("detail_artist_date");
    this.detailArtistBottom =$("<div>").addClass("detail_artist_bottom").html("Share to ");
    this.sociconFacebook    =$("<span>").addClass("social_btn").addClass("socicon-facebook");
    this.sociconTwitter     =$("<span>").addClass("social_btn").addClass("socicon-twitter");
    this.sociconInstagram   =$("<span>").addClass("social_btn").addClass("socicon-instagram");
    this.sociconPinterest   =$("<span>").addClass("social_btn").addClass("socicon-pinterest");

    this.detailPostbar      =$("<div>").addClass("detail_postbar").addClass("swiper-slide");
    this.detailPostbarPostnum=$("<div>").addClass("detail_postbar_postnum");
    this.detailPostbarPostedNum=$("<span>").addClass("list_info_posted_num");

    this.detailPostBtn      =$("<div>").addClass("detail_post_btn").html("post it").click(function(){purchase()});
    this.detailScroll       =$("<div>").addClass("swiper-scrollbar").addClass("swiper-scrollbar-detail");
    this.returnBtn          =$("<div>").addClass("return_btn").append($("<i>").addClass("material-icons").html("keyboard_backspace"));
}

DetailStructure.prototype = {
    setBG       : function(fileId){
        this.detailBgImg.attr("src", imageUrl+"/cmm/file/view/"+fileId);
    },
    setArtist   : function(artistName){
        this.detailArtistBtn.html(artistName);
    },
    setFollow   : function(artistId){
        this.detailArtistFollow.append('<i class="material-icons" style="font-size:12px">star</i> follow artist');
    },
    setSentence : function(artistSentence){
        this.detailArtistSentence.html(artistSentence);
    },
    setDate     : function(uploadDate){
        this.detailArtistDate.html(uploadDate);
    },
    setPostedNum: function(postedNum){
        this.detailPostbarPostedNum.html(postedNum);
    },
    buildDetail : function(){
        this.setBG(this.fileId);
        this.setArtist(this.artistName);
        this.setFollow(this.artistId);
        this.setSentence(this.artistSentence);
        this.setDate(this.uploadDate);
        this.setPostedNum(this.postedNum);

        this.detailBgContainer.append(this.detailBgImg);

        this.detailMargin.append(this.detailCloseIcon);
        this.detailMargin.append(this.detailMarginIcon);

        this.detailArtistTop.append(this.detailArtistBtn);
        this.detailArtistTop.append(this.detailArtistFollow);
        this.detailArtistSentence.append(this.detailArtistDate);
        this.detailArtistBottom.append(this.sociconFacebook);
        this.detailArtistBottom.append(this.sociconTwitter);
        this.detailArtistBottom.append(this.sociconInstagram);
        this.detailArtistBottom.append(this.sociconPinterest);
        this.detailArtist.append(this.detailArtistTop);
        this.detailArtist.append(this.detailArtistSentence);
        this.detailArtist.append(this.detailArtistBottom);

        this.detailPostbarPostnum.append(this.detailPostbarPostedNum).append(" people already posted it");
        this.detailPostbar.append(this.detailPostbarPostnum);

        this.wrapper.append(this.detailMargin);
        this.wrapper.append(this.detailArtist);
        this.wrapper.append(this.detailPostbar);

        this.detailContainer.append(this.wrapper);

        this.detail.append(this.detailBgContainer);
        this.detail.append(this.detailBgBottom);
        this.detail.append(this.detailContainer);
        this.detail.append(this.detailPostBtn);
        this.detail.append(this.detailScroll);

        var detailController = new DetailController();

        console.log(this.artistId);
        
        var picArtistId = this.artistId;
        //follow 버튼 이벤트
        this.detailArtistFollow.on('click', function() { detailController.artistFollow(picArtistId); });

        //소셜 공유 이벤트
        this.sociconFacebook    =$("<span>").addClass("social_btn").addClass("socicon-facebook");
        this.sociconTwitter     =$("<span>").addClass("social_btn").addClass("socicon-twitter");
        this.sociconInstagram   =$("<span>").addClass("social_btn").addClass("socicon-instagram");
        this.sociconPinterest   =$("<span>").addClass("social_btn").addClass("socicon-pinterest");
    }
}

//상세화면을 위한 변수들
var isDetail = false;
var postedLock = true;
var postedObj = new Array();
var postedIndex = new Array();
var postedLockBreakpoint;

//화면이 최초 생성시 swiper 에 detail-margin, detail-artist, detail-postbar 3 의 slide 가 미리 등록되어 진다.
var initPostedSlideCnt = 3;

//현재 그림 정보를 위한 변수들
var selectedPaintingId;
var selectedArtistId;
var selectedArtistName;

function DetailController() {
}

DetailController.prototype = {
	//디테일화면에서 보여질 데이터 조회
	getDetailData: function (paintingId, color, colorDark) {
		var controller = this;

		AjaxCall.call(apiUrl+"/painting/"+paintingId, null, "GET", function (result, status) { controller.getDetailDataRes(result, status, paintingId, color, colorDark); });
	},
	getDetailDataRes: function (result, status, paintingId, color, colorDark) {

		//loadDetail 에서 하던내용
		initDetail(paintingId, result);
		setDetailLayout();

		$(".detail").show().css("top", 200);
		$(".detail").animate({top: 0, opacity: 1}, 200);
		$(".detail_bg_container").css("background-color", "hsl("+color+")");
		$(".detail_bg_bottom").css("background-color", "hsla("+colorDark+", 1)");
		$(".detail_artist").css("background-color", "hsla("+colorDark+", 0.7)");
		$(".detail_postbar").css("background-color", "hsla("+colorDark+", 1)");

		lockPosted(detailSwiper);
	},
	artistFollow: function(artistId) {
		var controller = this;

		console.log("artistFollow=>artistId:"+artistId);
		console.log("artistFollow=>selectedArtistId:"+selectedArtistId);
		AjaxCall.call(apiUrl+"/user/"+selectedArtistId+"/follow", null, "POST", function(result, status) { controller.artistFollowRes(result, status); });
	},
	artistFollowRes: function(result, status) {
		console.log(selectedArtistId);
		if(result.errorNo == 0) {
			alert(selectedArtistName+' 님을 Follow 하였습니다.');
		} else if(result.errorNo == 501){
			alert(selectedArtistName+' 님은 이미 Follow 되어있습니다.');
		}
	}
};

//디테일화면 표시
function loadDetail(paintingId, color, colorDark) {
	selectedPaintingId = paintingId;
	new DetailController().getDetailData(paintingId, color, colorDark);
}

//디테일화면 초기화
function initDetail(paintingId, paintingInfo){
 isDetail = true;
 postedLock = true;
 postedObj = new Array();
 postedIndex = new Array();

 selectedArtistId = paintingInfo.artistId;
 selectedArtistName = paintingInfo.artistName;

 //this.detailStructure = new DetailStructure(index);
 this.detailStructure = new DetailStructure(paintingId, paintingInfo.fileId, paintingInfo.artistName, paintingInfo.artistId, paintingInfo.sentence, paintingInfo.uploadDate, paintingInfo.postedNum);
 this.detailStructure.buildDetail();

 this.detailSwiper = new Swiper('.swiper_container_detail', {
     direction: 'vertical',
     slidesPerView: 'auto',
     centeredSlides: false,
     freeMode: false,
     freeModeMomentumRatio: 0.4,
     freeModeMomentumBounceRatio: 0.5,
     mousewheelControl : true,
     scrollbar: '.swiper-scrollbar-detail',
     scrollbarHide: true
 });
 this.detailSwiper.on("onSliderMove", function(swiper){
     changeMode(swiper);
 });
 this.detailSwiper.on("onSetTranslate", function(swiper){
     changeMode(swiper);
 });
}

//디테일화면 css값 설정
function setDetailLayout(){
 mainWidth = $(window).width();
 mainHeight = $(window).height();
 $(".detail_bg_container").css("height", mainHeight-50);
 $(".detail_bg_container").find("img").css("height", "100%");
 $(".detail_margin").css("height", mainHeight-50);
 $(".detail_artist_sentence").css("width", mainWidth);
 $(".detail_artist_sentence").css("height", $(".detail_artist").height()-100);
 if(mainHeight<625){
     postedLockBreakpoint = -250;
     $(".detail_artist_sentence").css("height", 150);
 }else{
     postedLockBreakpoint = -(mainHeight*0.4);
     $(".detail_artist_sentence").css("height", -(postedLockBreakpoint)-100);
 };
}

//디테일화면 닫기
function closeDetail(){
 if(isDetail){
     $(".detail").animate({top: 200, opacity: 0}, 200, "linear", function(){
         $(".detail").empty();
         $(".detail").hide().css("top", 0);
         delete detailStructure;
         delete detailSwiper;
     });
     isDetail = false;   
 }
}

//디테일화면의 스크롤 잠금/열기
function changeMode(swiper){            
 var translate = swiper.translate;

 if(translate>50){
     closeDetail();
 }else if(translate<postedLockBreakpoint){
     if(postedLock){
         unlockPosted(swiper);
     }
     callPosted(swiper);
 }else if(translate>=postedLockBreakpoint){
     if(!postedLock){
         lockPosted(swiper);
     }
 }
}

//디테일화면의 스크롤 잠금
function lockPosted(swiper){
 console.log("lock!");

 postedLock = true;
 hidePosted(swiper);
 swiper.params.freeMode = false;

 $(".swiper-scrollbar-detail").hide();
 $(".detail_post_btn").appendTo($(".swiper_container_detail"))
}

//디테일화면의 스크롤 열기
function unlockPosted(swiper){
 console.log("unlock!");

 postedLock = false;
 swiper.params.freeMode = true;

 callPosted(swiper);

 $(".swiper-scrollbar-detail").show();
 $(".detail_post_btn").appendTo($(".detail_postbar"))
}

//Detail화면의 댓글 구조
function Posted(purchaseSeq, userId, userName, userSentence){
 this.purchaseSeq =purchaseSeq;
 this.userId = userId;
 this.userName = userName;
 this.userSentence = userSentence;

 this.container   =$("<div>").addClass("detail_posted swiper-slide").html("posted by ").css("background-color", "hsl("+colorDark+")");
 this.postee      =$("<div>").addClass("detail_postee_btn");
 this.sentence    =$("<div>").addClass("detail_posted_sentence").css("width", mainWidth*0.96);
}
Posted.prototype = {
 setPostee:      function(userName){
     this.postee.html(userName);
 },
 setSentence:    function(userSentence){
     this.sentence.html(userSentence);
 },
 buildPosted:    function(){
     this.setPostee(this.userName);
     this.setSentence(this.userSentence);
     this.container.append(this.postee);
     this.container.append(this.sentence);

     return this.container;
 }
}

var isBlock = false;

function PostedController() {
	this.swiper = '';
}
PostedController.prototype = {
	getPostedData: function(startRow, rowPerPage, swiper) {
		var controller = this;

		if(!isBlock) {
			isBlock = true;

			this.swiper = swiper;
			AjaxCall.call(apiUrl+"/posted?paintingId="+selectedPaintingId+"&startRow="+startRow+"&rowPerPage="+rowPerPage, null, "GET", function (result, status) { controller.getPostedDataRes(result, status); } );
		}
	},
	getPostedDataRes: function(result, status) {

		for (var index in result.list) {
			addPosted(this.swiper, result.list[index]);
		}

		isBlock = false;
	}
}

function addPosted(swiper, postedInfo) {
	var newPosted = new Posted(postedInfo.purchaseSeq, postedInfo.userId, postedInfo.userName, postedInfo.sentence);
	postedObj[swiper.slides.length-initPostedSlideCnt] = newPosted.buildPosted();
	postedIndex.push(swiper.slides.length);
	delete newPosted;

	swiper.appendSlide(postedObj[swiper.slides.length-initPostedSlideCnt]);
}

//Detail화면의 댓글 무한스크롤 (10개씩 추가)
function callPosted(swiper){
	var isPostedEnd;
	console.log(swiper.slides.length+":"+swiper.activeIndex);

	var rowPerPage = 5;
	var detailPostedCnt = swiper.slides.length - initPostedSlideCnt;

	//console.log("detailPostedCnt:"+detailPostedCnt+", "+((swiper.activeIndex+2) - initPostedSlideCnt));
	if(detailPostedCnt == 0 || detailPostedCnt == ((swiper.activeIndex+3) - initPostedSlideCnt)) {//현재 화면에 출력된 slide 중 가장 마지막 slide 호출시 rowPerPage 만큼 데이터를 요청한다.
		new PostedController().getPostedData(detailPostedCnt, rowPerPage, swiper);
	}
/*
	if(swiper.slides.length<swiper.activeIndex+10 && swiper.slides.length<=20){
		for(swiper.slides.length ; swiper.slides.length < swiper.activeIndex+10 ;){
			if(swiper.slides.length > 20){
				break;
			}
			if(!postedObj[swiper.slides.length-3]){
				var newPosted = new Posted(swiper.slides.length-3);
				postedObj[swiper.slides.length-3] = newPosted.buildPosted();
				postedIndex.push(swiper.slides.length);
				delete newPosted;
			}
		swiper.appendSlide(postedObj[swiper.slides.length-3]);
		}
	}
*/
}

//Detail화면의 댓글 지우기
function hidePosted(swiper){
/*	var tot = swiper.slides.length;
	var removeIndex = tot-1;

	for(var i=removeIndex; i > 3; i--) {
		swiper.removeSlide(removeIndex);
	}*/
	//swiper.removeSlide(postedObj);
	swiper.removeSlide(postedIndex);
	//$(".detail_posted").remove();
}

/* ori
DetailStructure.prototype   ={
    setBG       : function(index){
        this.detailBgImg.attr("src", "p"+index%5+".png");
    },
    setArtist   : function(index){
        this.detailArtistBtn.html("artist"+index);
    },
    setFollow   : function(index){
        this.detailArtistFollow.append('<i class="material-icons" style="font-size:12px">star</i> follow artist');
    },
    setSentence : function(index){
        this.detailArtistSentence.html("여기에는 작가가 쓴 한마디가 나오겠지?");
    },
    setDate     : function(index){
        this.detailArtistDate.html("05. May");
    },
    setPostedNum: function(index){
        this.detailPostbarPostedNum.html(1+index);
    },
    buildDetail : function(){
        this.setBG(this.index);
        this.setArtist(this.index);
        this.setFollow(this.index);
        this.setSentence(this.index);
        this.setDate(this.index);
        this.setPostedNum(this.index);

        this.detailBgContainer.append(this.detailBgImg);

        this.detailMargin.append(this.detailCloseIcon);
        this.detailMargin.append(this.detailMarginIcon);

        this.detailArtistTop.append(this.detailArtistBtn);
        this.detailArtistTop.append(this.detailArtistFollow);
        this.detailArtistSentence.append(this.detailArtistDate);
        this.detailArtistBottom.append(this.sociconFacebook);
        this.detailArtistBottom.append(this.sociconTwitter);
        this.detailArtistBottom.append(this.sociconInstagram);
        this.detailArtistBottom.append(this.sociconPinterest);
        this.detailArtist.append(this.detailArtistTop);
        this.detailArtist.append(this.detailArtistSentence);
        this.detailArtist.append(this.detailArtistBottom);

        this.detailPostbarPostnum.append(this.detailPostbarPostedNum).append(" people already posted it");
        this.detailPostbar.append(this.detailPostbarPostnum);

        this.wrapper.append(this.detailMargin);
        this.wrapper.append(this.detailArtist);
        this.wrapper.append(this.detailPostbar);

        this.detailContainer.append(this.wrapper);

        this.detail.append(this.detailBgContainer);
        this.detail.append(this.detailBgBottom);
        this.detail.append(this.detailContainer);
        this.detail.append(this.detailPostBtn);
        this.detail.append(this.detailScroll);
    }
}


//디테일화면 초기화
function initDetail(index){
 isDetail = true;
 postedLock = true;
 postedObj = new Array();
 postedIndex = new Array();

 this.detailStructure = new DetailStructure(index);
 this.detailStructure.buildDetail();

 this.detailSwiper = new Swiper('.swiper_container_detail', {
     direction: 'vertical',
     slidesPerView: 'auto',
     centeredSlides: false,
     freeMode: false,
     freeModeMomentumRatio: 0.4,
     freeModeMomentumBounceRatio: 0.5,
     mousewheelControl : true,
     scrollbar: '.swiper-scrollbar-detail',
     scrollbarHide: true
 });
 this.detailSwiper.on("onSliderMove", function(swiper){
     changeMode(swiper);
 });
 this.detailSwiper.on("onSetTranslate", function(swiper){
     changeMode(swiper);
 });
}
*/