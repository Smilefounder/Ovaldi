#region License
// 
// Copyright (c) 2013, Kooboo team
// 
// Licensed under the BSD License
// See the file LICENSE.txt for details.
// 
#endregion
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ovaldi.Core.SiteImport
{
    public class PageLinkAnalyzer : IPageAnalyzer
    {
        public void Analyze(AnalyzeContext context)
        {
            var links = context.HtmlDocument.DocumentNode.Descendants()
                .Where(lnks => lnks.Name == "a" &&
                             lnks.Attributes["href"] != null &&
                             lnks.InnerText.Trim().Length > 0)
                             .Select(lnks => UriHelper.GetInsideAbsoluteUrl(context.PageUrl, lnks.Attributes["href"].Value))
                             .Where(it => !string.IsNullOrEmpty(it));


            if (context.CurrentLevel <= context.Options.Deep)
            {
                foreach (var nextLevelUrl in links.Take(context.Options.Pages))
                {
                    DownloadNextLevelPages(context, nextLevelUrl);
                }
            }
        }

        private void DownloadNextLevelPages(AnalyzeContext analyzeContext, string nextLevelUrl)
        {
            analyzeContext.PageDownloader.Download(nextLevelUrl, analyzeContext.Options, analyzeContext.CurrentLevel + 1);
        }

    }
}
