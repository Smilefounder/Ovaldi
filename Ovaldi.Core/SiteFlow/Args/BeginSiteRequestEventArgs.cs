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
using System.Web;

namespace Ovaldi.Core.SiteFlow.Args
{
    public class BeginSiteRequestEventArgs
    {
        public BeginSiteRequestEventArgs(HttpContextBase httpContext)
        {
            this.HttpContext = httpContext;
        }
        public HttpContextBase HttpContext { get; private set; }
    }
}
