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
    public class PageProviderTests
    {
        Site sampleSite;
        PageProvider pageProvider = new PageProvider(new BaseDir());

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
            var page = new Page(sampleSite, "Home")
                {
                    CacheToDisk = true
                };
            //添加页面
            pageProvider.Add(page);

            //获取页面
            var actualPage1 = pageProvider.Get(page);
            //断言判断
            Assert.AreEqual(page.FullName, actualPage1.FullName);

            Assert.AreEqual(page.Site, actualPage1.Site);

            Assert.AreEqual(page.CacheToDisk, actualPage1.CacheToDisk);

            //修改页面
            actualPage1.ContentTitle = "Content title1";

            pageProvider.Update(actualPage1, page);
            //重新获取页面
            var actualPage2 = pageProvider.Get(page);
            //修改断言
            Assert.AreEqual(actualPage1.ContentTitle, actualPage2.ContentTitle);

            //删除页面
            pageProvider.Remove(page);

            //删除断言
            var actualPage3 = pageProvider.Get(page);

            Assert.IsNull(actualPage3);


        }

        [TestMethod]
        public void Test_All()
        {

        }
        [TestMethod]
        public void Test_AddSubPage_ChildPages()
        {

        }
    }
}
