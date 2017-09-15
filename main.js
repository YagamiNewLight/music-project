/**
 * Created by WKZ on 2017/9/7.
 */
!function () {
    var audio = document.createElement('audio');
    var lyric = document.createElement('div');
    var $lyric = $(lyric);
    var height = -60;
//初始化AV
    function AVinit(){
        var APP_ID = 'mILQIQweB355cMMwGy6EG0n0-gzGzoHsz';
        var APP_KEY = '6BUMFbB1BVsphGS0CwCiYTDy';
        return AV.init({
            appId: APP_ID,
            appKey: APP_KEY
        });
    }
//getIdByUrl

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    function main(){
        addSongInfoToPage();
        audio.oncanplay = function() {
            addListener();
        }
        audio.onplaying = function(){
                if($('.myData').length ===1){
                    $($('.myData')[0]).addClass('active');
                    $('.lyric').css('top',$('.myData')[0].clientHeight);
                }
                window.intervalID = setInterval(function(){
                    var time = audio.currentTime;
                    for(var i = 0;i<$('.myData').length;i++){
                        var d =  $('.myData')[i].clientHeight;
                        var dataTime = $($('.myData')[i]).attr('data-time');
                        if(hmsToSeconds(dataTime).toFixed0() === time.toFixed0()){
                            $($('.myData')[i]).addClass('active');
                            if($('.myData')[i-1]){
                                $($('.myData')[i-1]).removeClass('active');
                            }
                            if(d){
                                height += d;
                            }
                            $('.lyric').css('top',-height);
                        }
                    }

                },1000);
            }
        audio.onpause = function(){
            clearInterval(intervalID);
        }
        audio.onended = function(){
            toggle();
            height = -60;
        };
    }
    function addSongInfoToPage(){
        var query = new AV.Query('song');
        var id = getParameterByName('id');
        AVinit();
        query.get(id).then(success);
    }
    function success(song){
        audio.src = song.attributes.url;
        dynamicLoad(song);
        addTitle(song);
        dynamicAddLyrics(song);
    }
    function dynamicAddLyrics(song) {
        lyric.classList.add('lyric');
        var array = regexParse(song);
        array.map(function(object){
            if(object){
                var p = document.createElement('p');
                p.setAttribute('data-time',object.time);
                p.textContent = object.words;
                p.classList.add('myData');
                lyric.appendChild(p);
                }
        });
        $('.lyricWrapper').append($lyric);
    }
    function regexParse(song) {
        var regex = /^\[(.+)\](.*)$/;
        var array  = song.attributes.lyric.split('\n');
        if(array.length>3){
            array = array.map(function(string){
                var matches = string.match(regex);
                if(matches){
                    return {time:matches[1],words:matches[2]}
                }
            });
        }else{
            return [{time:null,words:array[0]}]
        }
        return array
    }

    function dynamicLoad(song){
        $('.undergroundImg').css("background-image",'url('+song.attributes.cover+')');
        $('.diezi>.innerPic>img').attr('src',song.attributes.cover)
    }
    function addTitle(song) {
        var span1 = document.createElement('span')
        var span2 = document.createElement('span')
        var p = document.createElement('p');
        p.classList.add('title');
        span1.classList.add('name');
        span1.textContent = song.attributes.name + ' - ';
        span2.textContent = song.attributes.singer;
        $(p).append(span1).append(span2);
        $(p).insertBefore('.lyricWrapper');
    }
    function hmsToSeconds(hms){
        var a = hms.split(':');
        var seconds = (+a[0])* 60 + (+a[1]);
        return seconds;
    }
    Number.prototype.toFixed0=function (){
        return parseFloat(this.toString().replace(/(\.\d{0})\d+$/,"$1"));
    };
    function addListener(){
        $('.play').on('click',play);
        $('.pause').on('click',pause);
    }

    function  play() {
        audio.play();
        $('.play').addClass('active');
        $('.pause').removeClass('active');
        $('.needle').addClass('active');
        addPlayingClass($('.guanghuan'));
    }

    function addPlayingClass(element){
        if(element.hasClass('playing')){}
        else{
            element.addClass('playing')
        }
    }

    function pause(){
        audio.pause();
        toggle();
    }
    function toggle(){
        var ghContainer = document.querySelector('.guanghuanImg');
        var ghImg = ghContainer.querySelector('img');
        var ipContainer = document.querySelector('.innerPic');
        var ipImg = ipContainer.querySelector('img')
        $('.needle').removeClass('active');
        $('.pause').addClass('active');
        $('.play').removeClass('active');
        pausing(ghContainer,ghImg);
        pausing(ipContainer,ipImg);
        $('.guanghuan').removeClass('playing');
    }
    function pausing(container,image) {
        var iTransform = getComputedStyle(image).transform;
        var cTransform = getComputedStyle(container).transform;
        container.style.transform = cTransform === 'none'
            ? iTransform
            : iTransform.concat(' ', cTransform);
    }
    main();
}();
