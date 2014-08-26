#region License
// 
// Copyright (c) 2013, Kooboo team
// 
// Licensed under the BSD License
// See the file LICENSE.txt for details.
// 
#endregion
using Ovaldi.Core.SiteFlow.Context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace Ovaldi.Core.SiteFlow
{
    public class SiteRequestController : Controller
    {
        SiteRequestFlowAdapter _siteRequestFlowAdapter;
        SiteMappedContext _siteMappedContext;
        public SiteRequestController(SiteRequestFlowAdapter siteRequestFlowAdapter)
        {
            _siteRequestFlowAdapter = siteRequestFlowAdapter;
        }
        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            base.OnActionExecuting(filterContext);
            _siteMappedContext = ((FrontHttpContextWrapper)this.ControllerContext.HttpContext).SiteMappedContext;
        }
        public ActionResult Index()
        {
            var requestHandler = _siteRequestFlowAdapter.MapRequestHandler(this.ControllerContext, _siteMappedContext);

            requestHandler.ExecuteRequest();

            return null;
        }
        protected override void OnException(ExceptionContext filterContext)
        {
            base.OnException(filterContext);

            _siteRequestFlowAdapter.Error(this.ControllerContext, _siteMappedContext, filterContext.Exception);
        }
        protected override void OnResultExecuted(ResultExecutedContext filterContext)
        {
            base.OnResultExecuted(filterContext);

            _siteRequestFlowAdapter.EndSiteRequest(this.ControllerContext.HttpContext, _siteMappedContext);
        }
    }
}
