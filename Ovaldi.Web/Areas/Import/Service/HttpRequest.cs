using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;

namespace Ovaldi.Web.Areas.Import.Service
{
    public class HttpRequest
    {
        public HttpData Download(string url)
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
            return null;
        }
        protected virtual HttpData ProcessHttpWebResponse(HttpWebResponse httpWebResponse)
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

                    return new HttpData(contentType, data, text, encoding);
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
    }

}