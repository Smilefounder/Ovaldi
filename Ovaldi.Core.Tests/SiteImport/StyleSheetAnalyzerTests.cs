#region License
// 
// Copyright (c) 2013, Kooboo team
// 
// Licensed under the BSD License
// See the file LICENSE.txt for details.
// 
#endregion
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Ovaldi.Core.Models;
using Ovaldi.Core.Persistence;
using Ovaldi.Core.SiteImport;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ovaldi.Core.Tests.SiteImport
{
    [TestClass]
    public class StyleSheetAnalyzerTests
    {
        [TestMethod]
        public void Test_Analyze()
        {

            var httpClientMock = new Mock<IHttpClient>();
            httpClientMock.Setup(it => it.DownloadString(It.IsAny<string>()))
                .Returns<string>((url) =>
                {
                    return "stylesheet";
                });

            var siteFileProviderMock = new Mock<ISiteFileProvider>();
            Dictionary<string, string> styles = new Dictionary<string, string>();
            siteFileProviderMock.Setup(it => it.AddFile(It.IsAny<Site>(), It.IsAny<string>(), It.IsAny<string>()))
                .Callback<Site, string, string>((site1, path, content) =>
                {
                    styles.Add(path, content);
                });


            var styleSheetAnalyzer = new StyleSheetAnalyzer(httpClientMock.Object, siteFileProviderMock.Object);

            var pageHtml = @"<html>
<head>
<link rel=""Stylesheet"" href=""/style1.css"" type=""text/css"" />
<link rel=""Stylesheet"" href=""/style2"" type=""text/css"" />
</head>
<body>
</body>
</html>";

            SiteDownloadContext siteDownloadContext = new SiteDownloadContext(null, new DownloadOptions() { SiteName = "Test_Analyze", Url = "localhost", Pages = 20, Deep = 1 }, null, null);
            PageDownloadContext pageDownloadContext = new PageDownloadContext(siteDownloadContext, new PageLevel("http://localhost", 1), pageHtml);

            styleSheetAnalyzer.Analyze(pageDownloadContext);

            Assert.AreEqual(2, styles.Count());
            Assert.AreEqual("stylesheet", styles["\\Styles\\style1.css"]);
            Assert.AreEqual("stylesheet", styles["\\Styles\\style2"]);


        }
    }
}
