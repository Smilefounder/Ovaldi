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
        //[ClassInitialize]
        //public void TestInitializer()
        //{
        //    //Kooboo.Common.ObjectContainer.EngineContext.DefaultTypeFinder = new Kooboo.Common.Web.ObjectContainer.WebAppTypeFinder();

        //    //var sampleSite = new Site("SampleSite");

        //    //if (siteProvider.Get(sampleSite) == null)
        //    //{
        //    //    sampleSite.Bindings = new[] { 
        //    //        new Binding(){
        //    //            Domain  = "192.168.1.1"
        //    //        }
        //    //    };                
        //    //}
        //}
        [TestMethod]
        public void Test_Add_Get_Update_Remove()
        {
            var site = new Site("SampleSite_" + DateTime.Now.ToString("yyyyMMddhhmmss"));
            site.Bindings = new[] { 
                new Binding(){
                Domain="127.0.0.1"
                }
            };
            site.Culture = "zh-cn";

            siteProvider.Add(site);

            var site1 = siteProvider.Get(site);

            Assert.AreEqual(site.Name, site1.Name);
            Assert.AreEqual(site.AbsoluteName, site1.AbsoluteName);

            Assert.AreEqual(site.Bindings[0].Domain, site1.Bindings[0].Domain);

            Assert.AreEqual(1, site1.Bindings.Length);


            site1.Bindings = site1.Bindings.Concat(new[] {new Binding(){
                Domain="localhost"                
                }
            }).ToArray();

            siteProvider.Update(site1, site);

            var site2 = siteProvider.Get(site);

            Assert.AreEqual(2, site1.Bindings.Length);

            siteProvider.Remove(site);

            var site3 = siteProvider.Get(site);

            Assert.IsNull(site3);

            //测试成功后，创建一个默认的SampleSite
            var sampleSite = new Site("SampleSite");

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
        public void Test_All()
        {
            var sites = siteProvider.All();

            Assert.AreEqual(1, sites.Count());
        }

        [TestMethod]
        public void Test_AddSubSite_ChildSites()
        {
            var sampleSite = new Site("SampleSite");
            var cnSubSite = new Site(sampleSite, "cn")
            {
                Bindings = new[] { 
                    new Binding(){
                        Domain  = "192.168.1.1",
                        SitePath = "cn"
                    }
                }
            };
            siteProvider.Add(cnSubSite);

            var childSites = siteProvider.ChildSites(sampleSite);

            Assert.AreEqual(1, childSites.Count());

            var actualSubSite = siteProvider.Get(cnSubSite);

            Assert.AreEqual("SampleSite~cn", actualSubSite.AbsoluteName);

            Assert.AreEqual("192.168.1.1", actualSubSite.Bindings[0].Domain);
            Assert.AreEqual("cn", actualSubSite.Bindings[0].SitePath);

            siteProvider.Remove(cnSubSite);
        }
    }
}
