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
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ovaldi.Core.SiteImport
{
    public class PageLevel
    {
        public PageLevel(string url, int level)
        {
            this.Url = url;
            this.Level = level;
        }
        public string Url { get; private set; }
        public int Level { get; private set; }
    }
}
