#region License
// 
// Copyright (c) 2013, Kooboo team
// 
// Licensed under the BSD License
// See the file LICENSE.txt for details.
// 
#endregion
using Kooboo.Common.ObjectContainer.Dependency;
using Kooboo.Common.Web;
using Ovaldi.Core.Models;
using Ovaldi.Core.Persistence;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Ovaldi.Core.SiteImport
{
    [Dependency(typeof(IPageAnalyzer), Key = "StyleSheetAnalyzer")]
    public class StyleSheetAnalyzer : IPageAnalyzer
    {
        IHttpClient _httpClient;
        ISiteFileProvider _siteFileProvider;
        public StyleSheetAnalyzer(IHttpClient httpClient, ISiteFileProvider siteFileProvider)
        {
            this._httpClient = httpClient;
            this._siteFileProvider = siteFileProvider;
        }
        public void Analyze(PageDownloadContext context)
        {
            var links = context.HtmlDocument.DocumentNode.Descendants()
                .Where(lnks => lnks.Name == "link" &&
                             lnks.Attributes["href"] != null &&
                             lnks.Attributes["rel"] != null &&
                             lnks.Attributes["rel"].Value != null &&
                             lnks.Attributes["rel"].Value.ToLower() == "stylesheet");



            foreach (var link in links)
            {
                var url = UriHelper.GetInsideAbsoluteUrl(context.PageLevel.Url, link.Attributes["href"].Value);
                if (!string.IsNullOrEmpty(url))
                {
                    var newUrl = DownloadStyleSheet(context, url);
                    link.Attributes["href"].Value = newUrl;
                }
            }
        }

        private string DownloadStyleSheet(PageDownloadContext pageDownloadContext, string styleUrl)
        {
            var absolutePath = new Uri(styleUrl).AbsolutePath;
            var filePath = Path.Combine("Styles", absolutePath.Trim('/'));
            if (!_siteFileProvider.IsFileExists(pageDownloadContext.SiteDownloadContext.Site, filePath))
            {
                var styleContent = DownloadStyleWithImages(pageDownloadContext, styleUrl, filePath);

                _siteFileProvider.AddFile(pageDownloadContext.SiteDownloadContext.Site, filePath, styleContent);
            }

            return UrlUtility.Combine("/", SiteExtensions.PREFIX_FRONT_PREVIEW_URL + pageDownloadContext.SiteDownloadContext.Site.AbsoluteName, filePath);
        }

        private string DownloadStyleWithImages(PageDownloadContext pageDownloadContext, string styleUrl, string styleFilePath)
        {
            var styleContent = _httpClient.DownloadString(styleUrl);
            MatchEvaluator urlDelegate = new MatchEvaluator(delegate(Match m)
            {
                // Change relative (to the original CSS) URL references to make them relative to the requested URL (controller / action)
                string url = m.Value;

                var rawAbsoluteUrl = new Uri(new Uri(styleUrl), url).ToString();
                string fileName = Path.GetFileName(url);

                var imagePath = "images/" + fileName;

                var styleImagePath = Path.Combine(Path.GetDirectoryName(styleFilePath), imagePath);

                if (!_siteFileProvider.IsFileExists(pageDownloadContext.SiteDownloadContext.Site, styleImagePath))
                {
                    try
                    {
                        var data = _httpClient.DownloadData(rawAbsoluteUrl);
                        _siteFileProvider.AddFile(pageDownloadContext.SiteDownloadContext.Site, styleImagePath, data);
                    }
                    catch (Exception e)
                    {
                        Kooboo.Common.Logging.Logger.LoggerInstance.Error(e.Message,e);
                    }                    
                }
                return imagePath;
            });

            styleContent = Regex.Replace(styleContent, @"(?<=url\(\s*([""']?))(?<url>[^'""]+?)(?=\1\s*\))", urlDelegate, RegexOptions.IgnoreCase);

            return styleContent;

        }
    }
}
