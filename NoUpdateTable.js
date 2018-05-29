(function (window) {
    var TotalJson;
    var oldLength = 10;
    NoUpdateTable = {
        mipha: function (event, that, sqlstr,allsqlstr) {
            var div = document.getElementById("yhh");
            if (!div) {
                div = document.createElement("div");
                div.style.height = "180px";
                div.style.width = "370px";
                div.style.overflow = "hidden";
                div.style.position = "absolute";
                div.style.zIndex = "99999";
                div.id = "yhh";
                div.innerHTML = "<div id=\"div\" style=\"height:200px;width:400px;overflow-y:scroll\">";
                that.parentNode.appendChild(div);
                div.style.backgroundColor = "#FFF";
                div.style.textAlign = "center";
                div.style.padding = "10px";

            }
            document.body.onclick = function () {
                div.style.display = "none";
            }
            event = event || window.event;

            var flag = false;
            if (event.keyCode == 40) {
                var table = document.getElementById("dataTable");
                var tr = table.getElementsByTagName("tbody")[0].firstChild;
                tr.focus();
                tr.className = "selectedtr";

            } else if (event.keyCode != 9 && event.keyCode != 13) {
                div.style.display = "block";
                value = that.value;
                if (value) {

                    Ajax.post("Handler2.ashx", "sqlstr=" + sqlstr, function (data) {
                        Totaljson = "";
                        flag = false;
                        //alert(data);
                        try {
                            json = eval("(" + data + ")");
                        } catch (e) {
                            json = "";
                        }
                        oldLength = 10;
                        //console.log(data);
                        if (json["Rows"] && json["Rows"].length > 0) {
                            nswitch(json["Rows"]);
                        }
                        var div = document.getElementById("div");

                        Ajax.post("Handler2.ashx", "sqlstr=" + allsqlstr, function (data) {
                            //console.log(data);
                            try {
                                Totaljson = eval("(" + data + ")");
                                if (Totaljson["Rows"] && Totaljson["Rows"].length > 0) {
                                    DataTables_jy.setting.data = Totaljson["Rows"];
                                    DataTables_jy.init();
                                }

                            } catch (e) {
                                Totaljson = "";
                            }

                        });
                        // nswitch(Totaljson["Rows"]);
                        div.onscroll = ScrollFun;

                    });
                }
                else {
                    var div = document.getElementById("yhh");
                    div.style.display = "none";
                }
                that.parentNode.style.position="relative";
                div.style.top = that.offsetTop + that.offsetHeight;
                var leftoff = parseFloat(that.offsetLeft);
                //var tar = that;
                //while (tar.parentNode) {
                //    tar = tar.parentNode;

                //    leftoff += parseFloat(tar.offsetLeft) || 0;
                //}
               
                div.style.left = leftoff;
            }
        }

    };
    window.NoUpdateTable = NoUpdateTable;
    function trclick(that) {
        //var input = document.getElementById("ctl00_ContentPlaceHolder1_txtPlanNo");
        //var inputer = document.getElementById("ctl00_ContentPlaceHolder1_txtInputer");
        //var P_Code = document.getElementById("ctl00_ContentPlaceHolder1_txtP_Code");
        //that.className = "selectedtr";
        //input.value = that.childNodes[1].innerHTML;
        //inputer.value = that.childNodes[2].innerHTML;
        //P_Code.value = that.childNodes[3].innerHTML;
        var div = document.getElementById("yhh");
        //input.focus();
        div.style.display = "none";

    }
    window.trclick = trclick;
    function nswitch(z_data) {

        DataTables_jy.defaultsetting.data = "";
        DataTables_jy.setting = {
            data: z_data,
            width: 460,
            keycol: 1000,
            pagesize: oldLength,
            orderCol: true

        }

        DataTables_jy.init();
        var div = document.getElementById("div");
        div.innerHTML = "";
        div.appendChild(DataTables_jy.createTable());
        var table = document.getElementById("dataTable");
        var tr = table.getElementsByTagName("tbody")[0].firstChild;
        tr&&(tr.className = "selectedtr");
    }
    function ScrollFun() {
        var input = document.getElementById("ctl00_ContentPlaceHolder1_txtPlanNo");

        var div = document.getElementById("div");
        var divSrocllTop = div.scrollTop;
        var divScrollHeight = div.scrollHeight;
        var divClientHeigth = div.clientHeight;
        if (divSrocllTop > (divScrollHeight - divClientHeigth) / 2) {


            oldLength = oldLength + 10;
            DataTables_jy.setting = {
                pagesize: oldLength

            }

            DataTables_jy.init();
            DataTables_jy.switchPage(1);


        }
    }
    var Ajax = {
        get: function (url, fn) {
            var obj = new XMLHttpRequest();  // XMLHttpRequest对象用于在后台与服务器交换数据          
            obj.open('GET', url, true);
            obj.onreadystatechange = function () {
                if (obj.readyState == 4 && obj.status == 200 || obj.status == 304) { // readyState == 4说明请求已完成
                    fn.call(this, obj.responseText);  //从服务器获得数据
                    ////console.log(obj);
                }
            };
            obj.send();
        },
        post: function (url, data, fn) {         // datat应为'a=a1&b=b1'这种字符串格式，在jq里如果data为对象会自动将对象转成这种字符串格式
            var obj = new XMLHttpRequest();
            obj.open("POST", url, true);
            obj.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=utf-8");  // 添加http头，发送信息至服务器时内容编码类型
            obj.onreadystatechange = function () {
                if (obj.readyState == 4 && (obj.status == 200 || obj.status == 304)) {  // 304未修改
                    fn.call(this, obj.responseText);
                    ////console.log(obj);

                }
            };
            obj.send(data);
        }
    }

    function match(value, name) {
        var patt = "[\\s\\S]*";
        var Regex = "/";
        for (var i = 0; i < value.length; i++) {
            Regex += value[i] + patt;
        }
        Regex += "/i";
        ////console.log(Regex);
        Regex = eval(Regex);
        alert(Regex.test(name) + "-----" + name);

        return Regex.test(name);
    }

    function GetText(value, name) {

        var array = [];

        for (var i = 0; i < value.length; i++) {
            if (i == 0) {
                var index = name.toLowerCase().indexOf(value.toLowerCase().charAt(i));
                // ////console.log(value + "------" + i + "--------" + value.charAt(i) + "-----" + name);
            }
            else
                index = name.toLowerCase().indexOf(value.toLowerCase().charAt(i), index + 1);
            array.push(index);

            // name = replaceChat(name, index, "<span style=\"color:blue\">" + name.charAt(i) + "</span>");


        }
        //console.log(array);
        var nameArr = name.split("");
        for (var t = 0; t < array.length; t++) {
            nameArr[array[t]] = "<span style=\"color:blue\">" + nameArr[array[t]] + "</span>";
            ////console.log(nameArr[t]);
        }
        name = nameArr.join("");

        // ////console.log(array + "-----" + name);
        //console.log(name);
        return name;

    }

})(window);