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
    public class SiteProviderTests
    {
        SiteProvider siteProvider = new SiteProvider(new BaseDir());
        [TestInitialize]
        public void TestInitializer()
        {
            //Kooboo.Common.ObjectContainer.EngineContext.DefaultTypeFinder = new Kooboo.Common.Web.ObjectContainer.WebAppTypeFinder();
        }
        [TestMethod]
        public void Test_Add()
        {
            var site = new Site("SampleSite_" + DateTime.Now.ToString("yyyyMMddhhmmss"));
            site.Bindings = new[] { 
                new Binding(){
                Domain="127.0.0.1"
                }
            };
            site.Culture = "zh-cn";

            siteProvider.Add(site);
        }

        [TestMethod]
        public void Test_All()
        {
            var siteProvider = new SiteProvider(new BaseDir());

            var sites = siteProvider.All();

            Assert.AreEqual(1, sites.Count());
        }

        [TestMethod]
        public void Test_ChildSites()
        {
            var siteProvider = new SiteProvider(new BaseDir());
            var site = new Site("SampleSite");

            var childSites = siteProvider.ChildSites(site);

            Assert.AreEqual(3, childSites.Count());
        }
    }
}
