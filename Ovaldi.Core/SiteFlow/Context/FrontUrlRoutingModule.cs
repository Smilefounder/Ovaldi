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
using System.Web.Routing;
using System.Web;

using System.Web.Mvc;

namespace Ovaldi.Core.SiteFlow.Context
{
    public class FrontUrlRoutingModule : UrlRoutingModule
    {
        protected override void Init(HttpApplication application)
        {
            application.PostResolveRequestCache += new EventHandler(application_PostResolveRequestCache);
        }

        void application_PostResolveRequestCache(object sender, EventArgs e)
        {
            var httpContext = ((HttpApplication)sender).Context;
            var siteRequestAdapter = Kooboo.Common.ObjectContainer.EngineContext.Current.Resolve<SiteRequestFlowAdapter>();
            var siteMappedContext = siteRequestAdapter.MapSite(httpContext);

            HttpContextBase context = new FrontHttpContextWrapper(httpContext, siteMappedContext);
            this.PostResolveRequestCache(context);            
        }
    }
}
