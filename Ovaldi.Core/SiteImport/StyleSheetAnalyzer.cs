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
    public class StyleSheetAnalyzer : IPageAnalyzer
    {        
        public void Analyze(AnalyzeContext context)
        {
            var links = context.HtmlDocument.DocumentNode.Descendants()
                .Where(lnks => lnks.Name == "link" &&
                             lnks.Attributes["href"] != null &&
                             lnks.Attributes["rel"] != null &&
                             lnks.Attributes["rel"].Value == "stylesheet")
                             .Select(lnks => UriHelper.GetInsideAbsoluteUrl(context.PageUrl, lnks.Attributes["href"].Value))
                             .Where(it => !string.IsNullOrEmpty(it));


            foreach (var stylesheetUrl in links.Take(context.Options.Pages))
            {
                DownloadStyleSheet(context, stylesheetUrl);
            }
        }

        private void DownloadStyleSheet(AnalyzeContext analyzeContext, string styleUrl)
        {

        }
    }
}
