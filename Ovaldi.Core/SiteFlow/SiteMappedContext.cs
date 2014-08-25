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
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ovaldi.Core.SiteFlow
{
    public class SiteMappedContext
    {
        public Site Site { get; set; }
        public FrontRequestChannel RequestChannel { get; set; }
        public Binding MatchedBinding { get; set; }
    }
}
