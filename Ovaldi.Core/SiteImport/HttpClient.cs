#region License
// 
// Copyright (c) 2013, Kooboo team
// 
// Licensed under the BSD License
// See the file LICENSE.txt for details.
// 
#endregion
using Kooboo.Common.ObjectContainer.Dependency;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Ovaldi.Core.SiteImport
{
    [Dependency(typeof(IHttpClient))]
    public class HttpClient : IHttpClient
    {
        public string DownloadString(string url)
        {
            //为什么不能用WebClient? 因为确定encoding需要html内容
            //var text = (new WebClient()).DownloadString(url);
            //return text;
            try
            {
                var httpWebRequest = (HttpWebRequest)HttpWebRequest.Create(url);

                httpWebRequest.AutomaticDecompression = DecompressionMethods.Deflate | DecompressionMethods.GZip;

                httpWebRequest.Method = "GET";
                httpWebRequest.AllowAutoRedirect = false;

                var webResponse = httpWebRequest.GetResponse();

                if (webResponse is HttpWebResponse)
                {
                    return ProcessHttpWebResponse((HttpWebResponse)webResponse);
                }
            }
            catch (Exception e)
            {
                Kooboo.Common.Logging.Logger.LoggerInstance.Error(e.Message, e);
            }
            
            return null;
        }
        protected virtual string ProcessHttpWebResponse(HttpWebResponse httpWebResponse)
        {
            using (var responseStream = httpWebResponse.GetResponseStream())
            {
                // save data to a memorystream
                using (MemoryStream rawData = new MemoryStream())
                {
                    byte[] buffer = new byte[1024];
                    int read = responseStream.Read(buffer, 0, buffer.Length);
                    while (read > 0)
                    {
                        rawData.Write(buffer, 0, read);
                        read = responseStream.Read(buffer, 0, buffer.Length);
                    }

                    var contentType = httpWebResponse.Headers["content-type"];
                    var data = rawData.ReadData();
                    string text = null;
                    Encoding encoding = Encoding.Default;



                    // if the content-type is text/html, the response text will conbined with the Kooboo CMS page HTML.
                    // or else will output the response stream directly.
                    if (string.IsNullOrEmpty(contentType) || contentType.ToLower().Contains("text"))
                    {
                        encoding = ParseEncoding(rawData, contentType);
                        text = ReadResponseText(rawData, encoding);
                    }

                    return text;
                }
            }
        }
        private static Encoding ParseEncoding(MemoryStream rawdata, string contentType)
        {
            String charset = null;
            String ctype = contentType;
            if (ctype != null)
            {
                int ind = ctype.IndexOf("charset=");
                if (ind != -1)
                {
                    charset = ctype.Substring(ind + 8);
                }
            }

            //
            // if ContentType is null, or did not contain charset, we search in body
            //
            if (charset == null)
            {
                MemoryStream ms = rawdata;
                ms.Seek(0, SeekOrigin.Begin);

                StreamReader srr = new StreamReader(ms, Encoding.ASCII);
                String meta = srr.ReadToEnd();

                if (meta != null)
                {
                    var matchCharset = Regex.Match(meta, "\\bcharset=[\"|\']?([^\"|^']+)[\"|']?");
                    if (matchCharset != null)
                    {
                        charset = matchCharset.Groups["1"].Value;
                    }
                }
            }

            Encoding e = null;
            if (charset == null)
            {
                e = Encoding.UTF8; //default encoding
            }
            else
            {
                try
                {
                    e = Encoding.GetEncoding(charset);
                }
                catch (Exception ee)
                {
                    e = Encoding.UTF8;
                }
            }

            return e;
        }
        private static String ReadResponseText(MemoryStream rawdata, Encoding encoding)
        {
            //
            // first see if content length header has charset = calue
            //
            rawdata.Seek(0, SeekOrigin.Begin);

            StreamReader sr = new StreamReader(rawdata, encoding);

            String s = sr.ReadToEnd();

            return s;
        }
        public byte[] DownloadData(string url)
        {
            try
            {
                var data = (new WebClient()).DownloadData(url);
                return data;
            }
            catch (Exception e)
            {
                Kooboo.Common.Logging.Logger.LoggerInstance.Error(e.Message, e);
            }
            return null;

        }
    }
}
