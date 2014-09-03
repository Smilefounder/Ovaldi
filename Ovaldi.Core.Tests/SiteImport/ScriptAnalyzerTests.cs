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
    public class ScriptAnalyzerTests
    {
        [TestMethod]
        public void Test_Analyze()
        {

            var httpClientMock = new Mock<IHttpClient>();
            httpClientMock.Setup(it => it.DownloadString(It.IsAny<string>()))
                .Returns<string>((url) =>
                {
                    return "script";
                });

            var siteFileProviderMock = new Mock<ISiteFileProvider>();
            Dictionary<string, string> styles = new Dictionary<string, string>();
            siteFileProviderMock.Setup(it => it.AddFile(It.IsAny<Site>(), It.IsAny<string>(), It.IsAny<string>()))
                .Callback<Site, string, string>((site1, path, content) =>
                {
                    styles.Add(path, content);
                });


            var scriptAnalyzer = new ScriptAnalyzer(httpClientMock.Object, siteFileProviderMock.Object);

            var pageHtml = @"<html>
<head>
<script src=""/script1.js"" type=""text/javascript""></script><script src=""/script2.js"" type=""text/javascript""></script></head>
<body>
</body>
</html>";

            SiteDownloadContext siteDownloadContext = new SiteDownloadContext(null, new DownloadOptions() { SiteName = "Test_Analyze", Url = "localhost", Pages = 20, Deep = 1 });
            PageDownloadContext pageDownloadContext = new PageDownloadContext(siteDownloadContext, new PageLevel("http://localhost", 1), pageHtml);

            scriptAnalyzer.Analyze(pageDownloadContext);

            Assert.AreEqual(2, styles.Count());
            Assert.AreEqual("script", styles["\\Scripts\\script1.js"]);
            Assert.AreEqual("script", styles["\\Scripts\\script2.js"]);


        }
    }
}
