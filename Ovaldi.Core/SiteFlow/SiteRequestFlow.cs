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

namespace Ovaldi.Core.SiteFlow
{
    public class SiteRequestFlow : ISiteRequestFlow
    {
        public System.Web.HttpContextBase RenewHttpContext(System.Web.HttpContextBase httpContext)
        {
            throw new NotImplementedException();
        }

        public SiteMappedContext MapSite(System.Web.HttpContextBase httpContext)
        {
            throw new NotImplementedException();
        }

        public IRequestHandler MapRequestHandler(System.Web.Mvc.ControllerContext controllerContext, SiteMappedContext siteMappedContext)
        {
            throw new NotImplementedException();
        }

        public void ExecuteRequestHandler(System.Web.Mvc.ControllerContext controllerContext, SiteMappedContext siteMappedContext, IRequestHandler requestHandler)
        {
            throw new NotImplementedException();
        }

        public void EndSiteRequest(System.Web.HttpContextBase httpContext, Models.Site site)
        {
            throw new NotImplementedException();
        }
    }
}
