<%@ Page Language="C#" AutoEventWireup="true" CodeFile="FPDepotPackDetailPrint5.aspx.cs" Inherits="Admin_print_sirun_FPDepotPackDetailPrint5" %>

<html xmlns="http://www.w3.org/1999/xhtml">
<head id="Head1" runat="server">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <meta http-equiv="X-UA-Compatible" content="IE=8"/>
    <title></title>
    <script src="../../Script/DataTables_jy/DataTables_jy.js" charset="utf-8"></script>
    <link rel="stylesheet" href="../../Script/DataTables_jy/dataTables_jy.css">
    <style type="text/css">

        .auto-style1 {
            width: 680px;
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
            height:17px;
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
    <div id="div"></div>
    <div style="height:20px;clear:both"></div>
    <table class="auto-style1 ">
        <tr>
            <td>COL NO</td>
            <td>ROLLS</td>
            <td>N.W</td>
            <td>G.W</td>
            <td>METERS</td>            
        </tr>
        <asp:Repeater ID="Repeater1" runat="server">
               <ItemTemplate>
                <tr>
                <td><%# Eval("颜色") %>&nbsp;</td>
                <td><%# Eval("卷数") %>&nbsp;</td>
                <td><%# Eval("净重") %>&nbsp;</td>
                <td><%# Eval("毛重") %>&nbsp;</td>
                <td><%# Eval("米数") %>&nbsp;</td>
                </tr>
               </ItemTemplate>

            </asp:Repeater>
        <tr>
            <td>TTL</td>
            <td><%=ROLLS %></td>
            <td><%=NW %></td>
            <td><%=GW %></td>
            <td><%=METERS %></td>            
        </tr>
    </table>
        
         
    <script>
        var o_Data= <%=jsonData%>;
        var totaltr=document.createElement("tr");
       
        var td=document.createElement("td");
        td.colSpan="7";
        td.innerHTML="Total";
        totaltr.appendChild(td);
        
        var td=document.createElement("td");
        td.innerHTML='<%=ROLLS %>';
        totaltr.appendChild(td);
        var td=document.createElement("td");
        td.innerHTML='<%=NW %>';
        totaltr.appendChild(td);
        var td=document.createElement("td");
        td.innerHTML='<%=GW %>';
        totaltr.appendChild(td);
        var td=document.createElement("td");
        td.innerHTML='<%=METERS %>';
        totaltr.appendChild(td);


        DataTables_jy.setting = {
            
            data:o_Data["Rows"],
            theadMeaasge: {   //头部信息
                headStr: "DSN NO,2,1,花型,#COL NO,2,1,颜色,#LOT,2,1,缸号,#ROLL NO.,2,1,,#DETAIL  PER  ROLL,1,3,,#ROLLS,2,1,,#N.W,2,1,,#G.W,2,1,,#METERS,2,1,,◆N.W,1,1,,#G.W,1,1,,#METERS,1,1,,"
            },
            Print: {
                Title: ["DETAIL    PACKING    LIST","","INVOICE NO:","ORDER NO:"],
                Style: ["text-align:center;font-size:25px;font-weight:bold","height:20px","text-align:left;font-size:16px;font-weight:bold","text-align:left;font-size:16px;font-weight:bold"],
                spanCols: ["颜色", "缸号"],
                Items: ["花型", "颜色", "缸号", "卷号", "净重", "毛重", "米数"],
                Width: ["80px", "80px", "80px", "80px", "80px", "80px", "80px", "80px", "80px", "80px", "80px"],

                r_Sum:[
                    {title:"CTTLM",sum:"RollCount",rl:"颜色"},
                    {title:"NW",sum:"净重",rl:"颜色"},
                    {title:"GW",sum:"毛重",rl:"颜色"},
                    {title:"METERS",sum:"米数",rl:"颜色"}
                ],
                c_Sum:[
                {title:"TOTAL",sum:["RollCount","净重","毛重","米数"],cl:"total",tr:totaltr},
                ]
                // pageBreak:["P_Code"],
                // onet_num:2,
                // allrows:10
               
            }
        }
        DataTables_jy.init();
        var tableDiv=DataTables_jy.CreataPrintTable();
        var div=document.getElementById("div");
        div.appendChild(tableDiv);
    </script>
</body>
    
</html>