$(function(){
    var page='CA0QAA',nextPageToken='',prevPageToken='';
    $('form').on('submit',function(e){
        e.preventDefault();
        $('#videoshow').html('');
        getResult('');
    });
    function getResult(page){
        var dateAfter=new Date($('#dateAfter').val());
        var request=gapi.client.youtube.search.list({
            part: 'snippet',
            type: 'video',
            q: encodeURIComponent($('#search-text').val()).replace(/%20/g,'+'),
            order: 'viewCount',
            pageToken:page,
            publishedAfter: dateAfter.toString("yyyy-MM-dd")+'T00:00:00Z'
        });
        request.execute(setData);
    }
    function setData(result){
        if(result.items){

            var $resultBox=$('#resultBox'),resHtml="",n=0;
            for(var v of result.items){
                var resDate=new Date(v.snippet.publishedAt);
                resHtml+=`
                    <div class="res">
                        <a href="https://www.youtube.com/watch?v=${v.id.videoId}" target="_blank"><img src="${v.snippet.thumbnails.medium.url}" alt=""></a>
                        <p>${v.snippet.title}</p>
                        <small><span>Channel: </span>${v.snippet.channelTitle}</small>
                        <small>published at: ${resDate.toString("dd.MM.yyyy")}</small>
                        <button data-src="https://www.youtube.com/v/${v.id.videoId}">play</button>
                    </div>
                `;

            }
            $resultBox.html(resHtml);
            $('.res>button').click(function(){
                var videoHtml=`
                        <object  data="${$(this).data('src')}">
                        </object>
                    `;
                    $('#videoshow').html(videoHtml);
                    $('html, body').animate({
                        scrollTop: $('#videoshow').offset().top
                    }, 2000);
            })
            $('#nextBtn').show();
            $('#prevBtn').show();
            if(result.nextPageToken){
                nextPageToken=result.nextPageToken;
                $('#nextBtn').removeAttr("disabled");
                $('#nextBtn').click(function(){
                    getResult(nextPageToken);
                });
            }else{
                $('#nextBtn').attr("disabled", "disabled");
            }

            if(result.prevPageToken){
                prevPageToken=result.prevPageToken;
                $('#prevBtn').removeAttr("disabled");
                $('#prevBtn').click(function(){
                    getResult(prevPageToken);
                });
            }else{
                $('#prevBtn').attr("disabled", "disabled");
            }
        }
        else if(result.code==400){
            $('#resultBox').html('No result !!!');
            $('#nextBtn').hide();
            $('#prevBtn').hide()
        }
        else{
            $('#resultBox').html('Error try again !!!');
            $('#nextBtn').hide();
            $('#prevBtn').hide()
        }
        
    }
});

function init(){
    const myKey='AIzaSyAN15m-Kwx1HVr0iVCeJT6_E_X88C-inIc';
    gapi.client.setApiKey(myKey);
    gapi.client.load('youtube','v3',function(){});
}
