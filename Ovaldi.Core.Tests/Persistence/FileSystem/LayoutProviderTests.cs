#region License
// 
// Copyright (c) 2013, Kooboo team
// 
// Licensed under the BSD License
// See the file LICENSE.txt for details.
// 
#endregion
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Ovaldi.Core.Models;
using Ovaldi.Core.Persistence.FileSystem;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ovaldi.Core.Tests.Persistence.FileSystem
{
    [TestClass]
    public class LayoutProviderTests
    {
        Site sampleSite;
        LayoutProvider layoutProvider = new LayoutProvider(new BaseDir());

        [TestInitialize]
        public void CreateSampleSite()
        {
            SiteProvider siteProvider = new SiteProvider(new BaseDir());

            sampleSite = new Site("SampleSite");

            if (siteProvider.Get(sampleSite) == null)
            {
                sampleSite.Bindings = new[] { 
                    new Binding(){
                        Domain  = "192.168.1.1"
                    }
                };
                siteProvider.Add(sampleSite);
            }
        }
        [TestMethod]
        public void Test_Add_Get_Updata_Remove()
        {
            var layout = new Layout(sampleSite, "Test_Add_Get_Updata_Remove")
            {
                TemplateType = "Razor",
                TemplateExtension = ".cshtml",
                Body = "layout content"
            };
            //添加layout
            layoutProvider.Add(layout);

            //获取layout
            var actualLayout1 = layoutProvider.Get(layout);

            //断言判断
            Assert.AreEqual(layout.Name, actualLayout1.Name);

            Assert.AreEqual(layout.Site, actualLayout1.Site);

            Assert.AreEqual(layout.Body, actualLayout1.Body);

            //修改layout
            actualLayout1.Body = "updated layout content";

            layoutProvider.Update(actualLayout1, layout);
            //重新获取layout
            var actualLayout2 = layoutProvider.Get(layout);

            //修改断言
            Assert.AreEqual(actualLayout1.Body, actualLayout2.Body);

            //删除view
            layoutProvider.Remove(layout);

            //删除断言
            var actualLayout3 = layoutProvider.Get(layout);

            Assert.IsNull(actualLayout3);

        }

        [TestMethod]
        public void Test_All()
        {
            var layout = new Layout(sampleSite, "Test_All")
            {
                TemplateType = "Razor",
                TemplateExtension = ".cshtml",
                Body = "layout content"
            };
            //添加layout
            layoutProvider.Add(layout);

            var allViews = layoutProvider.All(sampleSite);

            Assert.AreEqual(1, allViews.Count());

            layoutProvider.Remove(layout);
        }
    }
}
