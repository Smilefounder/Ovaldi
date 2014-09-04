#region License
// 
// Copyright (c) 2013, Kooboo team
// 
// Licensed under the BSD License
// See the file LICENSE.txt for details.
// 
#endregion
using Ovaldi.Core.Models;
using Kooboo.Common.Globalization;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using Kooboo.Common.ObjectContainer.Dependency;
using Ovaldi.Core.Services;

namespace Ovaldi.Core.SiteFlow.PageFlow
{
    [Dependency(typeof(IPageRequestFlow))]
    public class PageRequestFlow : IPageRequestFlow
    {
        IFrontPageService _frontPageService;
        public PageRequestFlow(IFrontPageService frontPageService)
        {
            _frontPageService = frontPageService;
        }
        public PageMappedContext MapPage(System.Web.Mvc.ControllerContext controllerContext, SiteMappedContext siteMappedContext)
        {
            return _frontPageService.MapPage(controllerContext.HttpContext, siteMappedContext);
            //var page = new Page(siteMappedContext.Site, "Home");
            //return new PageMappedContext()
            //{
            //    Page = page,
            //    MatchedVirtualPath = "/",
            //    QueryStringPath = ""
            //};
        }

        public Page_Context CreatePageContext(System.Web.Mvc.ControllerContext controllerContext, SiteMappedContext siteMappedContext, PageMappedContext pageMappedContext)
        {
            var pageRequestContext = new PageRequestContext(controllerContext, siteMappedContext, pageMappedContext);
            return new Page_Context(controllerContext, pageRequestContext);
        }

        public System.Web.Mvc.ActionResult ExecutePage(Page_Context page_context)
        {
            //execute plugins
            //execute data rule/data source
            //initlize title/metadata
            //execute module actions
            return ViewPage(page_context);
        }
        protected virtual ActionResult ViewPage(Page_Context page_context)
        {
            var layout = new Layout(page_context.PageRequestContext.SiteMappedContext.Site, page_context.PageLayout).LastVersion(page_context.PageRequestContext.SiteMappedContext.Site);

            if (layout == null)
            {
                throw new Exception(string.Format("The layout does not exists. Layout name:{0}".Localize(), page_context.PageLayout));
            }

            return new ContentResult() { Content = page_context.PageRequestContext.Page.Html };
            //ViewResult viewResult = new FrontViewResult(ControllerContext, layout.FileExtension.ToLower(), layout.TemplateFileVirutalPath);

            //if (viewResult != null)
            //{
            //    viewResult.ViewData = this.ViewData;
            //    viewResult.TempData = this.TempData;
            //}

            //return viewResult;
        }
        public void RenderPage(Page_Context page_context, System.Web.Mvc.ActionResult actionResult)
        {
            actionResult.ExecuteResult(page_context.ControllerContext);
        }

        public void EndPageRequest(Page_Context page_context)
        {

        }
    }
}
