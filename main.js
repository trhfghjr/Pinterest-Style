$(function(){
            var sUrl='http://www.wookmark.com/api/json/popular?callback=?';//ͼƬ����
            var iPage=0;
            var oContainer=$('#container');
            var oLoder=$('#loder');
            var iWidth=200;//�п�
            var iSpace=10;//���
            var iOuterWidth=iWidth+iSpace;//��ʵ�ʿ�
            var iCells=0;//����
            var arrL=[];//ÿ�е�leftֵ
            var arrT=[];//ÿ�е�topֵ
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
                arrT.push(0);//���ÿ�е�topֵ
                arrL.push(i*iOuterWidth);//���ÿ�е�leftֵ
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
                            oContainer.append(oImg);//���ͼƬ��div

                            var iHeight=iWidth/obj.width*obj.height;//����

                            oImg.css({
                                width:iWidth,
                                Height:iHeight
                            });



                            //��ȡarrT��Сֵ���ڵ�λ��
                            var iMinIndex=getMin();
                            //���ö�λ
                            oImg.css({
                                left:arrL[iMinIndex],
                                top:arrT[iMinIndex]
                            });
                            arrT[iMinIndex]+=iHeight+10;
                        });
                        oLoder.hide();//����loderͼƬ
                        iBtn=true;
                    });//��ȡͼƬ����
                }
            }



            /*
             * �����ڷ����仯ʱ������Ҳ�����仯
             * */
            $(window).on('resize',function() {

                var iOldCells = iCells;

                //�ȼ��㵱ǰ������
                setCells();
                var iH = $(window).scrollTop() + $(window).innerHeight();
                var iMinIndex = getMin();
                if (arrT[iMinIndex] + oContainer.offset().top < iH) {
                    iPage++;
                    getData();

                    if (iOldCells == iCells) {
                        return;
                    }
                    //���arrT arrL
                    arrL = [];
                    arrT = [];
                    for (var i = 0; i < iCells; i++) {
                        arrT.push(0);//���ÿ�е�topֵ
                        arrL.push(i * iOuterWidth);//���ÿ�е�leftֵ
                    }
                    var aImgs = oContainer.find('img');
                    aImgs.each(function () {
                        var iMinIndex = getMin();
                        /*$(this).css({
                        left:arrL[iMinIndex],
                        top:arrT[iMinIndex]
                    });
                    */
                    //����
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
             * ��ȡ��̵���
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