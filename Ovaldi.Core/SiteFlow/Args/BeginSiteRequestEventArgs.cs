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
        public BeginSiteRequestEventArgs(HttpContext httpContext, SiteMappedContext siteMappedContext)
        {
            this.HttpContext = httpContext;
        }
        public HttpContext HttpContext { get; private set; }
        public SiteMappedContext SiteMappedContext { get; private set; }
    }
}
