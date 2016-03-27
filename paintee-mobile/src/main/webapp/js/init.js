// 전역변수 설정
var mainWidth;
var slideWidth;
var userID = "";
var currentSwiper="";
var color;
var colorDark;
var purchaseWidth;
var purchaseStatus="";
var boxWidth;
var boxHeight;
var boxStatus="";
var popName="";

var userInfo = getUserInfoCookie();

if(userInfo) {
	userID = userInfo.email;
} else {
	userID = '';
}

// 나중에 로그인 사용자의 언어를 설정해야 한다.
var lang = "en";

//if(userInfo) {
//	console.log('userInfo.location:'+userInfo.location);
//	lang = userInfo.location;
//}

console.log('lang:'+lang);
console.log('userID:'+userID);

// 최초 화면 로딩시 해야할 일
$(function () {
	setSideMenu();  // 사이드 메뉴 설정
});

/**
 * 사이드 메뉴의 액션 설정 및 활성화/비활성화 처리
 */
function setSideMenu() {
	// 사이드 메뉴 활성화 및 비활성화 설정
	if (!userID) {
		$("#menu_upload").addClass("side_menu_minor_inactive").click(sideOff);
		$("#menu_reward").addClass("side_menu_minor_inactive").click(sideOff);
	}
	else {
		$("#menu_upload").click(function(){
		    upload();
		    sideOff();
		});
		$("#menu_reward").click(function(){
		    reward();
		    sideOff();
		});
	}

	// 사이드 메뉴 언어 설정
	// 로그인 정보를 매번 가져오지 않기 때문에 사이트 로딩시 로그인 상태일 경우만 로그인 정보를 가져온다.
	if (userInfo) {
		AjaxCall.call(apiUrl + "/user/me", 
			null, 
			"GET", 
			function (result) {
				lang = result.userInfo.location;
				$(".side_menu_lang_select").val(lang);
			}
		);
	}
}


//var imageUrl="http://192.168.0.14:8090";
//var imageUrl="http://10.100.69.12:8090";
//var imageUrl="http://192.168.1.31:8090";
//var imageUrl="http://192.168.43.63:8090";
//var imageUrl="http://192.168.0.9:8090";
var imageUrl="http://localhost:8090";
//var imageUrl="http://localhost:8090";
//var imageUrl="http://192.168.43.89:8090";
//var imageUrl="http://192.168.1.31:8090";
//var imageUrl="http://192.168.43.63:8090";
//var imageUrl="http://192.168.0.9:8090";
var apiUrl=imageUrl+"/api";

setWidth();

// main container 시작
var mainSwiper = new Swiper('.swiper_container', {
    direction: 'vertical',
    mousewheelControl : true
});

// 각각의 home 화면 (follow/popular/new/my)
function Home(){
        this.container  =$("<div>").addClass("home_container swiper-slide");
        this.prev       =$("<div>").addClass("home_prev").html('<i class="material-icons">keyboard_arrow_down</i>');
        this.title      =$("<div>").addClass("home_title");
        this.contents   =$("<div>").addClass("home_contents");
        this.add        =$("<div>").addClass("home_contents_add");
        this.next       =$("<div>").addClass("home_next").html('<i class="material-icons">keyboard_arrow_up</i>');
}

Home.prototype = {
        setTitle:       function(title){
                            this.title.html(title);
                        },
        setExplain:     function(explain){
                            this.contents.html(explain);
                        },
        setContents:    function(contents){
                            this.contents.append(contents);
                        },
        setAdd:         function(contents){
                            this.add.append(contents);
                        },
        hidePrev:       function(){
                            this.prev.hide();
                        },
        hideNext:       function(){
                            this.next.hide();
                        },
        buildStructure: function(){
                            this.container.append(this.prev);
                            this.container.append($("<div>").addClass("home_title_margin"));
                            this.container.append(this.title);
                            this.container.append($("<div>").addClass("home_contents_margin"));
                            this.container.append(this.contents);
                            this.container.append($("<div>").addClass("home_contents_margin"));
                            this.container.append(this.add);
                            this.container.append(this.next);
                            return this.container;
                        }
}

