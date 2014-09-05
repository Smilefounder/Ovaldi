#region License
// 
// Copyright (c) 2013, Kooboo team
// 
// Licensed under the BSD License
// See the file LICENSE.txt for details.
// 
#endregion
using Kooboo.Common.ObjectContainer;
using Kooboo.Common.ObjectContainer.Dependency;
using Ovaldi.Core.Services;
using Ovaldi.Core.SiteFlow.Context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Ovaldi.Core.SiteFlow
{
    [Dependency(typeof(ISiteRequestFlow))]
    public class SiteRequestFlow : ISiteRequestFlow
    {
        #region .ctor
        IFrontSiteService _frontSiteService;
        PageRequestFlowAdapter _pageRequestFlowAdapter;
        public SiteRequestFlow(IFrontSiteService frontSiteService, PageRequestFlowAdapter pageRequestFlowAdapter)
        {
            _frontSiteService = frontSiteService;
            _pageRequestFlowAdapter = pageRequestFlowAdapter;
        }
        #endregion

        public SiteMappedContext MapSite(System.Web.HttpContext httpContext)
        {
            return _frontSiteService.MapSite(httpContext.Request);
        }

        public System.Web.HttpContextBase RenewHttpContext(System.Web.HttpContext httpContext, SiteMappedContext siteMappedContext)
        {
            return new FrontHttpContextWrapper(httpContext, siteMappedContext);
        }

        public IRequestHandler MapRequestHandler(System.Web.Mvc.ControllerContext controllerContext, SiteMappedContext siteMappedContext)
        {
            if (siteMappedContext == null)
            {
                return EngineContext.Current.Resolve<NoSiteRequestHandler>(new Parameter("controllerContext", controllerContext));
            }
            else
            {
                var pageMappedContext = _pageRequestFlowAdapter.MapPage(controllerContext, siteMappedContext);
                if (pageMappedContext != null)
                {
                    return new PageRequestHandler(controllerContext, _pageRequestFlowAdapter, siteMappedContext, pageMappedContext);
                }
                else
                {
                    return EngineContext.Current.Resolve<NoPageRequestHandler>(new Parameter("controllerContext", controllerContext), new Parameter("siteMappedContext", siteMappedContext));
                }
            }
        }

        public void ExecuteRequestHandler(System.Web.Mvc.ControllerContext controllerContext, IRequestHandler requestHandler, SiteMappedContext siteMappedContext)
        {
            requestHandler.ExecuteRequest();
        }

        public void EndSiteRequest(System.Web.HttpContextBase httpContext, SiteMappedContext siteMappedContext)
        {
            //end site request
        }
    }
}
