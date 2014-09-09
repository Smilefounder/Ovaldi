using Kooboo.Common.ObjectContainer.Dependency;
using Ovaldi.Core.Models;
using Ovaldi.Core.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;

namespace Ovaldi.Core.SiteImport
{
    [Dependency(typeof(IPageDownloader))]
    public class PageDownloader : IPageDownloader
    {
        IPageAnalyzer[] _analyzers;
        IHttpClient _httpClient;
        IPageProvider _pageProvider;
        public PageDownloader(IPageAnalyzer[] analyzers, IHttpClient httpClient, IPageProvider pageProvider)
        {
            this._analyzers = analyzers;
            this._httpClient = httpClient;
            this._pageProvider = pageProvider;
        }
        public void Download(PageLevel pageLevel, SiteDownloadContext siteDownloadContext)
        {

            var absolutePath = new Uri(pageLevel.Url).AbsolutePath;
            var pageName = absolutePath.Replace("/", "-");
            var page = new Page(siteDownloadContext.Site, pageName)
            {
                Routes = new[] { new PageRoute() {
                    Identifier= absolutePath
                } },
                IsDefault = pageLevel.Level == 0
            };
            if (_pageProvider.Get(page) == null)
            {
                var text = _httpClient.DownloadString(pageLevel.Url);
                if (!string.IsNullOrEmpty(text))
                {
                    var pageDownloadContext = new PageDownloadContext(siteDownloadContext, pageLevel, text);
                    foreach (var analyzer in _analyzers)
                    {
                        analyzer.Analyze(pageDownloadContext);
                    }
                    page.Html = pageDownloadContext.HtmlDocument.DocumentNode.InnerHtml;
                    _pageProvider.Add(page);
                    siteDownloadContext.DownloadedList.Add(pageLevel);
                }
            }

        }
    }
}