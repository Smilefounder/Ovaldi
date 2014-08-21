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

namespace Ovaldi.Core.Persistence
{
    public interface ISiteFileProvider
    {

        /// <summary>
        /// 
        /// </summary>
        /// <param name="site"></param>
        /// <param name="path"></param>
        /// <returns></returns>
        IEnumerable<SiteFile> AllFiles(Site site, string path);
        /// <summary>
        /// 添加文件
        /// </summary>
        /// <param name="site"></param>
        /// <param name="absoluteFileName"></param>
        /// <param name="content"></param>
        void AddFile(Site site, string absoluteFileName, string content);

        void AddFile(Site site, string absoluteFileName, byte[] data);

        /// <summary>
        /// 更新文件
        /// 只能更新文本内容的文件
        /// </summary>
        /// <param name="site"></param>
        /// <param name="absoluteFileName"></param>
        /// <param name="content"></param>
        void UpdateFile(Site site, string absoluteFileName, string content);

        string GetFile(Site site, string absoluteFileName);

        byte[] GetFileData(Site site, string absoluteFileName);

        void DeleteFile(Site site, string absoluteFileName);

        bool IsFileExists(Site site, string absoluteFileName);

        IEnumerable<string> AllDirectories(Site site, string path);
        bool IsDirectoryExists(Site site, string dirPath);
        void AddDirectory(Site site, string absoluteDirPath);
        void DeleteDirectory(Site site, string absoluteDirPath);
    }
}
