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
    public class PageLevelComparer : IEqualityComparer<PageLevel>
    {
        public bool Equals(PageLevel x, PageLevel y)
        {
            return StringComparer.OrdinalIgnoreCase.Equals(x.Url, y.Url);
        }

        public int GetHashCode(PageLevel obj)
        {
            return obj.GetHashCode();
        }
    }
}
