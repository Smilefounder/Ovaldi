#region License
// 
// Copyright (c) 2013, Kooboo team
// 
// Licensed under the BSD License
// See the file LICENSE.txt for details.
// 
#endregion
using Kooboo.Common.ObjectContainer.Dependency;
using Ovaldi.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ovaldi.Core.SiteImport
{
    [Dependency(typeof(IPageAnalyzer), Key = "PageLinkAnalyzer")]
    public class PageLinkAnalyzer : IPageAnalyzer
    {
        public void Analyze(PageDownloadContext context)
        {
            var links = context.HtmlDocument.DocumentNode.Descendants()
                .Where(lnks => lnks.Name == "a" &&
                             lnks.Attributes["href"] != null &&
                             lnks.InnerText.Trim().Length > 0);
            //.Select(lnks => UriHelper.GetInsideAbsoluteUrl(context.PageUrl, lnks.Attributes["href"].Value))
            //.Where(it => !string.IsNullOrEmpty(it));


            if (context.PageLevel.Level < context.SiteDownloadContext.Options.Deep)
            {
                int count = 0;
                foreach (var link in links)
                {
                    var insideUrl = UriHelper.GetInsideAbsoluteUrl(context.PageLevel.Url, link.Attributes["href"].Value);

                    if (!string.IsNullOrEmpty(insideUrl))
                    {
                        if (count < context.SiteDownloadContext.Options.Pages)
                        {
                            var absolutePath = new Uri(insideUrl).AbsolutePath;
                            link.Attributes["href"].Value = "/" + SiteExtensions.PREFIX_FRONT_PREVIEW_URL + context.SiteDownloadContext.Site.AbsoluteName + absolutePath;
                            var nextPageLevel = new PageLevel(insideUrl, context.PageLevel.Level + 1);
                            if (!new PageLevelComparer().Equals(context.PageLevel, nextPageLevel) && !context.SiteDownloadContext.DownloadedPages.Contains(nextPageLevel, new PageLevelComparer()) && !context.SiteDownloadContext.DownloadQueue.Contains(nextPageLevel, new PageLevelComparer()))
                            {
                                context.SiteDownloadContext.DownloadQueue.Enqueue(nextPageLevel);
                                count++;
                            }
                        }
                        else
                        {
                            link.Attributes["href"].Value = insideUrl;
                        }
                    }
                }
            }
        }
    }
}
