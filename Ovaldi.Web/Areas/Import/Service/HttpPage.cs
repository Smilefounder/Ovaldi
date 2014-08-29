using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;

namespace Ovaldi.Web.Areas.Import.Service
{
    public class HttpPage
    {
        //static Regex linkRegex = new Regex(@"<a\s+(?:[^>]*?\\s+)?href=""([^""]*)""", RegexOptions.Compiled | RegexOptions.IgnoreCase);
        //static Regex linkRegex = new Regex(@"<a\s+(?:[^>]*?\\s+)?href=""([^""]*)""", RegexOptions.Compiled | RegexOptions.IgnoreCase);
        Uri _baseUri;
        public HttpPage(string siteName, string url, int deep)
        {
            this.Url = url;
            _baseUri = new Uri(url);
        }

        public string SiteName { get; private set; }
        public string Url { get; private set; }
        public int Deep { get; private set; }
        public bool IsDownloaded { get; private set; }
        public string Content { get; private set; }
        public IList<HttpPage> LinkPages { get; set; }

        public List<Style> Styles { get; private set; }

        public List<Script> Scripts { get; private set; }

        public List<Image> Images { get; private set; }

        public void Download()
        {

        }
        private void ParseLinks()
        {
            //var matchedLinks = linkRegex.Matches(this.Content);
            //List<string> urls = new List<string>();
            //foreach (Match match in matchedLinks)
            //{
            //    var urlGroup = match.Groups[1].Value;
            //    var uri = GetInternalUrl(urlGroup);
            //}

            //this.LinkPages = urls.Select(it => new HttpPage(this.SiteName, it, this.Deep + 1)).ToList();
        }
        private void ParseStyles()
        {

        }
        private void ParseScripts()
        {

        }
        private void ParseImages()
        {

        }



        /// <summary>
        /// 得到完整的站点内部地址，如果是站点外部就不下载
        /// </summary>
        /// <param name="url"></param>
        /// <returns></returns>
        private Uri GetInternalUrl(string url)
        {
            if (!string.IsNullOrEmpty(url))
            {
                if (Uri.IsWellFormedUriString(url, UriKind.Relative))
                {
                    var absoluteUrl = new Uri(_baseUri, url);
                    return absoluteUrl;
                }
                else if (Uri.IsWellFormedUriString(url, UriKind.Absolute))
                {
                    var uri = new Uri(url);
                    if (uri.Host == _baseUri.Host)
                    {
                        return uri;
                    }
                }
            }
            return null;
        }
    }
}