// 그림 목록 화면
function Structure(index, paintingId, artistName){
		
        this.index              =index;
        this.container          =$("<div>").addClass("list_contents swiper-slide");

        this.listInfo           =$("<div>").addClass("list_info");
        this.listInfoRow_1      =$("<div>").addClass("list_info_row");
        this.listInfoRow_2      =$("<div>").addClass("list_info_row");
        this.listInfoSentence   =$("<div>").addClass("list_info_sentence");
        this.listInfoPosted     =$("<div>").addClass("list_info_posted");
        this.listInfoDate       =$("<div>").addClass("list_info_date");

        this.listPainting       =$("<div>").addClass("list_painting").attr("index", this.index);

        this.bottom             =$("<div>").addClass("bottom_bar");
        this.listArtist         =$("<div>").addClass("list_artist_btn").click(function() {
        							console.log("currentSwiper : " + currentSwiper);
						        	// 히스토리 설정
						        	replaceHistory({"call": "list", "mainIndex": mainSwiper.activeIndex, "index": currentSwiper.activeIndex ? currentSwiper.activeIndex : index});
						        	addHistory({"call": "personal"});
        							showPersonal(artistName)
        						});
        this.listPostBtn        =$("<div>").addClass("list_post_btn").html("post it").click(function(){purchase(paintingId, artistName)});

}
Structure.prototype = {
        setSentence:        function(sentence, wrighter){
                                this.listInfoSentence.html(sentence+"<br> <span class='list_info_sentence_wrighter'> by <b>"+wrighter+"</b></span>");
                            },
        setPostedNumber:    function(postedByPeople){
                                this.listInfoPosted.html("<span class='list_info_posted_num'>"+postedByPeople+"</span> people already posted it")
                            }, 
        setDate:            function(date){
                                this.listInfoDate.html(date)
                            },
        setPainting:        function(paintingId, imageUrl){
                                    if(mainWidth<729){
                                        this.listPainting.css({"width": mainWidth*0.8, "height": mainWidth*10/9});
                                    }else{
                                        this.listPainting.css({"width": "648px", "height": "900px"});
                                    }
                                this.listPainting.css("background-image", "url(" + imageUrl + ")");
                                this.listPainting.swipe({
                                    swipeUp:function(){
                                        loadDetail(paintingId, color, colorDark);
                                        replaceHistory({"call": "detailPop"});
                                        addHistory({"call": "dummy"});
                                    },
                                    tap:function(){
                                        loadDetail(paintingId, color, colorDark);
                                        replaceHistory({"call": "detailPop"});
                                        addHistory({"call": "dummy"});
                                    },
                                    threshold:10
                                });
                            },
        setColor:           function(color){
                                this.bottom.css("background-color", color);
                                this.listPostBtn.css("color", color);
                            },
        setArtist:          function(name){
                                this.listArtist.html(name);
                            },
        buildStructure:     function(){
                                this.listInfoRow_1.append(this.listInfoSentence);
                                this.listInfo.append(this.listInfoRow_1);
                                this.listInfoRow_2.append(this.listInfoPosted);
                                this.listInfoRow_2.append(this.listInfoDate);
                                this.listInfo.append(this.listInfoRow_2);
                                this.container.append(this.listInfo);
                                this.container.append(this.listPainting);
                                this.container.append(this.bottom);
                                this.container.append(this.listArtist);
                                this.container.append(this.listPostBtn);

                                return this.container;
                            }
}

// 현재 슬라이드 위치에서 앞으로 5개의 슬라이드가 없으면 새로 생성 (무한스크롤)
function addPainting(swiper, currentIndex, type, listData){
	
	if (!listData) { return; }
	
	var newSlide = new Structure(swiper.slides.length, listData.paintingId, listData.artistName);
    newSlide.setSentence(listData.sentence, listData.sentenceName ? listData.sentenceName : listData.artistName);
    newSlide.setPostedNumber(listData.postedPeopleCnt);
    newSlide.setDate(toEngDateStr(listData.uploadDate));
    newSlide.setArtist(listData.artistName);
    newSlide.setPainting(listData.paintingId, imageUrl + "/cmm/file/view/" + listData.fileId);
    if (type=="follow") {
        newSlide.setColor("hsl(200,60%,20%)");
    } else if (type=="popular") {
        newSlide.setColor("hsl(330,60%,20%)");
    } else if (type=="new") {
        newSlide.setColor("hsl(90,60%,20%)");
    } else if (type=="my") {
        newSlide.setColor("hsl(250,60%,20%)");
    }
    swiper.appendSlide(newSlide.buildStructure());
    delete newSlide;    
}

