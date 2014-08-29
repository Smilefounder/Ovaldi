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
    public class SiteDownloader
    {
        static Regex linkRegex = new Regex(@"<a\s+(?:[^>]*?\\s+)?href=""([^""]*)""", RegexOptions.Compiled | RegexOptions.IgnoreCase);
        ImportOptions _options;
        List<string> downloadeds = new List<string>();
        public SiteDownloader(ImportOptions options)
        {
            _options = options;
        }
        public List<string> Download()
        {
            var rootUrl = _options.Url;
            if (!string.IsNullOrEmpty(rootUrl))
            {
                DownloadUrl(rootUrl, 0);
            }
            return downloadeds;
        }
        private void DownloadUrl(string url, int deep)
        {
            if (downloadeds.Count < _options.Pages)
            {
                string html = DownloadHtml(url);
                var urls = GetUrls(url, html);
                SavePage(_options.SiteName, url, html);
                downloadeds.Add(url);
                if (deep < _options.Deep)
                {
                    foreach (var nextDeepUrl in urls)
                    {
                        if (!downloadeds.Contains(nextDeepUrl, StringComparer.OrdinalIgnoreCase))
                        {
                            DownloadUrl(nextDeepUrl, deep + 1);
                        }
                    }
                }
            }

        }
        private void SavePage(string siteName, string url, string htmlContent)
        {

        }
        private List<string> GetUrls(string url, string html)
        {
            var matchedLinks = linkRegex.Matches(html);
            List<string> urls = new List<string>();
            var baseUri = new Uri(url);
            foreach (Match match in matchedLinks)
            {
                var urlGroup = match.Groups[1].Value;
                if (!string.IsNullOrEmpty(urlGroup))
                {
                    if (Uri.IsWellFormedUriString(urlGroup, UriKind.Relative))
                    {
                        var absoluteUrl = new Uri(baseUri, urlGroup);
                        urls.Add(absoluteUrl.ToString());
                    }
                    else if (Uri.IsWellFormedUriString(urlGroup, UriKind.Absolute))
                    {
                        var uri = new Uri(urlGroup);
                        if (uri.Host == baseUri.Host)
                        {
                            urls.Add(urlGroup);
                        }
                    }
                }
            }

            return urls;

        }
        private string DownloadHtml(string url)
        {
            var httpWebRequest = (HttpWebRequest)HttpWebRequest.Create(url);

            httpWebRequest.AutomaticDecompression = DecompressionMethods.Deflate | DecompressionMethods.GZip;

            httpWebRequest.Method = "GET";
            httpWebRequest.AllowAutoRedirect = false;

            var webResponse = httpWebRequest.GetResponse();

            //if (webResponse is HttpWebResponse)
            //{
            //    return ProcessHttpWebResponse((HttpWebResponse)webResponse);
            //}
            return null;
        }

    }
}