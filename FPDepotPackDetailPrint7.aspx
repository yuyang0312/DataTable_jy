<%@ Page Language="C#" AutoEventWireup="true" CodeFile="FPDepotPackDetailPrint7.aspx.cs" Inherits="Admin_print_sirun_FPDepotPackDetailPrint5" %>

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=8"/>
    <title></title>
    <script src="../../Script/DataTables_jy/DataTables_jy.js" charset="utf-8"></script>
    <link rel="stylesheet" href="../../Script/DataTables_jy/dataTables_jy.css">
    <style type="text/css">

        .auto-style1 {
            width: 660px;
            border-collapse: collapse;
            table-layout:fixed;
            word-break:break-all;
            margin-top:20px;

        }
        tr.higher td{
        height:20px;
        font-size:14px;
        }
        .auto-style2 {
            height: 10px;
        }
        .auto-style3 {
            width: 700px;
            border-collapse: collapse;
            border-style: solid;
            border-width: 1px;
        }

        .auto-style5 {
            width: 40px;
            height: 10px;
        }
        td {
            border:1px solid #000;
            font-size:10pt;
            text-align:center;
            word-break:break-all;
            /*white-space: nowrap;
            text-overflow: ellipsis;
        
            overflow: hidden;*/
        }
        .noborder td {
            border:none;
            font-size:16px;
        }
        .toleft td{
            text-align:left;
        }
        body {
            font-family: SimHei;
        }
        .kbrow td {
        height:0 !important;
        }
      
        </style>
</head>
<body>
    <div id="PrintDiv">
    <div id="div"></div>
    <div style="height:20px;clear:both"></div>
    <table class="auto-style1 ">
        <tr>
            <td>COL NO</td>
            <td>COL NAME</td>
            <td>ORDER(MT)</td>
            <td>Q'TY(MT)</td>
            <td>ROLL</td>
       
        </tr>
        <asp:Repeater ID="Repeater1" runat="server">
               <ItemTemplate>
                <tr>
                <td><%# Eval("色号") %>&nbsp;</td>
                
                <td><%# Eval("客户颜色") %>&nbsp;</td>
                <td>&nbsp;</td>
                <td><%# Eval("米数") %>&nbsp;</td>
                <td><%# Eval("卷数") %>&nbsp;</td>
                </tr>
               </ItemTemplate>

            </asp:Repeater>
        <tr>
            <td colspan="2">TTL</td>
            <td></td>
            <td><%=METERS %></td>
            <td>
                <%=ROLLS %>
            </td>            
        </tr>
    </table>
     </div>    
    <script>
        window.onload=function(){
            var type='<%=type%>';
            

           
                var o_Data= <%=jsonData%>;
                DataTables_jy.setting = {
            
                    data:o_Data["Rows"],
                    theadMeaasge: {   //头部信息
                        headStr: "COL NO,1,1,色号颜色,#PCS LENGTH,1,10,,"
                    },
                    strTotdRule: {//字符串转化为td,tr规则
                        splitStr: ["◆", "|", "^"],//分割字符
                    },
                    Print: {
                        //Title: ["DETAIL    PACKING    LIST","","INVOICE NO:","ORDER NO:"],
                        //Style: ["text-align:center;font-size:25px;font-weight:bold","height:20px","text-align:left;font-size:16px;font-weight:bold","text-align:left;font-size:16px;font-weight:bold"],
                        spanCols: ["色号颜色"],
                        Items: ["色号颜色","卷号","米数","净重","毛重"],
                        Width: ["60px", "60px", "60px", "60px", "60px", "60px", "60px", "60px", "60px", "60px", "60px", "60px", "60px", "80px"],
                        circleRule:{
                            maxCount:10,
                            margin:1,
                            //circleItem:["卷号"],//横向循环
                            vcircleItem:["卷号","米数","净重","毛重"]//纵向循环
                        },
                        //r_Sum:[
                        //    {title:"METERS",sum:"米数",rl:"ROW"},
                        //    {title:"CTTLM",sum:"RollCount",rl:"ROW"}
                    
                        //],
                        //circletd:[
                        //        {
                        //            fatherEle:"缸号",
                        //            top:"ROLLS^1^1^^|MTS^1^1^^|ROLLS^1^1^^|MTS^1^1^^|ROLLS^1^1^^|MTS^1^1^^|ROLLS^1^1^^|MTS^1^1^^|ROLLS^1^1^^|MTS^1^1^^|^1^1^^|^1^1^^",
                        //            bottom:"TOTAL^1^10^^|--米数^1^1^^|--RollCount^1^1^^"

                        //        }
                        //],
                        //bottom:"TOTAL^1^12^^|<%=METERS %>^1^1^^|<%=ROLLS %>^1^1^^◆TOTAL: <%=ROLLS %>ROLLS/<%=METERS %>MTS^1^14^^^color:red;font-size:20px",
                        //title:otitle
                        //c_Sum:[
                        //{title:"TOTAL",sum:["RollCount","净重","毛重","米数"],cl:"total",tr:totaltr},
                        //]
                        // pageBreak:["P_Code"],
                        // onet_num:2,
                        // allrows:10
               
                    }
                }
                DataTables_jy.init();
                var tableDiv=DataTables_jy.CreataPrintTable();
                var div=document.getElementById("div");
                div.appendChild(tableDiv);
                //if(type=="xml"){
                //    var div=document.getElementById("PrintDiv");
                //    window.clipboardData.setData("Text", div.innerHTML);
                //    try {
                //        var ExApp = new ActiveXObject("Excel.Application")
                //        var ExWBk = ExApp.workbooks.add()
                //        var ExWSh = ExWBk.worksheets(1)
                //        ExWSh.Columns("A:AE").ColumnWidth = 5; //设置宽度
                //        ExApp.ActiveSheet.Rows.RowHeight = 25; //设置行高
                //        ExApp.DisplayAlerts = false
                //        ExApp.visible = true
                //    }
                //    catch (e) {
                //        alert("您的电脑没有安装Microsoft Excel软件！")
                //        return false
                //    }
                //    ExWBk.worksheets(1).PageSetup.LeftMargin = 1 / 0.035; //页边距 左2厘米  
                //    ExWBk.worksheets(1).PageSetup.RightMargin = 1 / 0.035; //页边距 右3厘米，  
                //    ExWBk.worksheets(1).PageSetup.TopMargin = 1 / 0.035; //页边距 上4厘米，  
                //    ExWBk.worksheets(1).PageSetup.BottomMargin = 1 / 0.035; //页边距 下5厘米  
                //    ExWBk.worksheets(1).PageSetup.HeaderMargin = 1 / 0.035; //页边距 页眉1厘米  
                //    ExWBk.worksheets(1).PageSetup.FooterMargin = 1 / 0.035; //页边距 页脚2厘米 
                //    ExWBk.worksheets(1).Paste;
                
                //}
        }
    </script>
</body>
    
</html>