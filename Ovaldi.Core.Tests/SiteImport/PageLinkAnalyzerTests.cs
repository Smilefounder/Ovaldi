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
            var mock = new Moq.Mock<IPageDownloader>();
            List<string> links = new List<string>();
            mock.Setup(it => it.Download(Moq.It.IsAny<string>(), Moq.It.IsAny<ImportOptions>(), Moq.It.IsAny<int>()))
                .Callback<string, ImportOptions, int>((url, options, currentLevel) =>
                {
                    links.Add(url);
                });
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

            AnalyzeContext context = new AnalyzeContext(mock.Object, new ImportOptions() { SiteName = "Test_Analyze", Url = "localhost", Pages = 20, Deep = 1 }, "http://localhost", pageHtml, 1);

            pageLinkAnalyzer.Analyze(context);

            Assert.AreEqual(2, links.Count());
            Assert.AreEqual("http://localhost/page1", links.First());
            Assert.AreEqual("http://localhost/page2", links.Skip(1).First());
        }
    }
}
