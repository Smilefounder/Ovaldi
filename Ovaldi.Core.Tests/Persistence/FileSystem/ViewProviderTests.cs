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
    public class ViewProviderTests
    {
        Site sampleSite;
        ViewProvider viewProvider = new ViewProvider(new BaseDir());

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
            var view = new View(sampleSite, "Test_Add_Get_Updata_Remove")
            {
                TemplateType = "Razor",
                TemplateExtension = ".cshtml",
                Body = "view content"
            };
            //添加view
            viewProvider.Add(view);

            //获取view
            var actualView1 = viewProvider.Get(view);

            //断言判断
            Assert.AreEqual(view.Name, actualView1.Name);

            Assert.AreEqual(view.Site, actualView1.Site);

            Assert.AreEqual(view.Body, actualView1.Body);

            //修改view
            actualView1.Body = "updated view content";

            viewProvider.Update(actualView1, view);
            //重新获取view
            var actualView2 = viewProvider.Get(view);

            //修改断言
            Assert.AreEqual(actualView1.Body, actualView2.Body);

            //删除view
            viewProvider.Remove(view);

            //删除断言
            var actualView3 = viewProvider.Get(view);

            Assert.IsNull(actualView3);

        }

        [TestMethod]
        public void Test_All()
        {
            var view = new View(sampleSite, "Test_All")
            {
                TemplateType = "Razor",
                TemplateExtension = ".cshtml",
                Body = "view content"
            };
            //添加view
            viewProvider.Add(view);

            var allViews = viewProvider.All(sampleSite);

            Assert.AreEqual(1, allViews.Count());
            
            viewProvider.Remove(view);
        }
    }
}