// 최초 5개 미리 생성
initMenu(userID);

// mainSwiper의 첫항목과 마지막항목에서 스와이프 방지
function mainLock(mainSwiper){
    if(mainSwiper.activeIndex==0){
        mainSwiper.lockSwipeToPrev();
        color = "190,60%,50%";
        colorDark = "200,60%,20%";
        if(isPersonal){hidePersonal()};
    }else if(mainSwiper.activeIndex==1){
        mainSwiper.unlockSwipes();
        color = "330,60%,50%";
        colorDark = "330,60%,20%";
        if(isPersonal){hidePersonal()};
    }else if(mainSwiper.activeIndex==2){
        mainSwiper.unlockSwipes();
        color = "80,60%,45%";
        colorDark = "90,60%,20%";
        if(isPersonal){hidePersonal()};
    }else if(mainSwiper.activeIndex==3){
        mainSwiper.lockSwipeToNext();
        color = "250,60%,50%";
        colorDark = "250,60%,20%";
        if(isPersonal){hidePersonal()};
    }
    currentSwiper="";
};


// list 상태에서 mode container 스와이프 방지 && 마우스휠 해제/설정 && 페이지네이션 show/hide
function listLock(swiper){  
    if(swiper.isBeginning){
        if(mainSwiper.isBeginning){
            mainSwiper.unlockSwipeToNext();
        }else if(mainSwiper.isEnd){
            mainSwiper.unlockSwipeToPrev();
        }else{
            mainSwiper.unlockSwipes();
        }
        swiper.disableMousewheelControl();
        $(".swiper-scrollbar").hide();
        $(".home_btn").hide()
        $(".bottom_bar").css("opacity", 0);
    }else{
        mainSwiper.lockSwipes();
        swiper.enableMousewheelControl();
        $(".swiper-scrollbar").show();
        $(".home_btn").show()
        $(".bottom_bar").css("opacity", 1);
        currentSwiper=swiper;
    }
}
mainSwiper.on("onTransitionEnd", function(mainSwiper){mainLock(mainSwiper)});

// side menu 초기설정
function initMenu(userID){
    var sideLogin = $("#side_menu").find(".side_menu_login");
    if(userID==""){
        sideLogin.append($("<div>").addClass("login_btn").html("Log in").css("border-color", "rgb(100,100,100)").click(function(){showLogin()}));
    }else{
        sideLogin.empty()
        sideLogin.append($("<div>").addClass("side_menu_login_id").html(userID));
//        sideLogin.append($("<div>").html("edit | logout").click(function(){showProfile()}));

        //TODO:profile edit 버튼과 logout 버튼 분리 디자인 확인해야함.
        var editBtn = $("<a>").html("edit").on("click", function(){showProfile()});
        var logoutBtn = $("<a>").html("logout").on("click", function(){logout()});

        var btnGroup = $("<div>").append(editBtn).append(" | ").append(logoutBtn);

        sideLogin.append(btnGroup);
    }
}

// side menu 이동
sideMenu = $("#side_menu");
function sideOn(){
    sideMenu.css("right", mainWidth-sideMenu.width());
    sideMenu.find(".side_menu_btn").hide();
    sideMenu.find(".side_menu_close").show();

    mainSwiper.lockSwipes();
    $(".modal").show();
    $(".modal").on("touchstart mousedown", function(e){
        e.stopPropagation();
        sideOff();
    });
}
function sideOff(){
    sideMenu.css("right", "100%");
    sideMenu.find(".side_menu_close").hide();
    sideMenu.find(".side_menu_btn").show();
    mainSwiper.unlockSwipes();

    $(".modal").hide();
}
sideMenu.find(".side_menu_btn").click(function(){
    sideOn();
});
sideMenu.find(".side_menu_close").click(function(){
    sideOff();
});
sideMenu.swipe({
    swipeLeft:function(){
        sideOff();
    }
});

