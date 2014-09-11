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
using System.Threading.Tasks;

namespace Ovaldi.Core.SiteImport
{
    [Dependency(typeof(IPageAnalyzer), Key = "ScriptAnalyzer")]
    public class ScriptAnalyzer : IPageAnalyzer
    {

        IHttpClient _httpClient;
        ISiteFileProvider _siteFileProvider;
        public ScriptAnalyzer(IHttpClient httpClient, ISiteFileProvider siteFileProvider)
        {
            this._httpClient = httpClient;
            this._siteFileProvider = siteFileProvider;
        }
        public void Analyze(PageDownloadContext context)
        {
            var links = context.HtmlDocument.DocumentNode.Descendants()
                .Where(script => script.Name == "script" &&
                             script.Attributes["src"] != null);

            foreach (var link in links)
            {
                var url = UriHelper.GetInsideAbsoluteUrl(context.PageLevel.Url, link.Attributes["src"].Value);
                if (!string.IsNullOrEmpty(url))
                {
                    var newUrl = DownloadScript(context, url);
                    link.Attributes["src"].Value = newUrl;
                }
            }
        }

        private string DownloadScript(PageDownloadContext pageDownloadContext, string styleUrl)
        {
            var absolutePath = new Uri(styleUrl).AbsolutePath;
            var filePath = Path.Combine("Scripts", absolutePath.Trim('/'));
            if (!_siteFileProvider.IsFileExists(pageDownloadContext.SiteDownloadContext.Site, filePath))
            {
                var styleContent = _httpClient.DownloadString(styleUrl);
                if (!string.IsNullOrEmpty(styleContent))
                {
                    _siteFileProvider.AddFile(pageDownloadContext.SiteDownloadContext.Site, filePath, styleContent);
                }
            }

            return UrlUtility.Combine("/", SiteExtensions.PREFIX_FRONT_PREVIEW_URL + pageDownloadContext.SiteDownloadContext.Site.AbsoluteName, filePath);
        }
    }
}
