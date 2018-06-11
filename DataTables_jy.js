(function(window){
   

    var DataTables_jy={
     defaultsetting:{
         data:"",
         search_data:"",//搜索到的数据
         isSearching: false,//是否属于筛选状态
         sqlString:"",//Ajax要执行语句
         fatherArray:[],
         width: '2800px',
         range:5,        //分页左右显示范围
         table: "",
         tableDiv:"",
         ul: "",
         add_length:40,//每次增加的长度
         added_length: 40,//已增加长度
         nowPageNum:1,
         ulLength: -1,//ul长度
         loading:"",
         language: {
             head: "首页",
             tail:"尾页",
             per: "前一页",
             next:"下一页",
             turn:"跳转"
         },
         KeyWord:"",
         thwidth: [],
         pagesize:10, //每页数目
         FixedCol:[],//固定列
         theadData:[],
         theadMeaasge: {   //头部信息
             headStr: "",  //头部数据
             headSplit: ["◆","#","," ],//分割字符
             Contont: ["innerHTML", "rowSpan", "colSpan", "data-sort-key","width"]//各项信息
         },
         summation: "",
         Color: {
             "-1":"#000",
             "1":"#FF0000",
             "-2": "#00FFFF",
             "-3": "#009933",
             "-4":"#0000FF",
             "-5": "#FFA500"

         },
         sum: [],
         keycol:0,//主键列
         orderCol:false,//序号列
         sub:{//小计
            
         },
         Print: {
             Title: [],
             spanCols:[],//要跨行的列
             notshowCol: [],
             Width: [],
             Style:[]
         },
         isDetailMarge:false,//是否合并明细
         printDiv: "",//打印导出
         mode:""//模式
     },
     setting:{

     },
     createWrapper:function(){
        var wrapperDiv=document.createElement("div");
        wrapperDiv.id = "wrapper";

        wrapperDiv.innerHTML = "<div></div>";
        wrapperDiv.style.textAlign = "left";
        //wrapperDiv.style.width = (document.body.offsetWidth - 180) + "px";
        var headDiv = document.createElement("div");
        //顶部div
        headDiv.id = "headDiv";
        headDiv.style.textAlign = "left";
        //显示行数
        headDiv.innerHTML = "显示行数: ";
        var input_Change = document.createElement("input");
        input_Change.type = "text";
        input_Change.value=getCookie("num")||this.defaultsetting.pagesize;
        input_Change.className = "headInput";
        var that = this;
        headDiv.appendChild(input_Change);

        // 筛选
        var xs_span = document.createElement("span");
        xs_span.innerHTML="筛选: ";
        headDiv.appendChild(xs_span);
        var input_Search = document.createElement("input");
        input_Search.type = "text";
        input_Search.onkeyup=function(){that.updateTableData(this.value)};
        headDiv.appendChild(input_Search);
        // 打印
        var print_button = document.createElement("img");
        print_button.src = "/g2web/images/Print.png";
        headDiv.appendChild(print_button);
        print_button.title = "打印";
        print_button.onclick = function () { that.Print() }

        //导出
        var ExcelOut_button = document.createElement("img");
        ExcelOut_button.src = "/g2web/images/ExcelOut.png";
        headDiv.appendChild(ExcelOut_button);
        ExcelOut_button.title = "导出";
        ExcelOut_button.onclick = function () { that.ExcelOut() }

         //正在加载
        var loading = document.createElement("span");
        //var dotting = document.createElement("span");
        //dotting.className = "dotting";
        loading.innerHTML = "数据加载中...";
        loading.style.color = "red";
        loading.id = "dt_loading";
         //loading.appendChild(dotting);
        if (this.defaultsetting.sqlString) headDiv.appendChild(loading);
        this.defaultsetting.loading = loading;
        wrapperDiv.appendChild(headDiv);

        var tableDiv = document.createElement("div");
        tableDiv.id = "tableDiv";
        
        tableDiv.style.width = document.body.offsetWidth-300;
        var ulDiv=document.createElement("div");
        ulDiv.id = "ulDiv";
        var maoDiv=document.createElement("div");
        maoDiv.id="mao";
        var table = this.createTable();
        var Ul = this.createUl();
        this.defaultsetting.tableDiv = tableDiv;
        tableDiv.appendChild(table);
        tableDiv.onscroll = function () {
            if (that.defaultsetting.added_length < (that.defaultsetting.pagesize * that.defaultsetting.nowPageNum))
            {
                
            var divSrocllTop = this.scrollTop;
            var divScrollHeight = this.scrollHeight;
            var divClientHeigth = this.clientHeight;
            if (divSrocllTop > (divScrollHeight - divClientHeigth) / 2) {
              var num = that.defaultsetting.add_length;
              if (that.defaultsetting.added_length + num > (that.defaultsetting.pagesize * that.defaultsetting.nowPageNum)) num = that.defaultsetting.pagesize * that.defaultsetting.nowPageNum - that.defaultsetting.added_length;
              that.Addtr(that.defaultsetting.added_length, num, table.lastChild);
              that.defaultsetting.added_length+=num;
            }
        }
        }
        ulDiv.appendChild(Ul);
        input_Change.onchange = function () { that.updateTableRows(this.value, getByClassName(Ul, "active")[0].innerHTML) };

         //点击选择
        var txtDGHiddenSelectItems = document.createElement("input");
        txtDGHiddenSelectItems.id = "txtDGHiddenSelectItems";
        txtDGHiddenSelectItems.type = "hidden";
        wrapperDiv.appendChild(txtDGHiddenSelectItems);
      
        
        wrapperDiv.appendChild(tableDiv);
        wrapperDiv.appendChild(ulDiv);
        ulDiv.appendChild(maoDiv);
        return wrapperDiv;
     },
     createUl:function(o_length){    //添加分页列表
         var datalength = 0;

         if (this.defaultsetting.ulLength > -1) {
             datalength = this.defaultsetting.ulLength;
         } else {
             datalength = this.defaultsetting.data.length;
         }
         var length =o_length|| window.Math.ceil(datalength/ this.defaultsetting.pagesize);
         !this.defaultsetting.ul&&(this.defaultsetting.ul=document.createElement("ul"))
         var ul=this.defaultsetting.ul;
         ul.id="page";
         var homeli=document.createElement("li");//首页
         setInnerText(homeli,this.defaultsetting.language.head);
         homeli.style.width = "2.5em";
         homeli.onclick=function(){
             Redirect(1);
         }
         ul.appendChild(homeli);
         var pre_pageli=document.createElement("li");//上一页
         setInnerText(pre_pageli,this.defaultsetting.language.per);
         pre_pageli.style.width = "3.5em";
         pre_pageli.onclick=function(){
             Redirect(0,-1);
         }
         ul.appendChild(pre_pageli);
 
         for (var i = 1; i <= length; i++) {
 
             var li = document.createElement("li");
             if (i == 1) {
                 li.className = "active";
                 li.id = "firstli";
             }
             setInnerText(li,"" + i);
             if (i > this.defaultsetting.range*2+1 && i < length) {  //隐藏一部分标签，但最后一个显示
                 li.style.display = "none";
             }
             if (i == length - 1) {
                 li.id = "sec_lastli";
             }                                                //倒数第二个页码做上标记，方便插入省略号
             if (i == length&&i>1) {
                 if (i > this.defaultsetting.range * 2 + 1)
                 {
                     var dian_li = document.createElement("li");
                     setInnerText(dian_li, "...");
                     ul.appendChild(dian_li);
                 }
                 li.id = "lastli";                           //最后一个页码做上标记
             }
 
             ul.appendChild(li);
         }
         var next_li = document.createElement("li");                 //下一页
         setInnerText(next_li,this.defaultsetting.language.next);
         next_li.style.width = "3.5em";
         next_li.onclick =function(){
             Redirect(0,1);
         }
         ul.appendChild(next_li);
         var tail_li = document.createElement("li");                         //尾页
         setInnerText(tail_li,this.defaultsetting.language.tail);
         tail_li.style.width = "2.5em";
         tail_li.onclick = function () {           
             Redirect(length);
         }
         ul.appendChild(tail_li);
         var input_li=document.createElement("li");
         input_li.innerHTML= "<input type=\"text\" id=\"toPage\" style=\"width: 20px; border: none\" onkeydown=\"turnTo()\" /></li>";
         ul.appendChild(input_li);
         var turn_li=document.createElement("li");
         turn_li.onclick=Redirect;
         turn_li.id="RedirectButton";
         setInnerText(turn_li, this.defaultsetting.language.turn);
         turn_li.style.width = "4em";
         ul.appendChild(turn_li);
 
         var othat = this;
         var lilist = ul.getElementsByTagName("li");
         
         for (var j = 2; j < lilist.length - 4; j++) {
             if (lilist[j].innerHTML&&!isNaN(lilist[j].innerHTML)) {
                 lilist[j].onclick = function () {
                     var range = othat.defaultsetting.range;
                     var that = parseInt(this.innerHTML);
                     var leftrange = range - (length - that) > 0 ? range - (length - that) + range : range;
                     var rightrange = range - (that - 1) > 0 ? range - (that - 1) + range : range;
                     var lilist = this.parentNode.getElementsByTagName("li");
                     for (var z = 0; z < lilist.length; z++) {
                         lilist[z].className = "";
                         if (parseInt(lilist[z].innerHTML)) {
                             if (parseInt(lilist[z].innerHTML) - that > rightrange || that - parseInt(lilist[z].innerHTML) > leftrange) {
                                 if (lilist[z].id != "lastli") {
                                     lilist[z].style.display = "none";
                                 }
                             } else {
                                 lilist[z].style.display = "";
                             }
                         }
                     }
 
 
                     if (length > 2 * range + 1) {
                         var firstli = document.getElementById("firstli");
                         var lastli = document.getElementById("lastli");
                         var sec_lastli = document.getElementById("sec_lastli");
                         if (firstli.style.display == "none") {
                             if (firstli.previousSibling.innerHTML != "...") {
                                 var newli = document.createElement("li");
                                 newli.innerHTML = "...";
                                 ul.insertBefore(newli, firstli);
                             } else if (firstli.previousSibling.style.display == "none") {
                                 firstli.previousSibling.style.display = "";
 
                             }
                         } else if (firstli.previousSibling.innerHTML == "...") {
                             firstli.previousSibling.style.display = "none";
                         }
 
                         if (sec_lastli.style.display == "none") {
                             if (lastli.previousSibling.innerHTML != "...") {
                                 var newlaseli = document.createElement("li");
                                 newlaseli.innerHTML = "...";
                                 ul.insertBefore(newlaseli, lastli);
                             } else if (lastli.previousSibling.style.display == "none") {
                                 lastli.previousSibling.style.display = "";
 
                             }
                         } else if (lastli.previousSibling.innerHTML == "...") {
                             lastli.previousSibling.style.display = "none";
                         }
                     }
                     this.className = "active";
                     othat.switchPage(this.innerHTML,othat.defaultsetting.table,othat.defaultsetting.pagesize,othat.defaultsetting.FixedCol);
                 }
                 
             }
         }
         return ul;
     },
     createTable:function(){
         !this.defaultsetting.table&&(this.defaultsetting.table=document.createElement("table"));
         var table = this.defaultsetting.table;
         table.id = "dataTable";
        // table.style.width = this.defaultsetting.width; 
         var thead=this.createThead();

         table.appendChild(thead);//表头
         this.switchPage(1,table,this.defaultsetting.pagesize,this.defaultsetting.FixedCol);//表体           
         return table;
 
     },
     createThead: function () {     //创建表头
        var thead=document.createElement("thead");
        var theadMeaasge = this.defaultsetting.theadMeaasge;
        var headStr = theadMeaasge.headStr.split(theadMeaasge.headSplit[0]);
        for(var i=0;i<headStr.length;i++){
            var arr = headStr[i].split(theadMeaasge.headSplit[1]);
            var tr = document.createElement("tr");
            if(this.defaultsetting.orderCol){
                var td = document.createElement("td");
                td.innerHTML="序号";
                tr.appendChild(td);
            }
            addClass(tr,"head");
            for(var j=0;j<arr.length;j++)
            {
                var arr2 = arr[j].split(theadMeaasge.headSplit[2]);
                var td = document.createElement("td");
                for (var k = 0; k < theadMeaasge.Contont.length; k++) {
                    if (theadMeaasge.Contont[k] != undefined && arr2[k] != undefined) {
                        if (theadMeaasge.Contont[k] == "width") {
                            td.style.width = arr2[k];

                        } else if (theadMeaasge.Contont[k] == "innerHTML") {
                            td.innerHTML = arr2[k];
                        } else {
                            td.setAttribute(theadMeaasge.Contont[k], arr2[k]);
                        }
                    }
                   
                }
                var FixedCol = this.defaultsetting.FixedCol;
                if (contains(FixedCol, td.getAttribute("data-sort-key")) > -1) addClass(td, "FixedDataColumn");
                //if (FixedCol[FixedCol.length - 1] == td.getAttribute("data-sort-key")) td.style.borderRightColor = "#000";
                if (arr2[5]=="none") {
                    td.style.display = "none";
                }

                td.setAttribute("data-sort-status","lowTohigh");
                var that = this;
                td.onclick = function () {
                        var sort = this.getAttribute("data-sort-status");

                        that.defaultsetting.data = shellSort(that.defaultsetting.data, this.getAttribute("data-sort-key"), sort);
                        var ullist = document.getElementById("page");
                       
                        if(ullist){
                        var lilist = ullist.getElementsByTagName("li");
                        var currPage = 1;
                        for (var i = 0; i < lilist.length; i++) {
                            if (lilist[i].className == "active") {
                                currPage = lilist[i].innerHTML;
                            }
                        }

                    
                        }

                        that.switchPage(currPage||1,that.defaultsetting.table,that.defaultsetting.pagesize,that.defaultsetting.FixedCol);
                        if (sort == "lowTohigh") {
                            this.setAttribute("data-sort-status", "highTolow");
                        } else {
                            this.setAttribute("data-sort-status","lowTohigh");//正序
                        }
    
                    }
                
                if (td.innerHTML != "ColorColumn") tr.appendChild(td);
           
        }
        thead.appendChild(tr);
    }
    return thead;
    
       
     },
     switchPage: function (pageNum, table, pagesize, FixedCol, data) {   //创建表体
       
         //console.time('耗时');
         (pageNum < 1 || !pageNum) && (pageNum = 1);
         this.defaultsetting.nowPageNum = pageNum;
         var tbody = table.getElementsByTagName("tbody");
         //清空table除了标题行的内容
         this.defaultsetting.tableDiv.scrollTop = "0";
         tbody.length&&table.removeChild(tbody[0]);
         tbody=document.createElement("tbody");
         var nowdata="";
         
         if(this.defaultsetting.isSearching){
            nowdata=data||this.defaultsetting.search_data;
         }else{
            nowdata=data||this.defaultsetting.data;
         }
         var length=this.defaultsetting.pagesize;
         if(this.defaultsetting.pagesize>this.defaultsetting.add_length) length=this.defaultsetting.add_length;
         this.Addtr(parseInt((pageNum - 1) * pagesize),length,tbody,nowdata)
         this.defaultsetting.added_length = parseInt((pageNum - 1) * pagesize)+length;
         
         
         table.appendChild(tbody);
         var trlist = table.getElementsByTagName("tr");
         var length = trlist.length;
         //固定行,防止跨行产生的错误
         //var rowspapnum = [];
         //var F_Flag = true;
         //var nk = FixedCol.length;
         //for (var j = 0; j < length; j++) {  
         //    var tdlist = trlist[j].getElementsByTagName("td");
             
                 
         //   for (var k = 0; k < FixedCol.length&&k<nk; k++) {
         //       addClass(tdlist[FixedCol[k]],"FixedDataColumn");
         //       rowspapnum[k] = tdlist[FixedCol[k]].getAttribute("rowSpan");
         //       if (k == FixedCol.length-1||k==nk-1) {
         //           tdlist[FixedCol[k]].style.borderRight = "1px solid #000";
         //       }     

         //   }
         //   nk = FixedCol.length;
            

         //    for (var h = 0; h < rowspapnum.length; h++) {
         //        if (rowspapnum[h] > 1) {
         //            nk--;
         //            rowspapnum[h]--;
         //        }
         //    }
                
         //    //alert(j + "--");
         //}
         
         
         this.defaultsetting.summation && this.getSummary();
         //console.timeEnd('耗时');
         
           
     },
     Addtr: function (start, num, tbody, o_data) {//增加tr数目
         var oldrecord = "";//上一条数据
         var sownum=0;//隐藏行数
         var i_data
         if(this.defaultsetting.isSearching){
            i_data = o_data||this.defaultsetting.search_data;
         }else{
            i_data = o_data||this.defaultsetting.data;
         }
         if(this.defaultsetting.isDetailMarge){
         var i_start=this.defaultsetting.fatherArray[start];
         }else{
             i_start=start;
         }
         
         for (var i = i_start;  i < i_start+num; i++) {
             if ((i + sownum) >= i_data.length) {
                break;
            }
       
             var c_name  = "oddrow";//"#EAF3FA";
             if ( (i) % 2 == 1) {
                c_name = "evenrow";//"#D1E4F3";
             }
             //console.log();
         
             var nowdata = i_data[i + sownum];
             var tr = document.createElement("tr");
             addClass(tr,c_name);
             var ColorColumn = nowdata["ColorColumn"];
             ColorColumn && (tr.style.color = this.defaultsetting.Color[ColorColumn]);//变色
             tr.tabIndex = i;
             var that = this;
            
             if (this.defaultsetting.mode == "1") {
                 tr.onkeydown = function (e) {
                     var event = e || window.event;
                     stopBubble(event);
                 }
                 tr.onkeyup = function (e) { trkeyup(this, e, that, tbody) };
             }
             if (this.defaultsetting.orderCol) {//序号列
                 var td = document.createElement("td");
                 td.innerHTML = i + 1;

                 tr.appendChild(td);
             }
             tr.ondblclick = function () {
                 that.trdbclick(this);
             }
             tr.onclick = function () {
                 trclick(this);
             }
             var array = this.defaultsetting.showDetail;

             var subcol = this.defaultsetting.sub.subcol || "";
             if (i == start) {

                 oldrecord = nowdata[subcol[0]];
             }
             if (subcol && nowdata[subcol[0]] != oldrecord) {
                 var subtr = document.createElement("tr");
                 for (var t = 0; t < array.length; t++) {

                     var td = document.createElement("td");
                     td.innerHTML = "小计";
                     subtr.appendChild(td);
                 }
                 oldrecord = nowdata[subcol[0]];
                 tbody.appendChild(subtr);
             }
             var that = this;
             //固定行
             var FixedCol = this.defaultsetting.FixedCol;

             
             for (var t = 0; t < array.length; t++) {
                 var tdData = array[t];

                 if (tdData != "dataTable-type" && tdData != "ColorColumn") {

                     var td = document.createElement("td");
                     if (contains(FixedCol, tdData) > -1) addClass(td, "FixedDataColumn");
                     //if (FixedCol[FixedCol.length - 1] == tdData) td.style.borderRightColor = "#000";
                     //setInnerText(td, nowdata[tdData]);
                     td.innerText = nowdata[tdData];
                     
                     if (t == this.defaultsetting.keycol) {
                         td.style.display = "none";
                         td.setAttribute("data-keyWord", nowdata[tdData]);
                     }
                     tr.appendChild(td);
                     

                 }
             }
             if (nowdata["dataTable-type"] == "FatherItem") {

                 var keyword = nowdata[this.defaultsetting.KeyWord];
                 addClass(tr,"FatherItem");
                 (function(keyword){tr.onclick = function () {
                    switchStatus("SonItemFor"+keyword);
                }})(keyword)
                var SonItems=0;
                for (var h = (i + sownum + 1) ; h < i_data.length; h++) {
               
                    if (i_data[h]["dataTable-type"] && i_data[h]["dataTable-type"] == ("SonItemFor" + keyword)) {
                         SonItems++;
                     
                     }else{
                         break;
                     }
                    
                }
                //子项数目
                tr.firstChild.innerHTML=tr.firstChild.innerHTML+"  <span   class=\"circleNum\">  <span> "+SonItems+"</span>  </span>";
                 
             }
             if (nowdata["dataTable-type"] == ("SonItemFor"+nowdata[this.defaultsetting.KeyWord])) {
                addClass(tr,nowdata["dataTable-type"]);
                addClass(tr,"SonItem");
                tr.style.display = "none";
                i--;
                sownum++;
             }
             tbody.appendChild(tr);
             
         }
  
     },
     init:function(){
        
         this.defaultsetting=extendObj(this.defaultsetting,this.setting);
         if (!this.defaultsetting.theadMeaasge.headStr && this.defaultsetting.data) {
             var str = "";
             var z = 0;
             for (var tdData in this.defaultsetting.data[0]) {
                 
                 
                 if (z == this.defaultsetting.keycol) {
                     str += tdData + ",,," + tdData + ",0,none♢";
                 } else {
                     str += tdData + ",,," + tdData + "♢";
                 }
                 z++;
             }
             
             str=str.substring(0,str.length-1);
             this.defaultsetting.theadMeaasge = {
                 headStr: str,
                 headSplit: ["◆", "♢", ","],//分割字符
                 Contont: ["innerHTML", "rowSpan", "colSpan", "data-sort-key", "width"]//各项信息
             };
         }
         this.defaultsetting.pagesize = getCookie("num") || this.defaultsetting.pagesize;
         if (!this.defaultsetting.showDetail&& this.defaultsetting.data) {
             var arr=[];
             for (var data in  this.defaultsetting.data[0]){
                 arr.push(data);
             }
             this.defaultsetting.showDetail = arr;
         }
         
         if(this.defaultsetting.isDetailMarge){
         var keyword=this.defaultsetting.KeyWord||this.defaultsetting.data[0][this.defaultsetting.data.keys[0]];
         this.defaultsetting.KeyWord=keyword;
         this.defaultsetting.data=shellSort(this.defaultsetting.data,keyword);
         var oldkey=this.defaultsetting.data[0][keyword];
         var l_num=0;
         this.defaultsetting.fatherArray.push(l_num);
         for(var i=1;i<this.defaultsetting.data.length;i++)
         {
             var newkey=this.defaultsetting.data[i][keyword];
             if(oldkey==newkey){
                 this.defaultsetting.data[l_num]["dataTable-type"]="FatherItem";
                 this.defaultsetting.data[i]["dataTable-type"]="SonItemFor"+oldkey;
                 
             }else{
                 oldkey=this.defaultsetting.data[i][keyword];
                 l_num=i;
                 this.defaultsetting.fatherArray.push(l_num);
             }
         }
         this.defaultsetting.ulLength = this.defaultsetting.fatherArray.length;
         }


         //Ajax 请求
         var sqlString = this.defaultsetting.sqlString;
         var that = this;
         if (sqlString) {
             var Data = "sqlString=" + sqlString;
             Ajax.post("DataTables.ashx", Data, function (data) {
                 var totalData = eval("(" + data + ")");
                 that.defaultsetting.data = totalData["Rows"];
                 that.defaultsetting.sqlString = null;
                 that.defaultsetting.loading = "";
                 document.getElementById("dt_loading").innerHTML = "数据加载完成";
                 document.getElementById("dt_loading").style.color = "green";
             })

         } 
        
     },
     getSummary: function () {//合计

         var summation = this.defaultsetting.summation.split(",");
         var sum = this.defaultsetting.sum;

         if (!sum || (sum && sum.length == 0)) {
             var data = this.defaultsetting.data;
             for (var i = 0; i < data.length; i++) {
                 for (var j = 0; j < summation.length; j++) {
                     if (i == 0) {
                         sum[j] = parseFloat(trim(data[i][summation[j]]) || "0")
                     } else {
                         sum[j] += parseFloat(trim(data[i][summation[j]]) || "0");
                     }

                 }
             }
         }
         var table = this.defaultsetting.table;
         var tbody = table.getElementsByTagName("tbody")[0];
         var flag=true;
         tr = document.createElement("tr");
         tr.height = "25px";
         tr.style.backgroundColor = "#98C8F4";
         for (var k = 0; k < this.defaultsetting.showDetail.length; k++) {
             var tdData = this.defaultsetting.showDetail[k];
             var td = document.createElement("td");
             if (flag) {
                 td.innerHTML = "合计";
                 flag = false;
             }
             else if (contains(summation,tdData)>-1) {

                 td.innerHTML = sum[contains(summation, tdData)].toFixed(2);
                 td.setAttribute("title", getChinese(sum[contains(summation, tdData)].toFixed(2)));

             }
             else {
                td.innerHTML = "";
             }
             tr.appendChild(td);
             }
             
        tbody.appendChild(tr);
     },
     NumToChinese: function(table) {
       
         var td = table.getElementsByTagName("td");
         for (var i = 0; i < td.length; i++) {
             if (!isNaN(parseFloat(td[i].innerHTML)))
             {
                 td[i].setAttribute("title", getChinese(parseFloat(td[i].innerHTML).toFixed(2)));
             }
         }
     },
     updateTableRows: function (num, pageNo) {//改变显示行数
         if (!isNaN(parseInt(num))) {
            setCookie("num",num,365);
            this.defaultsetting.pagesize=num;
            this.defaultsetting.ul.innerHTML="";
            var ul=this.createUl();
            var lilist=ul.getElementsByTagName("li");
            for (var i = 0; i < lilist.length; i++) {
                if (lilist[i].innerHTML == pageNo) {
                    lilist[i].click();

                }
            }
            
        }
       
     },
     updateTableData: function (searchText) {//筛选内容
         if (searchText) {
             this.defaultsetting.fatherArray = [];
             this.defaultsetting.isSearching = true;
             var oldData = this.defaultsetting.data;
             this.defaultsetting.search_data = [];
             for (var i = 0; i < oldData.length; i++) {
                 for (var r in oldData[i]) {
                     if (oldData[i][r].toUpperCase().indexOf(searchText.toUpperCase()) > -1) {
                         oldData[i]["dataTable-type"] && (oldData[i]["dataTable-type"] = "")
                         this.defaultsetting.search_data.push(oldData[i]);
                         break;
                     }
                 }
             }
             this.defaultsetting.ulLength = this.defaultsetting.search_data.length;
             
             if (this.defaultsetting.isDetailMarge) {
                 var keyword = this.defaultsetting.KeyWord || this.defaultsetting.data[0][this.defaultsetting.data.keys[0]];
                 var oldkey = this.defaultsetting.search_data[0][keyword];
                 var l_num = 0;
                 this.defaultsetting.fatherArray.push(l_num);
                 for (var i = 1; i < this.defaultsetting.search_data.length; i++) {

                     var newkey = this.defaultsetting.search_data[i][keyword];
                     if (oldkey == newkey) {
                         this.defaultsetting.search_data[l_num]["dataTable-type"] = "FatherItem";
                         this.defaultsetting.search_data[i]["dataTable-type"] = "SonItemFor" + oldkey;
                         this.defaultsetting.active_length--;
                     } else {
                         oldkey = this.defaultsetting.search_data[i][keyword];
                         l_num = i;
                         this.defaultsetting.fatherArray.push(l_num);
                     }
                 }
                 this.defaultsetting.ulLength = this.defaultsetting.fatherArray.length;
             }
             this.defaultsetting.ul.innerHTML = "";
             var ul = this.createUl();
             var lilist = ul.getElementsByTagName("li");
             // for (var i = 0; i < lilist.length; i++) {
             //     if (lilist[i].innerHTML == pageNo) {
             //         lilist[i].click();
             //     }
             // }
             this.switchPage(0, this.defaultsetting.table, this.defaultsetting.pagesize, this.defaultsetting.FixedCol, this.defaultsetting.search_data);
         } else {
             this.defaultsetting.isSearching = false;
             this.defaultsetting.ulLength = this.defaultsetting.data.length;
             this.defaultsetting.ul.innerHTML = "";
             var ul = this.createUl();
             var lilist = ul.getElementsByTagName("li");
             // for (var i = 0; i < lilist.length; i++) {
             //     if (lilist[i].innerHTML == pageNo) {
             //         lilist[i].click();
             //     }
             // }
             this.switchPage(0, this.defaultsetting.table, this.defaultsetting.pagesize, this.defaultsetting.FixedCol, this.defaultsetting.data);
         }
         
     },
     CreataPrintTable: function () {
        var print = this.defaultsetting.Print;
        var div = document.createElement("div");
        var thead = document.getElementById("dataTable").firstChild;
        var data = "";
        if (this.defaultsetting.isSearching) {
            data = this.defaultsetting.search_data;
        } else {
            data = this.defaultsetting.data;
        }
        var Print = this.defaultsetting.Print;
        var ColObject = {};
        var oldArray = new Array(Print.spanCols.length);
        var CountArray = [];//计数
        for (var p = 0; p < Print.spanCols.length; p++) {
            ColObject[Print.spanCols[p]] = [1];
            CountArray.push(0);
        }


        for (var k = 0; k < data.length; k++) {
            for (var l = 0; l < Print.spanCols.length; l++) {
                if (oldArray[l] == data[k][Print.spanCols[l]]) {
                    if (ColObject[Print.spanCols[l]][CountArray[l]] == undefined) ColObject[Print.spanCols[l]][CountArray[l]] = 1;
                    ColObject[Print.spanCols[l]][CountArray[l]]++;
                    
                } else {
                    oldArray[l] = data[k][Print.spanCols[l]];
                    k > 0 && CountArray[l]++;
                    if (ColObject[Print.spanCols[l]][CountArray[l]] == undefined) ColObject[Print.spanCols[l]][CountArray[l]] = 1;

                }
            }
        }
        //表头
        var cloneThead = thead.cloneNode(true);
        //cloneThead.firstChild.removeChild(cloneThead.firstChild.firstChild);
        var printTable = document.createElement("table");
        var SpanCount = 0;//计数 
        var isRowspanCol = true;//是否为跨行列
        var theadtd = cloneThead.getElementsByTagName("td");
        var thlength=theadtd.length;
        for (var j = 0; j < thlength; j++) {
            theadtd[j].style.emptyCells = "show";
            theadtd[j].style.border = "1px solid #000";
            theadtd[j].style.textAlign = "center";
            
        }

        printTable.style.borderCollapse = "collapse";
        printTable.style.tableLayout = "fixed";
        printTable.appendChild(cloneThead);
        for (var i = 0; i < data.length; i++) {

            var tr = document.createElement("tr");
            var t = 0;
            for (var text in data[i]) {
                if (contains(this.defaultsetting.keycol, t) == -1) {

                    var td = document.createElement("td");
                    td.innerHTML = data[i][text];
                    td.style.emptyCells = "show";
                    td.style.border = "1px solid #000";
                    td.style.textAlign = "center";
                    if (contains(Print.spanCols, text) > -1) {
                        if (isRowspanCol) {
                            
                            td.rowSpan = ColObject[text][SpanCount]--;
                            isRowspanCol = false;
                            tr.appendChild(td);
                            if (ColObject[text][SpanCount] == 0) {
                                isRowspanCol = true;
                                SpanCount++;
                            }
                        } else {
                            if (--ColObject[text][SpanCount] == 0) {
                               
                                isRowspanCol = true;
                                SpanCount++;
                            }
                        }
                        continue;
                    }
                    tr.appendChild(td);
                }
                t++;
            }
            

            printTable.appendChild(tr);

        }
       
        if (Print.Title) {
            for (var k = print.Title.length - 1; k >= 0 ; k--) {
                var tr = document.createElement("tr");
                var td = document.createElement("td");
                td.setAttribute("colSpan", Print.Width.length);
                td.innerHTML = print.Title[k];
                td.style.cssText = print.Style&&print.Style[k] || "";
                td.setAttribute("style", print.Style && print.Style[k] || "");
                tr.appendChild(td);
                cloneThead.insertBefore(tr, cloneThead.firstChild);
            }
            var tr = document.createElement('tr');
            for (var k = 0  ; k < print.Width.length; k++) {
                var td = document.createElement("td");
                td.style.height = "0px";
                td.style.border = "none";
                td.style.width = print.Width[k];
                tr.appendChild(td);

            }
            cloneThead.insertBefore(tr, cloneThead.firstChild);
        }

        div.appendChild(printTable);
        this.defaultsetting.printDiv = div;
        return div;
        
     },
     Print: function () {
         var div = this.defaultsetting.printDiv ||this.CreataPrintTable();
         var oWin = window.open("", "_blank");
         oWin.document.write(div.innerHTML);
         oWin.focus();
         oWin.document.close();
     },
     ExcelOut: function () {
         var div = this.defaultsetting.printDiv || this.CreataPrintTable();
         window.clipboardData.setData("Text", div.innerHTML);
         try {
             var ExApp = new ActiveXObject("Excel.Application")
             var ExWBk = ExApp.workbooks.add()
             var ExWSh = ExWBk.worksheets(1)
             ExWSh.Columns("A:AE").ColumnWidth = 10; //设置宽度
             ExApp.ActiveSheet.Rows.RowHeight = 25; //设置行高
             ExApp.DisplayAlerts = false
             ExApp.visible = true
         }
         catch (e) {
             alert("您的电脑没有安装Microsoft Excel软件！")
             return false
         }
         ExWBk.worksheets(1).PageSetup.LeftMargin = 1 / 0.035; //页边距 左2厘米  
         ExWBk.worksheets(1).PageSetup.RightMargin = 1 / 0.035; //页边距 右3厘米，  
         ExWBk.worksheets(1).PageSetup.TopMargin = 1 / 0.035; //页边距 上4厘米，  
         ExWBk.worksheets(1).PageSetup.BottomMargin = 1 / 0.035; //页边距 下5厘米  
         ExWBk.worksheets(1).PageSetup.HeaderMargin = 1 / 0.035; //页边距 页眉1厘米  
         ExWBk.worksheets(1).PageSetup.FooterMargin = 1 / 0.035; //页边距 页脚2厘米 
         ExWBk.worksheets(1).Paste;

     },
     trdbclick: function (ele) {
         
     }
 
 
 
    };
    window.DataTables_jy=DataTables_jy;
 function getByClassName(obj, cls,Tag) {
     // obj目标元素，cls要获得的class名
 
     var element = obj.getElementsByTagName(Tag||'*');//将目标下的所有子元素获取到
     var result = []; //定义一个数组，存放获得的classname = "cls" 的所有值
     for (var i = 0; i < element.length; i++) {
         var cn_array = element[i].className.split(" ");
       
         if (contains(cn_array, cls) > -1) {
            
             result.push(element[i]);
         }
     }
     return result;
 }
 function Redirect(page,index){
     var ul = document.getElementById("page");
     if (!index) {
         page = page || document.getElementById("toPage").value || getByClassName(ul, "active")[0].innerHTML;
     } else {
         page = parseInt(getByClassName(ul, "active")[0].innerHTML) + parseInt(index);
     }
 
     var lilist = ul.getElementsByTagName("li");
     for (var i = 0; i < lilist.length; i++) {
         if (lilist[i].innerHTML == page) {
             lilist[i].click();
             break;
         }
     }
 
 }
 function turnTo(e) {
     var e = e || event;
     if (e.keyCode == "13") {
         var RedirectButton = document.getElementById("RedirectButton");
         RedirectButton.click();
         window.event ? window.event.cancelBubble = true : e.stopPropagation();
         window.event ? window.event.returnValue = false : e.preventdefaultsetting();
 
     }
 }
 window.turnTo = turnTo;
 function shellSort(arr, name, sort) {   //希尔排序
     //console.log(name);
     //console.log(arr);
     var len = arr.length,
     temp,
     gap = 1;
     //console.time('希尔排序耗时:');
     while (gap < len / 5) { //动态定义间隔序列
         gap = gap * 5 + 1;
     }
     for (gap; gap > 0; gap = Math.floor(gap / 5)) {
         for (var i = gap; i < len; i++) {
             temp = arr[i];
             if (sort == "highTolow") {
                 for (var j = i - gap; j >= 0 && arr[j] && comp(temp,arr[j],name); j -= gap) {
                     arr[j + gap] = arr[j];
                 }
             } else {
                 for (var j = i - gap; j >= 0 && arr[j] && comp(arr[j], temp, name) ; j -= gap) {
                     arr[j + gap] = arr[j];
                 }
             }
             arr[j + gap] = temp;
         }
     }
     //console.timeEnd('希尔排序耗时:');
     //console.log(arr);
     return arr;
 }
 function comp(arr,temp,name){
     var a1 = arr[name];
     var a2 = temp[name];
     if (a1 && a2 && !isNaN(a1) && !isNaN(a2)) {
         return parseFloat(a1) > parseFloat(a2);
     }
     return a1 > a2;
 }
 function switchStatus(className){
 var tr=getByClassName(document,className);
 for(var i=0;i<tr.length;i++){
     if(tr[i].style.display=="none")
     {
         tr[i].style.display="";
     }
     else{
         tr[i].style.display="none";
     }
 }
 }
 function extendObj() { //扩展对象
        var args = arguments;
        if (args.length < 2) return;
        var temp = args[0]; //调用复制对象方法
        for (var n = 1; n < args.length; n++) {
            for (var i in args[n]) {
                if ("object" == typeof args[n][i] && temp[i] &&!temp[i].length) {
                    extendObj(temp[i], args[n][i]);
                } else {
                    temp[i] = args[n][i];
                }
                }
        }
        return temp;
    }

function contains(arr, obj) {
    for (var i = 0; i < arr.length; i++)
    {
        if (arr[i] === obj) {
            
            return i;
        }
    }
    return -1;
}
function arrRemove(array, val) {
    var index = -1;
    for (var i = 0; i < array.length; i++) {
        if (array[i] == val) index = i;
    }
    if (index > -1) {
        array.splice(index, 1);
    }
    return array;
}
function trclick(that) {

    var Items = document.getElementById("txtDGHiddenSelectItems");
    var value = that.firstChild.getAttribute("data-keyWord") || "";
    if (Items) {
        if (event.ctrlKey) {//ctrl+鼠标左键 多项选择
            
            var classname = that.className;
            //判断是添加选择还是取消选择
            if ((!classname || classname.indexOf("selectedtr") == -1)) {
                addClass(that, "selectedtr")
                if (Items.value == undefined || Items.value == null || Items.value == "") {
                    Items.value = value;
                } else {
                    var arr = Items.value.split("◆");
                    if (contains(arr, value) == -1) {
                        arr.push(value);
                        Items.value = arr.join("◆");
                    }

                }
            } else {
                removeClass(that, "selectedtr");
                if (Items.value == undefined || Items.value == null || Items.value == "") {
                } else {
                    var arr = Items.value.split("◆");
                    arr = arrRemove(arr, value);
                    Items.value = arr.join("◆");
                }
            }
        } else if (event.shiftKey) {
            var tr1 = getByClassName(that.parentNode, "selectedtr", "tr");
            var tr = tr1[0];
            var length = tr1.length;
            for (var i = 0; i < length; i++) {
                removeClass(tr1[i], "selectedtr");
            }
            if (tr) {
                var startIndex = tr.getAttribute("tabIndex") > that.getAttribute("tabIndex") ? that.getAttribute("tabIndex") : tr.getAttribute("tabIndex");
                var endIndex = tr.getAttribute("tabIndex") > that.getAttribute("tabIndex") ? tr.getAttribute("tabIndex") : that.getAttribute("tabIndex");
                var trlist = that.parentNode.getElementsByTagName("tr");
                var newvalue=[];
                for (var i = startIndex; i <= endIndex; i++) {
                    addClass(trlist[i], "selectedtr");
                    newvalue.push(trlist[i].firstChild.getAttribute("data-keyWord") || "");
                }
                Items.value = newvalue.join("◆");
               
            }
        }
        else {
            var tr = getByClassName(that.parentNode, "selectedtr","tr");
            var length = tr.length;
            for (var i = 0; i < length; i++) {
                removeClass(tr[i], "selectedtr");
            }
            addClass(that, "selectedtr");
            Items.value = value;


        }
        stopBubble(event);
    }

    }
function trkeyup(thetr, e, that,tbody) {//tr上下滚动
    
    var event = e || window.event;
    if(event.keyCode==40){
        var nexttr = thetr.nextSibling;
        if (nexttr) {
            nexttr.focus();
            thetr.className = "";
            nexttr.className = "selectedtr";
        }
    } else if (event.keyCode == 38) {
        
        var pertr = thetr.previousSibling;
        if (pertr) {
            thetr.className = "";
            pertr.className = "selectedtr";
            pertr.focus();
        }
    }else if(event.keyCode==13){
        thetr.click();
    }else if(48<parseInt(event.keyCode)&&parseInt(event.keyCode)<59){
        var id = parseInt(event.keyCode) - 48;
                     
        tbody.childNodes[id-1].focus();
        tbody.childNodes[id-1].click();
    }
    else if (96 < parseInt(event.keyCode) && parseInt(event.keyCode) < 107) {
        var id = parseInt(event.keyCode) - 96;
        thetr.className = "";
        tbody.childNodes[id - 1].focus();
        tbody.childNodes[id - 1].click();
    }
    if (parseInt(thetr.firstChild.innerHTML) < that.defaultsetting.pagesize / 2) {

        stopBubble(event);
    } else {
        
        that.Addtr(that.defaultsetting.pagesize, that.defaultsetting.pagesize, tbody);
        that.defaultsetting.pagesize = that.defaultsetting.pagesize * 2;
      
                     
    }
                 
}

function getInnerText(element) {
    return (typeof element.textContent == "string") ? element.textContent : element.innerText;
}
function setInnerText(element, text) {
    if (typeof element.innerText == "string") {
        element.innerText = text;
       
    } else {
        element.textContent = text;
    }
}

var Utils = {
    /*
        单位
    */
    units: '个十百千万@#%亿^&~',
    /*
        字符
    */
    chars: '零一二三四五六七八九',
    /*
        数字转中文
        @number {Integer} 形如123的数字
        @return {String} 返回转换成的形如 一百二十三 的字符串            
    */
    numberToChinese: function (number) {
        var a = (number + '').split(''), s = [], t = this;
        if (a.length > 12) {
            throw new Error('too big');
        } else {
            for (var i = 0, j = a.length - 1; i <= j; i++) {
                if (j == 1 || j == 5 || j == 9) {//两位数 处理特殊的 1*
                    if (i == 0) {
                        if (a[i] != '1') s.push(t.chars.charAt(a[i]));
                    } else {
                        s.push(t.chars.charAt(a[i]));
                    }
                } else {
                    s.push(t.chars.charAt(a[i]));
                }
                if (i != j) {
                    s.push(t.units.charAt(j - i));
                }
            }
        }
        //return s;
        return s.join('').replace(/零([十百千万亿@#%^&~])/g, function (m, d, b) {//优先处理 零百 零千 等
            b = t.units.indexOf(d);
            if (b != -1) {
                if (d == '亿') return d;
                if (d == '万') return d;
                if (a[j - b] == '0') return '零'
            }
            return '';
        }).replace(/零+/g, '零').replace(/零([万亿])/g, function (m, b) {// 零百 零千处理后 可能出现 零零相连的 再处理结尾为零的
            return b;
        }).replace(/亿[万千百]/g, '亿').replace(/[零]$/, '').replace(/[@#%^&~]/g, function (m) {
            return { '@': '十', '#': '百', '%': '千', '^': '十', '&': '百', '~': '千' }[m];
        }).replace(/([亿万])([一-九])/g, function (m, d, b, c) {
            c = t.units.indexOf(d);
            if (c != -1) {
                if (a[j - c] == '0') return d + '零' + b
            }
            return m;
        });
    }
};
function getChinese(num) {
    var inte = Utils.numberToChinese((num + "").split(".")[0]);
    if (num < 0) {
        inte = "负" + inte;
    }
    var str = "";
    if ((num + "").split(".")[1]) {
        str = "点";
        var hout = (num + "").split(".")[1].split("");
        var items = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];

        for (var i = 0; i < hout.length; i++) {
            str += items[hout[i]];
        }
    }
    return inte + str;
}
function stopBubble(e) {
    if (e && e.stopPropagation) { //非IE 
        e.stopPropagation();
        
    } else { //IE 
        e.cancelBubble = true;
        e.returnValue = false;
    }
    (e.returnValue && (e.returnValue = false)) || (e.preventDefault&&e.preventDefault());
}

function hasClass( elements,cName ){ 
    return !!elements.className.match( new RegExp( "(\\s|^)" + cName + "(\\s|$)") ); 
}; 
function addClass( elements,cName ){ 
    if( !hasClass( elements,cName ) ){ 
        elements.className += " " + cName; 
    }; 
}; 
function removeClass( elements,cName ){ 
    if( hasClass( elements,cName ) ){ 
        elements.className = elements.className.replace( new RegExp( "(\\s|^)" + cName + "(\\s|$)" ), " " );
    }; 
};


var Ajax = {
    get: function (url, fn) {
        var obj = new XMLHttpRequest();  // XMLHttpRequest对象用于在后台与服务器交换数据          
        obj.open('GET', url, true);
        obj.onreadystatechange = function () {
            if (obj.readyState == 4 && obj.status == 200 || obj.status == 304) { // readyState == 4说明请求已完成
                fn.call(this, obj.responseText);  //从服务器获得数据
                //console.log(obj);
            }
        };
        obj.send();
    },
    post: function (url, data, fn) {         // datat应为'a=a1&b=b1'这种字符串格式，在jq里如果data为对象会自动将对象转成这种字符串格式
        var obj = new XMLHttpRequest();
        obj.open("POST", url, true);
        obj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");  // 添加http头，发送信息至服务器时内容编码类型
        obj.onreadystatechange = function () {
            if (obj.readyState == 4 && (obj.status == 200 || obj.status == 304)) {  // 304未修改
                fn.call(this, obj.responseText);
                //console.log(obj);

            }
        };
        obj.send(data);
    }
}

    //设置cookie
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}
    //获取cookie
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
}
    //清除cookie  
function clearCookie(name) {
    setCookie(name, "", -1);
}
//function checkCookie() {
//    var user = getCookie("username");
//    if (user != "") {
//        alert("Welcome again " + user);
//    } else {
//        user = prompt("Please enter your name:", "");
//        if (user != "" && user != null) {
//            setCookie("username", user, 365);
//        }
//    }
//}


 
 })(window)
