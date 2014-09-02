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
    public class ScriptSheetAnalyzer : IPageAnalyzer
    {
        public void Analyze(AnalyzeContext context)
        {
            var links = context.HtmlDocument.DocumentNode.Descendants()
                .Where(script => script.Name == "script" &&
                             script.Attributes["src"] != null)
                             .Select(script => UriHelper.GetInsideAbsoluteUrl(context.PageUrl, script.Attributes["src"].Value))
                             .Where(it => !string.IsNullOrEmpty(it));


            foreach (var scriptUrl in links.Take(context.Options.Pages))
            {
                DownloadScript(context, scriptUrl);
            }
        }

        private void DownloadScript(AnalyzeContext analyzeContext, string scriptUrl)
        {

        }
    }
}
