using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using HtmlAgilityPack;
using Ovaldi.Core.Models;

namespace Ovaldi.Core.SiteImport
{
    public class PageDownloadContext
    {
        public PageDownloadContext(SiteDownloadContext siteDownloadContext, PageLevel pageLevel, string pageHtml)
        {
            this.SiteDownloadContext = siteDownloadContext;

            this.PageLevel = pageLevel;
            this.PageHtml = pageHtml;

            HtmlDocument = new HtmlDocument();
            HtmlDocument.LoadHtml(pageHtml);
        }

        public SiteDownloadContext SiteDownloadContext { get; private set; }
        public PageLevel PageLevel { get; private set; }

        public string PageHtml { get; private set; }
                
        public HtmlDocument HtmlDocument { get; private set; }
    }
}