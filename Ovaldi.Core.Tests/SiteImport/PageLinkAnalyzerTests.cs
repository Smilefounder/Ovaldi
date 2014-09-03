#region License
// 
// Copyright (c) 2013, Kooboo team
// 
// Licensed under the BSD License
// See the file LICENSE.txt for details.
// 
#endregion
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Ovaldi.Core.SiteImport;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ovaldi.Core.Tests.SiteImport
{
    [TestClass]
    public class PageLinkAnalyzerTests
    {
        [TestMethod]
        public void Test_Analyze()
        {
            var pageLinkAnalyzer = new PageLinkAnalyzer();

            var pageHtml = @"<html>
<head>

</head>
<body>
<div>
<a href=""page1"">page1</a>
<a href=""/page2"">page2</a>
<a href=""http://www.kooboo.com"">outsidelink</a>
<a href=""#"">emptyclick</a>
</div>
</body>
            </html>";
            SiteDownloadContext siteDownloadContext = new SiteDownloadContext(null, new DownloadOptions() { SiteName = "Test_Analyze", Url = "localhost", Pages = 20, Deep = 1 });
            PageDownloadContext pageDownloadContext = new PageDownloadContext(siteDownloadContext, new PageLevel("http://localhost", 1), pageHtml);

            pageLinkAnalyzer.Analyze(pageDownloadContext);

            Assert.AreEqual(2, siteDownloadContext.DownloadQueue.Count);
        }
    }
}
