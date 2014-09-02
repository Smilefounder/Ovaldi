using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using HtmlAgilityPack;

namespace Ovaldi.Core.SiteImport
{
    public class AnalyzeContext
    {
        public AnalyzeContext(IPageDownloader pageDownloader, ImportOptions options, string pageUrl, string pageHtml, int currentLevel)
        {
            this.PageDownloader = pageDownloader;
            this.Options = options;
            this.PageUrl = pageUrl;
            this.PageHtml = pageHtml;
            this.CurrentLevel = currentLevel;

            HtmlDocument = new HtmlDocument();
            HtmlDocument.LoadHtml(pageHtml);
        }
        public IPageDownloader PageDownloader { get; private set; }
        public ImportOptions Options { get; private set; }
        public string PageUrl { get; private set; }

        public string PageHtml { get; private set; }

        public int CurrentLevel { get; private set; }

        public HtmlDocument HtmlDocument { get; private set; }
    }
}