using System.Data;
using System.Configuration;
using System.Collections;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Web.UI.HtmlControls;
using System.Data.SqlClient;
using jr.Source;
using System.Text;
using System;
using System.Web.UI.MobileControls;

public partial class Admin_print_sirun_FPDepotPackDetailPrint5 : System.Web.UI.Page
{
    public string LitNo = "";
    string ShipmentNo = "";
    string code = "";
    string type="";
    public string jsonData = "";
    public string NW = "";
    public string GW = "";
    public string ROLLS = "";
    public string METERS = "";
    protected void Page_Load(object sender, EventArgs e)
    {

        if (!Page.IsPostBack)
        {

            ShipmentNo = Request.QueryString["ShipmentNo"] == null ? "" : Request.QueryString["ShipmentNo"].ToString();
            code = Request.QueryString["code"] == null ? "" : Request.QueryString["code"].ToString();
            type = Request.QueryString["type"] == null ? "" : Request.QueryString["type"].ToString();
            if (type == "xml")
            {
                GetDataSource(ShipmentNo, code);

                //  this.Label1.Text = "word";
                Response.Clear();
                Response.Buffer = true;
                Response.Charset = "GB2312";
                Response.ContentType = "application nd.ms-Excel";
                Response.AddHeader("Content-Disposition", "inline;filename=" + HttpUtility.UrlEncode("细码单" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".xls", Encoding.UTF8));
                //Response.ContentEncoding = System.Text.Encoding.GetEncoding("GB2312");
                Response.ContentEncoding = System.Text.Encoding.UTF7;
                this.EnableViewState = false;
                //　定义一个输入流
                StringBuilder sb = new StringBuilder();
                System.IO.StringWriter oStringWriter = new System.IO.StringWriter(sb);
                System.Web.UI.HtmlTextWriter oHtmlTextWriter = new System.Web.UI.HtmlTextWriter(oStringWriter);
                //sb.Append("oHtmlTextWriter");
                this.RenderControl(oHtmlTextWriter);
                //this 表示输出本页，你也可以绑定datagrid,或其他支持obj.RenderControl()属性的控件
                Response.Write(sb.ToString());
                Response.End();

            }
            else if (type == "word")
            {
                GetDataSource(ShipmentNo, code);
                Response.Clear();
                Response.Buffer = true;
                Response.Charset = "GB2312";
                Response.ContentType = "application/ms-word";
                Response.AddHeader("Content-Disposition", "inline;filename=" + HttpUtility.UrlEncode("细码单" + DateTime.Now.ToString("yyyyMMddHHmmss") + ".doc", Encoding.UTF8));
                //Response.ContentEncoding = System.Text.Encoding.GetEncoding("GB2312");
                Response.ContentEncoding = System.Text.Encoding.UTF7;
                this.EnableViewState = false;
                //　定义一个输入流
                StringBuilder sb = new StringBuilder();
                System.IO.StringWriter oStringWriter = new System.IO.StringWriter(sb);
                System.Web.UI.HtmlTextWriter oHtmlTextWriter = new System.Web.UI.HtmlTextWriter(oStringWriter);
                //sb.Append("oHtmlTextWriter");
                this.RenderControl(oHtmlTextWriter);
                //this 表示输出本页，你也可以绑定datagrid,或其他支持obj.RenderControl()属性的控件
                Response.Write(sb.ToString());
                Response.End();

            }
            else
            {
                GetDataSource(ShipmentNo, code);
            }


        }



    }
    string unit = "";
   



   
    public void GetDataSource(string ShipmentNo, string code)
    {

        string[] str = ShipmentNo.Split(new string[] { "◆" }, StringSplitOptions.RemoveEmptyEntries);
        LitNo = str[0].ToString();

        SqlParameter[] arParms = new SqlParameter[5];
        arParms[0] = new SqlParameter("@UserCode", SqlDbType.VarChar, 10);
        arParms[0].Value = CommonApplication.GetUserCode();
        arParms[1] = new SqlParameter("@InOut", SqlDbType.VarChar, 20);
        arParms[1].Value = code;
        arParms[2] = new SqlParameter("@FPDepotInOutNo", SqlDbType.VarChar, 1000);
        arParms[2].Value =  ShipmentNo;
        arParms[3] = new SqlParameter("@intRetVal", SqlDbType.Int, 4);
        arParms[3].Direction = ParameterDirection.ReturnValue;
        arParms[4] = new SqlParameter("@strMessage", SqlDbType.VarChar, 50);
        arParms[4].Direction = ParameterDirection.Output;
        DataSet ds = Selection.exeProc("bp_pd_FPDepotPackDetail240", arParms);
        if (!arParms[3].Value.ToString().Trim().Equals("0"))
        {
            Response.Write("<script language=javascript>alert('" + arParms[4].Value.ToString().Trim() + "');window.returnValue='OK';parent.close();</script>");
            return;
        }

        if (ds.Tables[0].Rows.Count > 0)
        {
            NW = ds.Tables[0].Rows[0]["总净重"].ToString().Trim();
            GW = ds.Tables[0].Rows[0]["总重量"].ToString().Trim();
            ROLLS = ds.Tables[0].Rows[0]["总匹数"].ToString().Trim();
            METERS = ds.Tables[0].Rows[0]["总米数"].ToString().Trim();

        }
        if (ds.Tables[1].Rows.Count > 0)
        {
            jsonData = DataTableToJson(ds.Tables[1]);
        
        }
        Repeater1.DataSource = ds.Tables[4];
        Repeater1.DataBind();
       
       
    }


    public static string DataTableToJson(DataTable dt)
    {
        System.Text.StringBuilder jsonBuilder = new System.Text.StringBuilder();
        jsonBuilder.Append("{\"Name\":\"" + dt.TableName + "\",\"Rows");
        jsonBuilder.Append("\":[");
        if (dt.Rows.Count > 0)
        {
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                jsonBuilder.Append("{");
                for (int j = 0; j < dt.Columns.Count; j++)
                {
                    jsonBuilder.Append("\"");
                    jsonBuilder.Append(dt.Columns[j].ColumnName);
                    jsonBuilder.Append("\":\"");
                    jsonBuilder.Append(dt.Rows[i][j].ToString().Replace("\"", "\\\""));
                    jsonBuilder.Append("\",");
                }
                jsonBuilder.Remove(jsonBuilder.Length - 1, 1);
                jsonBuilder.Append("},");
            }
        }
        else
        {
            jsonBuilder.Append("[");
        }

        jsonBuilder.Remove(jsonBuilder.Length - 1, 1);
        jsonBuilder.Append("]");
        jsonBuilder.Append("}");
        return jsonBuilder.ToString();
    }  




}