//side menu에 이벤트 설정
function selectMenu(index){
    if(currentSwiper!==""){
        currentSwiper.slideTo(0);   
    }
    sideOff();
    mainSwiper.slideTo(index);
}

// 초기 설정들
// 가로휠방지 && 페이지네이션숨김 && 위로스와이프방지
mainSwiper.lockSwipeToPrev();
$(".swiper-scrollbar").hide();
$(".home_btn").hide()

// 화면 리사이즈할때 layout 재 설정
$(window).resize(function (){
	setWidth();
    sideOff();
    if(isDetail){
        setDetailLayout();
    }
});

function setWidth() {
    mainWidth = $(window).width();
    mainHeight = $(window).height();    
    if(mainWidth>729){
    	slideWidth=648;
        $(".list_painting").css({"width": "648px", "height": "900px"});
    }else{
    	slideWidth=mainWidth*0.8;
        $(".list_painting").css({"width": slideWidth, "height": mainWidth*10/9});
    }
    if(purchaseStatus!=""){
        setPurchase();
    }
    setBox();
}

// upload/posted 버튼 설정
function btnToggle(btn){
    $(btn).toggleClass("home_btn_inactive");
}

// list의 맨앞으로 되돌아가기 버튼
$(".home_btn").click(function(){
    currentSwiper.slideTo(0);
})

// 스와이프해서 메뉴창 띄우기
 function swipeToMenu(swiper, translate){
     if(translate>((mainWidth/2)-(slideWidth/3))){
         sideOn();
     }
 }

// 모바일 웹브라우져를 전체화면으로 표시
$("#fullscreen_btn").click(function(){toggleFullScreen()});

function toggleFullScreen() {
    var doc = window.document;
    var docEl = doc.documentElement;

    var requestFull = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen;
    var cancelFull = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen;

    if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement) {
        requestFull.call(docEl);
        $("#fullscreen_btn").find("i").html("fullscreen_exit");
    }else {
        cancelFull.call(doc);
        $("#fullscreen_btn").find("i").html("fullscreen");
    }
}


// 업로드/리워드가 표시되는 팝업창 사이즈 설정
function setBox(){
    if(boxStatus!=""){
        $(".popup_box").height(mainHeight*0.8);
        $(".popup_box").width($(".popup_box").height()*0.72);

        if($(".popup_box").width()>mainWidth*0.8){
            $(".popup_box").width(mainWidth*0.8);
            $(".popup_box").height(mainWidth*10/9);
        }
    }
}

// 팝업 닫기
$(".return_btn").click(function(){
	// 구매 정보 초기화
	closePopup();
});

$(".popup_container").click(function(){
	closePopup();
    popName = "";  // 다시 초기화
});

function closePopup() {
	console.log("boxStatus : " + boxStatus);
	
	// boxStatus payment
	if (boxStatus == "payment") {
		// 구매 정보 초기화
		resetPurchase();
		purchaseStatus = "";
		$(".purchase_container").hide();
		history.go(-2);
		boxStatus = "";
	} 
	else if (boxStatus == "rewardStep2") {
		history.go(-2);
	}
	else {
		history.back();
	}
    $(".popup_container").hide();
    boxStatus = "";
}

$(".popup_box").click(function(e){
    e.stopPropagation();
});

/**
 *   홈 페이지 데이터 리로딩
 *   그림 구매시 : My, Popular  
 *   팔로우 대상 변경 시 : Follow, 
 */
function dataReload(loadPages) {
	console.log("dataReload.....");
	for (var index in loadPages) {
		eval(loadPages[index]);
	}
}

/**
 *  사이드 메뉴 언어 선택시 테이블 언어 변경 및 화면 언어 적용
 */
$(".side_menu_lang_select").change(function(event) {
	lang = $(this).val();
	exeTranslation(".main_container", lang);
	if (userID) {
		AjaxCall.call(apiUrl + "/user/me", 
			{"location": lang}, 
			"POST", 
			function (result) {
				console.log(result);			
			}
		);
	} 
});
