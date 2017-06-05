$(function(){
            var sUrl='http://www.wookmark.com/api/json/popular?callback=?';//图片数据
            var iPage=0;
            var oContainer=$('#container');
            var oLoder=$('#loder');
            var iWidth=200;//列宽
            var iSpace=10;//间隔
            var iOuterWidth=iWidth+iSpace;//列实际宽
            var iCells=0;//列数
            var arrL=[];//每列的left值
            var arrT=[];//每列的top值
            var iBtn=true;


            function setCells(){
                iCells=Math.floor( $(window).innerWidth()/iOuterWidth);
                if(iCells<3){
                    iCells=3;
                }
                if(iCells>6){
                    iCells=6;
                }



                document.title=iCells;
                oContainer.css('width',iOuterWidth*iCells-iSpace);

            }

            setCells();
            getData();
            for (var i=0;i<iCells;i++){
                arrT.push(0);//存放每列的top值
                arrL.push(i*iOuterWidth);//存放每列的left值
            }
//          console.log(arrT);
//          console.log(arrL);
            function getData(){
                if (iBtn){
                    iBtn=false;

                    oLoder.show();
                    $.getJSON(sUrl,'page='+iPage,function(data){
//                      console.log(data);
                        $.each(data,function(index,obj){
                            var oImg=$('<img/>');
                            oImg.attr('src',obj.preview);
                            oContainer.append(oImg);//添加图片到div

                            var iHeight=iWidth/obj.width*obj.height;//缩放

                            oImg.css({
                                width:iWidth,
                                Height:iHeight
                            });



                            //获取arrT最小值所在的位置
                            var iMinIndex=getMin();
                            //设置定位
                            oImg.css({
                                left:arrL[iMinIndex],
                                top:arrT[iMinIndex]
                            });
                            arrT[iMinIndex]+=iHeight+10;
                        });
                        oLoder.hide();//隐藏loder图片
                        iBtn=true;
                    });//获取图片数据
                }
            }



            /*
             * 当窗口发生变化时，列数也发生变化
             * */
            $(window).on('resize',function() {

                var iOldCells = iCells;

                //先计算当前的列数
                setCells();
                var iH = $(window).scrollTop() + $(window).innerHeight();
                var iMinIndex = getMin();
                if (arrT[iMinIndex] + oContainer.offset().top < iH) {
                    iPage++;
                    getData();

                    if (iOldCells == iCells) {
                        return;
                    }
                    //清空arrT arrL
                    arrL = [];
                    arrT = [];
                    for (var i = 0; i < iCells; i++) {
                        arrT.push(0);//存放每列的top值
                        arrL.push(i * iOuterWidth);//存放每列的left值
                    }
                    var aImgs = oContainer.find('img');
                    aImgs.each(function () {
                        var iMinIndex = getMin();
                        /*$(this).css({
                        left:arrL[iMinIndex],
                        top:arrT[iMinIndex]
                    });
                    */
                    //动画
                    $(this
                    ).animate({
                       left:arrL[iMinIndex],
                       top:arrT[iMinIndex]
                    });
                        arrT[iMinIndex]+=$(this).height()+10;
                });

            }
                });




            $(window).on('scroll',function(){
                var iH=$(window).scrollTop()+$(window).innerHeight();
                var iMinIndex=getMin();
                if(arrT[iMinIndex]+oContainer.offset().top<iH){
                    iPage++;
                    getData();
                }
            });
            /*
             * 获取最短的列
             *
             */
            function getMin(){
                var iv=arrT[0];
                var _index=0;
                for (var i=0;i<arrT.length;i++){
                    if(arrT[i]<iv){
                        iv=arrT[i];
                        _index=i;
                    }
                }
                return _index;
            }

        });