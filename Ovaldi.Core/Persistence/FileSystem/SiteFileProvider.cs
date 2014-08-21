#region License
// 
// Copyright (c) 2013, Kooboo team
// 
// Licensed under the BSD License
// See the file LICENSE.txt for details.
// 
#endregion
using Ovaldi.Core.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ovaldi.Core.Persistence.FileSystem
{
    public class SiteFileProvider : ISiteFileProvider
    {
        #region .ctor
        private IBaseDir _baseDir;
        public SiteFileProvider(IBaseDir baseDir)
        {
            this._baseDir = baseDir;
        }
        #endregion

        #region File
        public IEnumerable<SiteFile> AllFiles(Site site, string path)
        {
            var storage = site.GetIsolatedStorage(_baseDir);
            List<SiteFile> list = new List<SiteFile>();
            foreach (var item in storage.GetFileNames(path))
            {
                SiteFile file = new SiteFile()
                {
                    Site = site,
                    Directory = path,
                    FileName = item
                };
                list.Add(file);
            }
            return list;
        }

        public void AddFile(Site site, string absoluteFileName, string content)
        {
            var storage = site.GetIsolatedStorage(_baseDir);

            var memoryStream = new MemoryStream();

            memoryStream.WriteString(content);

            storage.CreateFile(absoluteFileName, memoryStream);
        }

        public void AddFile(Site site, string absoluteFileName, byte[] data)
        {
            var storage = site.GetIsolatedStorage(_baseDir);

            var memoryStream = new MemoryStream();

            memoryStream.Write(data, 0, data.Length);


            storage.CreateFile(absoluteFileName, memoryStream);
        }

        public void UpdateFile(Site site, string absoluteFileName, string content)
        {

            var storage = site.GetIsolatedStorage(_baseDir);

            using (var fileStorage = storage.OpenFile(absoluteFileName, FileMode.Open))
            {
                var memoryStream = new MemoryStream();
                memoryStream.WriteString(content);
                fileStorage.Stream = memoryStream;
                storage.SaveFile(fileStorage);
            }
        }

        public string GetFile(Site site, string absoluteFileName)
        {
            var storage = site.GetIsolatedStorage(_baseDir);

            using (var fileStorage = storage.OpenFile(absoluteFileName, FileMode.Open))
            {
                var content = fileStorage.Stream.ReadString();
                return content;
            }
        }
        public byte[] GetFileData(Site site, string absoluteFileName)
        {
            var storage = site.GetIsolatedStorage(_baseDir);

            using (var fileStorage = storage.OpenFile(absoluteFileName, FileMode.Open))
            {
                var data = fileStorage.Stream.ReadData();
                return data;
            }
        }
        public void DeleteFile(Site site, string absoluteFileName)
        {
            var storage = site.GetIsolatedStorage(_baseDir);
            storage.DeleteFile(absoluteFileName);
        }

        public bool IsFileExists(Site site, string absoluteFileName)
        {
            var storage = site.GetIsolatedStorage(_baseDir);

            return storage.FileExists(absoluteFileName);
        }
        #endregion

        #region Directory
        public IEnumerable<string> AllDirectories(Site site, string path)
        {
            var storage = site.GetIsolatedStorage(_baseDir);

            return storage.GetDirectoryNames(path);
        }

        public bool IsDirectoryExists(Site site, string dirPath)
        {
            var storage = site.GetIsolatedStorage(_baseDir);

            return storage.DirectoryExists(dirPath);
        }

        public void AddDirectory(Site site, string absoluteDirPath)
        {
            var storage = site.GetIsolatedStorage(_baseDir);

            storage.CreateDirectory(absoluteDirPath);
        }

        public void DeleteDirectory(Site site, string absoluteDirPath)
        {
            var storage = site.GetIsolatedStorage(_baseDir);
            storage.DeleteDirectory(absoluteDirPath);
        }
        #endregion



    }
}
