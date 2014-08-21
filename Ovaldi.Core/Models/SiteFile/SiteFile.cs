#region License
// 
// Copyright (c) 2013, Kooboo team
// 
// Licensed under the BSD License
// See the file LICENSE.txt for details.
// 
#endregion
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ovaldi.Core.Models
{
    /// <summary>
    /// 样式或者脚本文件
    /// </summary>
    public class SiteFile : ISiteObject
    {
        /// <summary>
        /// 属于哪个站点下的文件
        /// </summary>
        public Site Site { get; set; }

        public string FileName { get; set; }

        /// <summary>
        /// 文件在站点内的绝对路径，比如样式文件在站点内的相对目录就是：
        /// Styles/Style1.css
        /// Styles/folder1/form.css
        /// 站点内的脚本文件就是：
        /// Scripts/script1.js
        /// Scripts/folder1/script2.js
        /// 
        /// </summary>
        public string AbsoluteName
        {
            get
            {
                return Path.Combine(Directory, FileName);
            }
        }    
        /// <summary>
        /// 文件所在的目录名，比如：
        /// /
        /// /folder1
        /// /folder1/folder2
        /// </summary>
        public string Directory { get; set; }
    }
}
