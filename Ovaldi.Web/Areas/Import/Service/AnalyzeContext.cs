using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Ovaldi.Web.Areas.Import.Service
{
    public class AnalyzeContext
    {
        public AnalyzeContext(ImportOptions options, string pageUrl, string pageHtml, int currentLevel)
        {
            this.Options = options;
            this.PageUrl = pageUrl;
            this.PageHtml = pageHtml;
            this.CurrentLevel = currentLevel;
        }
        public ImportOptions Options { get; private set; }
        public string PageUrl { get; private set; }

        public string PageHtml { get; private set; }

        public int CurrentLevel { get; private set; }
    }
}