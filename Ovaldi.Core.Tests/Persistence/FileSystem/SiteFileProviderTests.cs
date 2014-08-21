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
using Ovaldi.Core.Persistence;
using Ovaldi.Core.Persistence.FileSystem;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ovaldi.Core.Tests.Persistence.FileSystem
{
    [TestClass]
    public class SiteFileProviderTests
    {
        Site sampleSite;
        SiteFileProvider siteFileProvider = new SiteFileProvider(new BaseDir());

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
        public void Test_CreateDirectory_DeleteDirectory_IsDirectoryExists()
        {
            var dir = "Scripts";

            siteFileProvider.AddDirectory(sampleSite, dir);

            Assert.IsTrue(siteFileProvider.IsDirectoryExists(sampleSite, dir));

            siteFileProvider.DeleteDirectory(sampleSite, dir);

            Assert.IsFalse(siteFileProvider.IsDirectoryExists(sampleSite, dir));
        }
        [TestMethod]
        public void Test_CreateSubDirectory()
        {
            var dir = "Scripts";

            var subDir = Path.Combine(dir, "Sub");

            siteFileProvider.AddDirectory(sampleSite, subDir);

            Assert.IsTrue(siteFileProvider.IsDirectoryExists(sampleSite, subDir));

            siteFileProvider.DeleteDirectory(sampleSite, subDir);

            Assert.IsFalse(siteFileProvider.IsDirectoryExists(sampleSite, subDir));

        }

        [TestMethod]
        public void Test_AddFile()
        {
            var dir = "Test_CreateFile";

            siteFileProvider.AddDirectory(sampleSite, dir);

            var absoluteFileName = Path.Combine(dir, "script1.js");
            siteFileProvider.AddFile(sampleSite, absoluteFileName, "var a=1;");

            Assert.IsTrue(siteFileProvider.IsFileExists(sampleSite, absoluteFileName));

            var file = siteFileProvider.GetFile(sampleSite, absoluteFileName);            

        }
    }
}
