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
        public void Test_AddFile_IsFileExists_GetFile_DeleteFile()
        {
            var dir = "Test_CreateFile";

            siteFileProvider.AddDirectory(sampleSite, dir);

            var absoluteFileName = Path.Combine(dir, "script1.js");
            var fileContent = "var a=1;";
            var fileData = Encoding.UTF8.GetBytes(fileContent);

            siteFileProvider.AddFile(sampleSite, absoluteFileName, fileContent);

            Assert.IsTrue(siteFileProvider.IsFileExists(sampleSite, absoluteFileName));

            var actualFileContent = siteFileProvider.GetFile(sampleSite, absoluteFileName);

            Assert.AreEqual(fileContent, actualFileContent);

            var actualFileData = siteFileProvider.GetFileData(sampleSite, absoluteFileName);
            
            var newFileContent = "var b = 1;";

            siteFileProvider.UpdateFile(sampleSite, absoluteFileName, newFileContent);

            var actualFileContent1 = siteFileProvider.GetFile(sampleSite, absoluteFileName);

            Assert.AreEqual(newFileContent, actualFileContent1);

            siteFileProvider.DeleteFile(sampleSite, absoluteFileName);

            Assert.IsFalse(siteFileProvider.IsFileExists(sampleSite, absoluteFileName));
        }
    }
}
