using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;

namespace Ovaldi.Core.SiteImport
{
    public class PageDownloader : IPageDownloader
    {
        IPageAnalyzer[] _analyzers;
        public PageDownloader(IPageAnalyzer[] analyzers)
        {
            this._analyzers = analyzers;
        }
        public void Download(string url, ImportOptions options, int currentLevel)
        {
            var text = DownloadText(url);
            foreach (var analyzer in _analyzers)
            {
                analyzer.Analyze(new AnalyzeContext(this, options, url, text, currentLevel));
            }
        }
        private string DownloadText(string url)
        {
            var text = (new WebClient()).DownloadString(url);
            return text;
        }

    }
}