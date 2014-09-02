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

namespace Ovaldi.Core.Models
{
    public class HtmlMeta
    {
        public string Name { get; set; }
        public string Content { get; set; }
        public string HttpEquiv { get; set; }
        public Dictionary<string, string> Attributes { get; set; }
    } 

}
