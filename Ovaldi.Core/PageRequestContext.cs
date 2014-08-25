#region License
// 
// Copyright (c) 2013, Kooboo team
// 
// Licensed under the BSD License
// See the file LICENSE.txt for details.
// 
#endregion
using Ovaldi.Core.Models;
using Ovaldi.Core.SiteFlow;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Ovaldi.Core
{
    public class PageRequestContext
    {
        public PageRequestContext(ControllerContext controllerContext, SiteMappedContext siteMappedContext, PageMappedContext pageMappedContext)
        {
            this.ControllerContext = controllerContext;
            this.SiteMappedContext = siteMappedContext;
            this.PageMappedContext = pageMappedContext;

            this.Site = siteMappedContext.Site;
            this.Page = pageMappedContext.Page;
        }
        public ControllerContext ControllerContext { get; private set; }
        public PageMappedContext PageMappedContext { get; private set; }

        public Site Site { get; private set; }

        public Page Page { get; private set; }

        public SiteMappedContext SiteMappedContext { get; private set; }

        public NameValueCollection AllQueryString { get; private set; }
    }
}
