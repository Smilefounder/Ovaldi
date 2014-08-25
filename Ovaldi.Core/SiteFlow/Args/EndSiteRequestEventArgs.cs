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
using System.Web;

namespace Ovaldi.Core.SiteFlow.Args
{
    public class EndSiteRequestEventArgs
    {
        public EndSiteRequestEventArgs(HttpContextBase httpContext, Site site)
        {
            this.HttpContext = httpContext;
            this.Site = site;
        }
        public HttpContextBase HttpContext { get; private set; }
        public Site Site { get; private set; }

    }
}
